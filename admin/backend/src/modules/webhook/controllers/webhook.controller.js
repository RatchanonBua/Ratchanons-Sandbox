const { handleWebhookLog } = require('../services/webhook.service');
const { validateWebhook, handleValidationErrors } = require('../validators/webhook.validator');

const webhookController = [
  validateWebhook,
  handleValidationErrors,
  async (req, res) => {
    try {
      const source = req.get('Referer') || req.get('Origin') || 'unknown';
      const webhookData = {
        event: 'input',
        source: source,
        payload: req.body,
        receivedAt: new Date(),
      };
      await handleWebhookLog(webhookData);
      console.log('Webhook Received Successfully!');
      res.status(200).json({ success: true, message: 'Webhook Received Successfully!' });
    } catch (error) {
      console.error('Error Processing Webhook:', error);
      res.status(500).json({ success: false, message: 'Error Processing Webhook!' });
    }
  },
];

module.exports = webhookController;