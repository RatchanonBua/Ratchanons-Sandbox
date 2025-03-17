const express = require('express');
const router = express.Router();
const { getLineChatList, getLineChatHistory } = require('@/modules/chats/controllers/chat.controller');

const validateJsonContent = (req, res, next) => {
  if (req.is('application/json')) {
    next();
  } else {
    res.status(415).json({ success: false, message: 'Unsupported Media Type: Use application/json' }).end();
  }
};

router.get('/chats/line/list', getLineChatList);
router.post('/chats/line/history', validateJsonContent, getLineChatHistory);

module.exports = router;