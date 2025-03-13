const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  requestUrl: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
    default: 'POST',
  },
  referer: {
    type: String,
    required: true,
    default: 'unknown',
  },
  payload: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

webhookLogSchema.index({ event: 1, timestamp: -1 });

const WebhookLog = mongoose.model('WebhookLog', webhookLogSchema, 'webhook_logs');
module.exports = WebhookLog;