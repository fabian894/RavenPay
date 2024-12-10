const express = require('express');
const router = express.Router();
const { deposit } = require('../controllers/depositController'); // Ensure you have this function in your controller
const authenticateUser = require('../middleware/authenticateUser'); // Middleware for user authentication
const { getDeposits, getTransfers, getTransactionHistory } = require('../controllers/transactionController');

// Deposit route
router.post('/deposit', authenticateUser, deposit);

// Get user deposit history
router.get('/deposits', authenticateUser, getDeposits);

// Get user transfer history
router.get('/transfers', authenticateUser, getTransfers);

// Get overall transaction history (deposits + transfers)
router.get('/history', authenticateUser, getTransactionHistory);


module.exports = router;
