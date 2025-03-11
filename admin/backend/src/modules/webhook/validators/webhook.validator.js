const { validationResult } = require('express-validator');

const validateWebhook = [
  
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateWebhook, handleValidationErrors };