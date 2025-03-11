
const webhookController = require('./controllers/webhook.controller');
const webhookModel = require('./models/webhook.model');
const webhookService = require('./services/webhook.service');
const webhookRoutes = require('./routes/webhook.routes');

module.exports = {
  webhookController,
  webhookModel,
  webhookService,
  webhookRoutes,
};