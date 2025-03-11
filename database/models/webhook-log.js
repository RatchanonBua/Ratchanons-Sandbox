const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    default: 'unknown',
  },
  event: {
    type: String,
    required: true,
  },
  payload: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

webhookLogSchema.index({ source: 1, event: 1 });

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema, 'webhook_logs');
module.exports = WebhookLog;