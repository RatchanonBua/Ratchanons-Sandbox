const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

const validateJsonContent = (req, res, next) => {
  if (req.is('application/json')) {
    next();
  } else {
    res.status(415).json({ success: false, message: 'Unsupported Media Type: Use application/json' }).end();
  }
};

router.get('/api/v1/webhooks', (req, res) => { res.send('Hello Webhook!'); });
router.post('/api/v1/webhooks', validateJsonContent, ...webhookController);

module.exports = router;