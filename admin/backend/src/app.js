// Import Section
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Database
const { connectDatabase } = require('@/core/database');
connectDatabase();

// Use Section
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Route Section
const { chatRoutes } = require('@/modules/chats/index');
app.use(chatRoutes);
const { webhookRoutes } = require('@/modules/webhooks/index');
app.use(webhookRoutes);

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

module.exports = app;