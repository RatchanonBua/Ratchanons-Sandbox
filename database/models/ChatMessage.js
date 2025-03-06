const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    default: null,
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deleteAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

ChatMessageSchema.index({ userId: 1, chatRoomId: 1, isDeleted: 1 });

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
module.exports = ChatMessage;