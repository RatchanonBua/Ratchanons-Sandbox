const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
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

const ChatRoom = mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;