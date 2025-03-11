const mongoose = require('mongoose');

const hookMessageSchema = new mongoose.Schema({
  hookUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HookUser',
    required: true,
  },
  hookOrigin: {
    type: String,
    enum: ['line', 'facebook', 'google'],
    default: 'line',
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file'],
    required: true,
    default: 'text',
  },
  messageText: {
    type: String,
    default: null,
    required: function () {
      return this.messageType === 'text';
    },
  },
  mediaUrl: {
    type: String,
    default: null,
    required: function () {
      return ['image', 'video', 'audio', 'file'].includes(this.messageType);
    },
  },
  messageStatus: {
    type: String,
    enum: ['draft', 'pending', 'success', 'failed'],
    default: 'pending',
  },
  messageDirection: {
    type: String,
    enum: ['in', 'out'],
    default: 'in',
  },
  adminUserId: {
    // Admin User ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const HookMessage = mongoose.model('HookMessage', hookMessageSchema, 'hook_messages');
module.exports = HookMessage;