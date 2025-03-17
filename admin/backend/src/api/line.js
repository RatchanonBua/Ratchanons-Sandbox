const axios = require('axios');

const getLineProfile = async (userId) => {
  try {
    let accessToken = process.env.LINE_ACCESS_TOKEN;
    if (!accessToken) {
      console.error('Access Token Not Found!');
      return null;
    } else {
      const response = await axios.get(`https://api.line.me/v2/bot/profile/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error Fetching Profile:', error);
    return null;
  }
};

module.exports = { getLineProfile };