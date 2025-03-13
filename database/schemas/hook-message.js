const mongoose = require('mongoose');

const messageContextSchema = new mongoose.Schema({
  quoteToken: {
    type: String,
    default: null,
  },
  quotedMessageId: {
    type: String,
    default: null,
  },
  stickerId: {
    type: String,
    default: null,
  },
  packageId: {
    type: String,
    default: null,
  },
  stickerType: {
    type: String,
    default: null,
  },
  keywords: {
    type: [String],
    default: [],
  },
  isRedelivery: {
    type: Boolean,
    default: false,
  },
  timestampSent: {
    type: Date,
    default: null,
  },
}, { _id: false });

const hookMessageSchema = new mongoose.Schema({
  hookUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HookUser',
    required: true,
  },
  hookOrigin: {
    type: String,
    enum: ['line', 'facebook', 'google'],
    required: true,
  },
  hookEventId: {
    type: String,
    default: null,
  },
  messageId: {
    type: String,
    required: true,
  },
  quotedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HookMessage',
    default: null,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'location', 'sticker'],
    required: true,
    default: 'text',
  },
  messageText: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        return (this.messageType === 'text' || this.messageType === 'location') ? v !== null : true;
      },
      message: "messageText is required for text and location type",
    },
  },
  mediaUrl: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        return (['image', 'video', 'audio', 'file', 'sticker'].includes(this.messageType)) ? v !== null : true;
      },
      message: "mediaUrl is required for image, video, audio, file, or sticker type",
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
  messageContext: {
    type: messageContextSchema,
    default: {},
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

hookMessageSchema.index({ hookUser: 1 });
hookMessageSchema.index({ hookOrigin: 1, hookEventId: 1 }, { unique: true });
hookMessageSchema.index({ hookOrigin: 1, messageId: 1 }, { unique: true });
hookMessageSchema.index({ quoteMessage: 1 });

const HookMessage = mongoose.model('HookMessage', hookMessageSchema, 'hook_messages');
module.exports = HookMessage;