const { getLineProfile } = require('@/utils/line-api');

const hookMessageModel = require('@/modules/webhooks/models/hook-message.model');
const hookUserModel = require('@/modules/webhooks/models/hook-user.model');

const processLineWebhook = async (payload) => {
  if (payload && typeof payload === 'object' && Object.keys(payload).length > 0 && Array.isArray(payload.events) && payload.events.length > 0) {
    const destination = payload.destination;
    const eventList = payload.events;
    for (const eventData of eventList) {
      if (eventData.source?.userId) {
        // ---- ---- ---- ---- //
        // Initial Variables
        const externalUserId = eventData.source.userId;
        const replyToken = eventData.replyToken;
        const timestamp = eventData.timestamp;
        let hookUserId = '';
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
          // lastActivityAt: (timestamp) ? new Date(timestamp) : new Date(),
        };
        // LINE Profile
        const profileData = await getLineProfile(externalUserId);
        if (profileData) {
          infoUser.profileImage = profileData.pictureUrl;
          infoUser.displayName = profileData.displayName || displayName;
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
        // ---- ---- ---- ---- //
        // Message Type
        if (eventData.type === 'message') {
          // Initial Variables
          const hookMessage = eventData.message;
          let hookMessageId = '';
          // Check Message Object
          if (hookMessage && typeof hookMessage === 'object' && !Array.isArray(hookMessage)) {
            // Search Message for Create or Update
            const targetMessage = {
              hookUser: hookUserId,
              hookOrigin: 'line',
              hookEventId: eventData.webhookEventId,
            };
            let hookMessageObj = await hookMessageModel.fetchHookMessage('one', targetMessage, {}, '_id');
            // Query Quoted Message
            let quotedMessageId = null;
            if (hookMessage.quotedMessageId) {
              const targetQuotedMessage = {
                hookOrigin: 'line',
                messageId: hookMessage.quotedMessageId,
              };
              let quotedMessageObj = await hookMessageModel.fetchHookMessage('one', targetQuotedMessage, {}, '_id');
              if (quotedMessageObj) { quotedMessageId = quotedMessageObj._id; }
            }
            // Build Data for Create or Update
            const infoMessage = {
              messageId: hookMessage.id,
              quotedMessage: quotedMessageId,
              messageStatus: 'success',
              messageDirection: 'in',
              messageContext: {
                quoteToken: hookMessage.quoteToken || null,
                quotedMessageId: hookMessage.quotedMessageId || null,
                isRedelivery: eventData.deliveryContext?.isRedelivery || false,
                timestampSent: (timestamp) ? new Date(timestamp) : new Date(),
              },
            };
            // Check Message Type
            let shortMessageText = '';
            let isValidMessageType = false;
            // ---- ---- ---- ---- //
            if (hookMessage.type === 'text') {
              if (hookMessage.emojis) { continue; }
              const messageText = hookMessage.text;
              // Set Info Message
              infoMessage.messageType = 'text';
              infoMessage.messageText = messageText;
              // Valid Message
              shortMessageText = messageText.substring(0, 252) + "...";
              isValidMessageType = true;
            } else if (hookMessage.type === 'sticker' && hookMessage.stickerId) {
              // Set Info Message
              infoMessage.messageType = 'sticker';
              infoMessage.mediaUrl = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${hookMessage.stickerId}/android/sticker.png`;
              infoMessage.messageContext.stickerId = hookMessage.stickerId || null;
              infoMessage.messageContext.packageId = hookMessage.packageId || null;
              infoMessage.messageContext.stickerType = hookMessage.stickerResourceType || null;
              infoMessage.messageContext.keywords = hookMessage.keywords || [];
              // Valid Message
              shortMessageText = 'Sticker Message'
              isValidMessageType = true;
            }
            // ---- ---- ---- ---- //
            // Check Search Result
            if (isValidMessageType) {
              const lastActivityAt = (timestamp) ? new Date(timestamp) : new Date();
              if (hookMessageObj) {
                // Update Data
                hookMessageId = hookMessageObj._id;
                await hookMessageModel.updateHookMessage('id', { _id: hookMessageId }, infoMessage, true);
              } else {
                // Insert Data
                const createMessage = Object.assign({}, targetMessage, infoMessage);
                hookMessageObj = await hookMessageModel.createHookMessage(createMessage);
                hookMessageId = hookMessageObj._id;
              }
              await hookUserModel.updateHookUser('id', { _id: hookUserId }, { lastMessage: shortMessageText, lastActivityAt: lastActivityAt }, true);
            }
          }
        }
        // ---- ---- ---- ---- //
      }
    }
  }
};

module.exports = { processLineWebhook };