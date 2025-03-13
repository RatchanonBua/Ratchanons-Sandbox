const HookMessage = require('@/schemas/hook-message');

const createHookMessage = async (objectData) => {
  try {
    const hookMessage = await HookMessage.create(objectData);
    return hookMessage;
  } catch {
    console.error('Error Creating Hook Message:', error);
    throw error;
  }
};

const fetchHookMessage = async () => {
  try {
    return undefined;
  } catch (error) {
    console.error('Error Fetching Hook Message:', error);
    throw error;
  }
};

const updateHookMessage = async () => {
  try {
    return undefined;
  } catch (error) {
    console.error('Error Updating Hook Message:', error);
    throw error;
  }
};

module.exports = { createHookMessage, fetchHookMessage, updateHookMessage };