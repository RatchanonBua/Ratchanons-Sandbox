const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    enum: ['private', 'group'],
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isLeave: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    bannedReason: {
      type: String,
      default: null,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  roomStatus: {
    type: String,
    enum: ['active', 'inactive', 'archived', 'banned'],
    default: 'active',
  },
  lastMessageAt: {
    type: Date,
    default: null,
  },
  archivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  archivedAt: {
    type: Date,
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
}, {
  collection: 'chat_rooms',
});

chatRoomSchema.index({ 'participants.userId': 1 });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
module.exports = ChatRoom;