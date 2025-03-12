const express = require('express');
const router = express.Router();
const { handleLineWebhook } = require('@/modules/webhooks/controllers/webhook.controller');

const validateJsonContent = (req, res, next) => {
  if (req.is('application/json')) {
    next();
  } else {
    res.status(415).json({ success: false, message: 'Unsupported Media Type: Use application/json' }).end();
  }
};

router.post('/webhooks/line', validateJsonContent, handleLineWebhook);

module.exports = router;