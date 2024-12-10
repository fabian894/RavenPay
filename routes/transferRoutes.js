const express = require('express');
const router = express.Router();
const { sendMoneyToBank } = require('../controllers/transferController');
const authenticateUser = require('../middleware/authenticateUser'); // Path to the middleware file

router.post('/send', authenticateUser, sendMoneyToBank); // Protect this route

module.exports = router;
