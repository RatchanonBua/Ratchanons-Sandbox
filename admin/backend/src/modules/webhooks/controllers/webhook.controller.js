const webhookLogModel = require('@/modules/webhooks/models/webhook-log.model');
const lineController = require('@/modules/webhooks/controllers/line.controller');

const handleWebhook = async (req, res, source) => {
  try {
    // Build Variables
    const referer = req.get('Referer') || req.get('Origin') || 'unknown';
    const fullUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    const payload = req.body;
    // Process Chat Data
    switch (source) {
      case "LINE":
        await lineController.processLineWebhook(payload);
        break;
      default:
        break;
    }
    // Build Data
    const data = {
      event: `${source} Webhook`,
      requestUrl: fullUrl,
      method: req.method,
      referer: referer,
      payload: payload,
      timestamp: new Date(),
    };
    await webhookLogModel.createWebhookLog(data);
    console.log('Webhook Received Successfully!');
    res.status(200).json({ success: true, message: 'Webhook Received Successfully!' });
  } catch (error) {
    console.error('Error Handling Webhook:', error);
    res.status(500).json({ success: false, message: 'Error Handling Webhook!' });
  }
};

module.exports = {
  handleLineWebhook: (req, res) => handleWebhook(req, res, 'LINE'),
};