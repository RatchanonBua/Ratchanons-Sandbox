const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file'],
    required: true,
    default: 'text',
  },
  messageText: {
    type: String,
    required: function () {
      return this.messageType === 'text';
    },
  },
  mediaUrl: {
    type: String,
    default: null,
  },
  messageStatus: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent',
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [],
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage',
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
    required: function () {
      return this.isDeleted;
    },
  },
}, {
  timestamps: true,
}, {
  collection: 'chat_messages',
});

chatMessageSchema.index({ userId: 1, chatRoomId: 1, isDeleted: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;