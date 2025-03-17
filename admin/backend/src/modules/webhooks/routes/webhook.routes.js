const express = require('express');
const router = express.Router();
const { verifyLineSignature } = require('@/middlewares/verify-signature');
const { handleLineWebhook } = require('@/modules/webhooks/controllers/webhook.controller');

const validateJsonContent = (req, res, next) => {
  if (req.is('application/json')) {
    next();
  } else {
    console.log('Unsupported Media Type: Use application/json');
    res.status(415).json({ success: false, message: 'Unsupported Media Type: Use application/json' }).end();
  }
};

router.post('/webhooks/line', validateJsonContent, verifyLineSignature, handleLineWebhook);

module.exports = router;