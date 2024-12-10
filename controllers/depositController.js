const db = require('../knexfile')[process.env.NODE_ENV || 'development'];
const axios = require('axios');

const knex = require('knex')(db);

// Handle Deposits
exports.deposit = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id; // Extract user ID from token

        // Validate input
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid deposit amount.' });
        }

        // Fetch user's account details
        const userAccount = await knex('bank_accounts').where({ user_id: userId }).first();

        if (!userAccount) {
            return res.status(404).json({ message: 'User bank account not found.' });
        }

        // Log the deposit transaction
        const transactionId = `txn-${Date.now()}`;
        await knex('transactions').insert({
            user_id: userId,
            transaction_type: 'deposit',
            amount,
            recipient_account: userAccount.unique_account_number,
            transaction_id: transactionId,
            status: 'pending', // Pending until webhook confirmation
            created_at: new Date(),
        });

        // Trigger a webhook (simulate the deposit via Raven webhook)
        const webhookPayload = {
            transaction_id: transactionId,
            amount,
            sender_account: 'external', // Representing external funds
            receiver_account: userAccount.unique_account_number,
            status: 'success', // Assume success for now
        };

        // Send webhook notification to our webhook endpoint
        await axios.post(process.env.WEBHOOK_URL, webhookPayload, {
            headers: { 'Content-Type': 'application/json' },
        });

        res.status(200).json({
            message: 'Deposit initiated! Please wait for confirmation via webhook.',
            transaction_id: transactionId,
        });
    } catch (error) {
        console.error('Error during deposit:', error);
        res.status(500).json({ message: 'Internal server error during deposit.' });
    }
};
