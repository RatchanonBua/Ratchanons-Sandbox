const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
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
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  profileImage: {
    type: String,
    default: null,
  },
  displayName: {
    type: String,
    required: true,
  },
  isIndividual: {
    type: Boolean,
    default: true,
  },
  accountInfo: {
    firstName: {
      type: String,
      default: null,
      required: function () {
        return this.isIndividual;
      },
    },
    middleName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
      required: function () {
        return this.isIndividual;
      },
    },
    accountName: {
      type: String,
      default: null,
      required: function () {
        return !this.isIndividual;
      },
    },
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

userAccountSchema.index({ accountStatus: 1, lastLoginAt: -1 });

const UserAccount = mongoose.model('UserAccount', userAccountSchema, 'user_accounts');
module.exports = UserAccount;