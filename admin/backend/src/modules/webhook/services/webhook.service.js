const { WebhookLog: webhookLogModel } = require('../models/webhook.model');

const handleWebhookLog = async (webhookData) => {
  try {
    const webhookLog = new webhookLogModel(webhookData);
    await webhookLog.save();
    return webhookLog;
  } catch (error) {
    console.error('Error Processing Webhook:', error);
    throw error;
  }
};

module.exports = { handleWebhookLog };