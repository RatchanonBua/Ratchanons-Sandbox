const { getLineProfile } = require('@/utils/line-api');

const hookMessageModel = require('@/modules/webhooks/models/hook-message.model');
const hookUserModel = require('@/modules/webhooks/models/hook-user.model');

const defaultInfoMessage = {
  messageStatus: 'success',
  messageDirection: 'in',
  messageContext: {
    quoteToken: null,
    quotedMessageId: null,
    isRedelivery: false,
    timestampSent: new Date(),
  },
};

const processLineWebhook = async (payload) => {
  // เช็ค Payload ว่า Valid หรือไม่
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.events) || payload.events.length === 0) {
    return;
  }
  // ดำเนินการประมวลผล Payload
  const destination = payload.destination;
  const eventList = payload.events;
  for (const eventData of eventList) {
    const externalUserId = eventData.source?.userId || null;
    if (!externalUserId) { continue; }
    // ---- ---- ---- ---- //
    // Initial Variables
    const replyToken = eventData.replyToken;
    const timestamp = eventData.timestamp;
    let hookUserId = '';
    // Search User for Create or Update
    const targetUser = { hookOrigin: 'line', externalOriginId: destination, externalUserId: externalUserId };
    let hookUserObj = await hookUserModel.fetchHookUser('one', targetUser, {}, '_id externalOriginId externalUserId displayName') || null;
    // Build Data for Create or Update
    const displayName = (hookUserObj) ? hookUserObj.displayName : 'ไม่ทราบชื่อ';
    const infoUser = { externalReplyToken: replyToken, displayName: displayName };
    // LINE Profile
    let profileData = null;
    try {
      profileData = await getLineProfile(externalUserId);
    } catch (error) {
      console.error('Error Fetching LINE Profile:', error);
    }
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
      const createUser = { ...targetUser, ...infoUser };
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
      if (!hookMessage || typeof hookMessage !== 'object' || Array.isArray(hookMessage)) { continue; }
      // Search Message for Create or Update
      let hookMessageObj = null;
      const targetMessage = { hookUser: hookUserId, hookOrigin: 'line', hookEventId: eventData.webhookEventId };
      if (eventData.webhookEventId) {
        hookMessageObj = await hookMessageModel.fetchHookMessage('one', targetMessage, {}, '_id');
      }
      // Query Quoted Message
      let quotedMessageId = null;
      if (hookMessage.quotedMessageId) {
        const quotedMessageObj = await hookMessageModel.fetchHookMessage('one', { hookOrigin: 'line', messageId: hookMessage.quotedMessageId }, {}, '_id');
        quotedMessageId = quotedMessageObj ? quotedMessageObj._id : null;
      }
      // Build Data for Create or Update
      const infoMessage = Object.assign({}, defaultInfoMessage, {
        messageId: hookMessage.id,
        quotedMessage: quotedMessageId,
        messageContext: {
          ...defaultInfoMessage.messageContext,
          quoteToken: hookMessage.quoteToken || null,
          quotedMessageId: hookMessage.quotedMessageId || null,
          isRedelivery: eventData.deliveryContext?.isRedelivery || false,
          timestampSent: (timestamp) ? new Date(timestamp) : defaultInfoMessage.messageContext.timestampSent,
        },
      });
      // Check Message Type
      let shortMessageText = '';
      let isValidMessageType = false;
      // ---- ---- ---- ---- //
      if (hookMessage.type === 'text' && !hookMessage.emojis) {
        const messageText = hookMessage.text;
        // Set Info Message
        infoMessage.messageType = 'text';
        infoMessage.messageText = messageText;
        // Valid Message
        shortMessageText = (messageText.length > 252) ? messageText.substring(0, 252) + "..." : messageText;
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
          const createMessage = { ...targetMessage, ...infoMessage };
          await hookMessageModel.createHookMessage(createMessage);
        }
        await hookUserModel.updateHookUser('id', { _id: hookUserId }, { lastMessage: shortMessageText, lastActivityAt: lastActivityAt }, true);
      }
    }
    // ---- ---- ---- ---- //
  }
};

module.exports = { processLineWebhook };