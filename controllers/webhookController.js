const db = require('../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(db);

exports.handleWebhook = async (req, res) => {
    const trx = await knex.transaction(); // Start a database transaction
    try {
        const webhookPayload = req.body;

        console.log('Webhook received:', webhookPayload);

        // Destructure the payload
        const { transaction_id, amount, sender_account, receiver_account, status } = webhookPayload;

        if (!transaction_id || !amount || !sender_account || !receiver_account || !status) {
            return res.status(400).json({ message: 'Invalid webhook payload.' });
        }

        // Process only successful transactions
        if (status === 'success') {
            // Validate sender account and balance
            const sender = await trx('bank_accounts')
                .where({ unique_account_number: sender_account })
                .first();

            if (!sender) {
                throw new Error(`Sender account ${sender_account} not found.`);
            }

            if (sender.balance < amount) {
                throw new Error('Insufficient balance in sender account.');
            }

            // Validate receiver account
            const receiver = await trx('bank_accounts')
                .where({ unique_account_number: receiver_account })
                .first();

            if (!receiver) {
                throw new Error(`Receiver account ${receiver_account} not found.`);
            }

            // Update balances
            await trx('bank_accounts')
                .where({ unique_account_number: sender_account })
                .decrement('balance', amount);

            await trx('bank_accounts')
                .where({ unique_account_number: receiver_account })
                .increment('balance', amount);

            // Log the transaction
            await trx('transactions').insert({
                transaction_id,
                user_id: sender.user_id, // Assuming a `user_id` exists in `bank_accounts`
                transaction_type: 'transfer',
                amount,
                recipient_account: receiver_account,
                status,
                created_at: new Date(),
            });

            await trx.commit(); // Commit the transaction
            console.log('Transaction processed successfully!');
        } else {
            console.log('Transaction failed. No updates made.');
        }

        res.status(200).json({ message: 'Webhook received and processed successfully!' });
    } catch (error) {
        await trx.rollback(); // Rollback in case of an error
        console.error('Error handling webhook:', error.message);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};
