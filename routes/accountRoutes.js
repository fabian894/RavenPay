const express = require('express');
const router = express.Router();
const { getBankAccount } = require('../controllers/accountController');

// Route to get bank account details
router.get('/bank-account', getBankAccount);

module.exports = router;
