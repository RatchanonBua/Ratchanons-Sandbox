const hookUserModel = require('@/models/hook-user.model');
const hookMessageModel = require('@/models/hook-message.model');

const fetchLineChatList = async (queries) => {
  // Initialize Variables
  let result = [];
  let conditions = { hookOrigin: 'line', isDeleted: false };
  // Process Queries & Build MongoDB Search
  //---- Target with Or Operator ---//
  if (queries.name) {
    //---- Target displayName || customName ----//
    conditions.$or = [
      { displayName: { $regex: queries.name, $options: 'i' } },
      { customName: { $regex: queries.name, $options: 'i' } },
    ];
  }
  //---- Target lastActivityAt by Date ----//
  if (queries.date && /^\d{4}-\d{2}-\d{2}$/.test(queries.date)) {
    const date = new Date(queries.date);
    conditions.lastActivityAt = {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999)),
    };
  }
  //---- Target accountStatus ----//
  const statusValue = (queries.accStatus || 'active').toLowerCase();
  if (['inactive', 'blocked', 'banned'].includes(statusValue)) {
    conditions.accountStatus = statusValue;
  } else {
    conditions.accountStatus = 'active';
  }
  //---- Target isResponded ----//
  if (['true', 'false'].includes(queries.isResponded)) {
    conditions.isResponded = (queries.isResponded === 'true') ? true : false;
  }
  //---- Target Sort ----//
  const sortStr = (queries.sort || 'desc').toLowerCase();
  const sortObj = (sortStr === 'asc') ? { lastActivityAt: 1 } : { lastActivityAt: -1 };
  //---- Target Skip ----//
  const skip = (queries.page - 1) * queries.limit;
  // Fetch User Data
  result = await hookUserModel.fetchHookUser('all', conditions, sortObj, '', skip, queries.limit);
  return result;
};

const fetchLineChatHistory = async (id) => {

};

module.exports = { fetchLineChatList, fetchLineChatHistory };