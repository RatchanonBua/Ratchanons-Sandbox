const { getLineProfile } = require('@/utils/line-api');

// const hookMessageModel = require('@/modules/webhooks/models/hook-message.model');
const hookUserModel = require('@/modules/webhooks/models/hook-user.model');

const processLineWebhook = async (payload) => {
  if (payload && typeof payload === 'object' && Object.keys(payload).length > 0 && Array.isArray(payload.events) && payload.events.length > 0) {
    const destination = payload.destination;
    const eventList = payload.events;
    for (const eventData of eventList) {
      if (eventData.source?.userId) {
        // Initial Variables
        const externalUserId = eventData.source.userId;
        const replyToken = eventData.replyToken;
        const timestamp = eventData.timestamp;
        let hookUserId = "";
        // Search User for Create or Update
        const targetUser = {
          hookOrigin: 'line',
          externalOriginId: destination,
          externalUserId: externalUserId,
        };
        let hookUserObj = await hookUserModel.fetchHookUser('one', targetUser, {}, '_id externalOriginId externalUserId displayName');
        // Build Data for Create or Update
        const displayName = (hookUserObj) ? hookUserObj.displayName : 'ไม่ทราบชื่อ';
        const infoUser = {
          externalReplyToken: replyToken,
          displayName: displayName,
          lastActivityAt: (timestamp) ? new Date(timestamp) : new Date(),
        };
        // LINE Profile
        const profileData = await getLineProfile(externalUserId);
        if (profileData) {
          infoUser.profileImage = profileData.pictureUrl;
          infoUser.displayName = profileData.displayName;
        }
        // Check Search Result
        if (hookUserObj) {
          // Update Data
          hookUserId = hookUserObj._id;
          await hookUserModel.updateHookUser('id', { _id: hookUserId }, infoUser, true);
        } else {
          // Insert Data
          const createUser = Object.assign({}, targetUser, infoUser);
          hookUserObj = await hookUserModel.createHookUser(createUser);
          hookUserId = hookUserObj._id;
        }
      }
    }
  }
};

module.exports = { processLineWebhook };