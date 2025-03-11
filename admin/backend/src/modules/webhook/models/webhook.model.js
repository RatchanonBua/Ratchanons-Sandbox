const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
    default: 'unknown',
  },
  payload: {
    type: Object,
    required: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema, 'webhook_logs');

module.exports = { WebhookLog };