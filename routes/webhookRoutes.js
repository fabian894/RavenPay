const express = require('express');
const router = express.Router();

// Controller function for handling webhooks
const { handleWebhook } = require('../controllers/webhookController');

// Webhook route
router.post('/bank-transfer', handleWebhook);

module.exports = router;
