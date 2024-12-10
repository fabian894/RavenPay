const axios = require('axios');
const knex = require('../knexfile')[process.env.NODE_ENV || 'development'];
const db = require('knex')(knex);

exports.sendMoneyToBank = async (req, res) => {
    const { amount, bank, bank_code, account_number, account_name, narration } = req.body;
    const userId = req.user.id; // Extract user ID from the token
    const reference = `txn-${Date.now()}`; // Generate a unique transaction reference
    const currency = 'NGN'; // Default currency

    try {
        // Validate the user's account balance
        const userAccount = await db('bank_accounts').where({ user_id: userId }).first();
        if (!userAccount) {
            return res.status(404).json({ message: 'User bank account not found.' });
        }

        if (userAccount.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance for the transfer.' });
        }

        // Prepare the transfer payload
        const transferPayload = {
            amount, // Amount in Naira
            bank,
            bank_code,
            account_number,
            account_name,
            narration: narration || 'Fund Transfer',
            reference,
            currency,
        };

        // Send transfer request to Raven Atlas API
        const response = await axios.post(
            'https://integrations.getravenbank.com/v1/transfers/create',
            transferPayload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.RAVEN_API_KEY}`, // Add your Raven API Key
                    'Content-Type': 'application/json',
                },
            }
        );

        // Update user's account balance locally
        await db('bank_accounts')
            .where({ user_id: userId })
            .decrement('balance', amount);

        // Log the transaction
        await db('transactions').insert({
            user_id: userId,
            transaction_type: 'transfer',
            amount,
            recipient_account: account_number,
            status: 'success',
            created_at: new Date(),
        });

        // Respond to the client with transfer details
        res.status(200).json({
            message: 'Transfer successful!',
            transfer_details: response.data,
        });
    } catch (error) {
        console.error('Error during transfer:', error.response?.data || error.message);

        // Log the failed transaction
        await db('transactions').insert({
            user_id: userId,
            transaction_type: 'transfer',
            amount,
            recipient_account: account_number,
            status: 'failed',
            created_at: new Date(),
        });

        res.status(500).json({
            message: 'Internal server error during transfer.',
            error: error.response?.data || error.message,
        });
    }
};
