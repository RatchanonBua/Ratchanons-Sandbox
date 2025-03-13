const HookMessage = require('@/schemas/hook-message');

const createHookMessage = async (objectData) => {
  try {
    const hookMessage = await HookMessage.create(objectData);
    return hookMessage;
  } catch (error) {
    console.error('Error Creating Hook Message:', error);
    throw error;
  }
};

// mode = ['all', 'one', 'id']
const fetchHookMessage = async (mode = 'all', condition = {}, sort = {}, field = '') => {
  try {
    let query = HookMessage.find(condition);
    // Search Mode
    if (mode === 'one') {
      query = HookMessage.findOne(condition);
    } else if (mode === 'id' && condition?._id) {
      query = HookMessage.findById(condition._id);
    }
    // Sort Result
    if (Object.keys(sort).length) {
      query = query.sort(sort);
    }
    // Fields to Select
    if (typeof field === 'string' && field !== '') {
      query = query.select(field);
    }
    // Search Operation
    const result = await query;
    return (mode === 'one' || (mode === 'id' && condition?._id)) ? result : result || [];
  } catch (error) {
    console.error('Error Fetching Hook Message:', error);
    throw error;
  }
};

// mode = ['id', 'one', 'many']
const updateHookMessage = async (mode = 'id', condition = {}, data = {}, timestamp = true) => {
  try {
    // Check Condition
    if (Object.keys(condition).length === 0) {
      return null;
    }
    // Update Mode
    let query = HookMessage.updateMany(condition, data);
    if (mode === 'id' && condition?._id) {
      query = HookMessage.findByIdAndUpdate(condition._id, data, { new: true });
    } else if (mode === 'one') {
      query = HookMessage.findOneAndUpdate(condition, data, { new: true });
    }
    // Update Timestamps
    if (!timestamp) {
      query = query.setOptions({ timestamps: false });
    }
    // Update Operation
    const result = await query;
    return result;
  } catch (error) {
    console.error('Error Updating Hook Message:', error);
    throw error;
  }
};

module.exports = { createHookMessage, fetchHookMessage, updateHookMessage };