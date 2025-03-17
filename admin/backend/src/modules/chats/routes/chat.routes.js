const express = require('express');
const router = express.Router();
const { getLineChatList, getLineChatHistory } = require('@/modules/chats/controllers/chat.controller');

const validateFormContent = (req, res, next) => {
  if (req.is('application/json') || req.is('application/x-www-form-urlencoded')) {
    next();
  } else {
    res.status(415).json({ success: false, message: 'Unsupported Media Type: Use application/json or application/x-www-form-urlencoded' }).end();
  }
};

router.get('/chats/line/list', getLineChatList);
router.post('/chats/line/history', validateFormContent, getLineChatHistory);

module.exports = router;