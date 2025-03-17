const lineController = require('@/modules/chats/controllers/line.controller');
const sanitizeHtml = require('sanitize-html');

const getChatList = async (req, res, source) => {
  try {
    // Process Queries
    let queries = {};
    const name = sanitizeHtml(req.query.name) || null;
    const date = sanitizeHtml(req.query.date) || null;
    const sort = sanitizeHtml(req.query.sort) || 'desc';
    const accStatus = sanitizeHtml(req.query.acc_status) || 'active';
    const isResponded = sanitizeHtml(req.query.is_responded) || null;
    const page = Math.max(parseInt(sanitizeHtml(req.query.page)) || 1, 1);
    const limit = 100;
    // Build Queries
    queries = { name: name, date: date, sort: sort, accStatus: accStatus, isResponded: isResponded, page: page, limit: limit };
    queries = Object.fromEntries(Object.entries(queries).filter(([_, v]) => v != null));
    console.log("Get Chat List:", queries);
    // Result of Chat List
    let result = [];
    switch (source) {
      case "LINE":
        result = await lineController.fetchLineChatList(queries);
        break;
      default:
        break;
    }
    console.log('Getting Chat List Successfully!');
    res.status(200).json({ success: true, message: 'Getting Chat List Successfully!', data: result });
  } catch (error) {
    console.error('Error Getting Chat List:', error);
    res.status(500).json({ success: false, message: 'Error Getting Chat List!' });
  }
};

const getChatHistory = async (req, res, source) => {
  try {
    // Get Chat History Id
    // Result of Chat History
    let result = [];
    switch (source) {
      case "LINE":
        result = await lineController.fetchLineChatHistory(id);
        break;
      default:
        break;
    }
    console.log('Getting Chat History Successfully!');
    res.status(200).json({ success: true, message: 'Getting Chat History Successfully!', data: result });
  } catch (error) {
    console.error('Error Getting Chat History:', error);
    res.status(500).json({ success: false, message: 'Error Getting Chat History!' });
  }
};

module.exports = {
  getLineChatList: (req, res) => getChatList(req, res, 'LINE'),
  getLineChatHistory: (req, res) => getChatHistory(req, res, 'LINE'),
}