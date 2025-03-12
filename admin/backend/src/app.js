// Require Section
require('dotenv').config();

// Import Section
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Database
const { connectDatabase } = require('@/core/database');
connectDatabase();

// Route Section
const { webhookRoutes } = require('@/modules/webhooks/index');
app.use(webhookRoutes);

// Use Section
app.use(express.json());

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route Not Found' });
});

module.exports = app;