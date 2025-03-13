const WebhookLog = require('@/schemas/webhook-log');

const createWebhookLog = async (objectData) => {
  try {
    const webhookLog = await WebhookLog.create(objectData);
    return webhookLog;
  } catch (error) {
    console.error('Error Creating Webhook Log:', error);
    throw error;
  }
};

module.exports = { createWebhookLog };