const HookUser = require('@/schemas/hook-user');

const createHookUser = async (objectData) => {
  try {
    const hookUser = await HookUser.create(objectData);
    return hookUser;
  } catch (error) {
    console.error('Error Creating Hook User:', error);
    throw error;
  }
};

// mode = ['all', 'one', 'id']
const fetchHookUser = async (mode = 'all', condition = {}, sort = {}, field = '') => {
  try {
    let query = HookUser.find(condition);
    // Search Mode
    if (mode === 'one') {
      query = HookUser.findOne(condition);
    } else if (mode === 'id' && condition?._id) {
      query = HookUser.findById(condition._id);
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
    console.error('Error Fetching Hook User:', error);
    throw error;
  }
};

// mode = ['id', 'one', 'many']
const updateHookUser = async (mode = 'id', condition = {}, data = {}, timestamp = true) => {
  try {
    // Check Condition
    if (Object.keys(condition).length === 0) {
      return null;
    }
    // Update Mode
    let query = HookUser.updateMany(condition, data);
    if (mode === 'id' && condition?._id) {
      query = HookUser.findByIdAndUpdate(condition._id, data, { new: true });
    } else if (mode === 'one') {
      query = HookUser.findOneAndUpdate(condition, data, { new: true });
    }
    // Update Timestamps
    if (!timestamp) {
      query = query.setOptions({ timestamps: false });
    }      
    // Update Operation
    const result = await query;
    return result;
  } catch (error) {
    console.error('Error Updating Hook User:', error);
    throw error;
  }
};

module.exports = { createHookUser, fetchHookUser, updateHookUser };