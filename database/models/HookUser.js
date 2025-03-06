const mongoose = require('mongoose');

const HookUserSchema = new mongoose.Schema({
  hookOrigin: {
    type: String,
    enum: ['line', 'facebook', 'google'],
    required: true,
  },
  externalUserId: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  displayName: {
    type: String,
    required: true,
  },
  customName: {
    type: String,
    default: null,
  },
  lastMessage: {
    type: String,
    default: null,
  },
  lastActivityAt: {
    type: Date,
    default: null,
  },
  isResponded: {
    type: Boolean,
    default: false,
  },
  isAdminTyping: {
    type: Boolean,
    default: false,
  },
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

const HookUser = mongoose.model('HookUser', HookUserSchema);
module.exports = HookUser;