const mongoose = require('mongoose');

const hookUserSchema = new mongoose.Schema({
  hookOrigin: {
    type: String,
    enum: ['line', 'facebook', 'google'],
    required: true,
  },
  externalUserId: {
    type: String,
    required: true,
  },
  linkUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
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
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
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
  collection: 'hook_users',
});

hookUserSchema.index({ hookOrigin: 1, externalUserId: 1 }, { unique: true });

const HookUser = mongoose.model('HookUser', hookUserSchema);
module.exports = HookUser;