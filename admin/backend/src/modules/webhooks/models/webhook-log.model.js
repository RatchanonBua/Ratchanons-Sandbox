const { WebhookLog: WebhookLogModel } = require('@/models/webhook-log');

const createWebhookLog = async (webhookData) => {
  try {
    const webhookLog = new WebhookLogModel(webhookData);
    await webhookLog.save();
    return webhookLog;
  } catch (error) {
    console.error('Error Creating Webhook Log:', error);
    throw error;
  }
};

module.exports = { createWebhookLog };