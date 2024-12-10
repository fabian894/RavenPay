const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());

// Import routes 
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const transferRoutes = require('./routes/transferRoutes');

// Use routes
app.use('/auth', authRoutes);
app.use('/account', accountRoutes);
app.use('/transaction', transactionRoutes);
app.use('/webhook', webhookRoutes);
app.use('/transfer', transferRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
