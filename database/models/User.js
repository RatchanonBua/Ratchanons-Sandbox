const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z0-9]+([.-_]?[a-z0-9]+)*$/,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Regex for email validation
  },
  displayName: {
    type: String,
    required: true,
  },
  lastLoginAt: {
    type: Date,
    default: null,
  },
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
  },
  externalIds: {
    lineId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
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

userSchema.index({ accountStatus: 1, lastLoginAt: -1 });

const User = mongoose.model('User', userSchema);
module.exports = User;