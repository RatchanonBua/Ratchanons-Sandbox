const { createWebhookLog } = require('@/modules/webhooks/models/webhook-log.model');

const handleWebhook = async (req, res, source) => {
  try {
    // Build Variables
    const referer = req.get('Referer') || req.get('Origin') || 'unknown';
    const fullUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    // Build Data
    const data = {
      event: `${source} Webhook`,
      requestUrl: fullUrl,
      method: req.method,
      referer: referer,
      payload: req.body,
      timestamp: new Date(),
    };
    await createWebhookLog(data);
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