const knex = require('knex')(require('../knexfile')[process.env.NODE_ENV || 'development']);

// Get User's Deposit History
exports.getDeposits = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token
        
        const deposits = await knex('transactions')
            .where({ user_id: userId, transaction_type: 'deposit' })
            .select('amount', 'created_at', 'status', 'transaction_id')
            .orderBy('created_at', 'desc');
        
        if (deposits.length === 0) {
            return res.status(404).json({ message: 'No deposit transactions found.' });
        }

        res.status(200).json({ deposits });
    } catch (error) {
        console.error('Error fetching deposits:', error);
        res.status(500).json({ message: 'Internal server error fetching deposits.' });
    }
};

// Get User's Transfer History
exports.getTransfers = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token

        const transfers = await knex('transactions')
            .where({ user_id: userId, transaction_type: 'transfer' })
            .select('amount', 'recipient_account', 'status', 'transaction_id', 'created_at')
            .orderBy('created_at', 'desc');

        if (transfers.length === 0) {
            return res.status(404).json({ message: 'No transfer transactions found.' });
        }

        res.status(200).json({ transfers });
    } catch (error) {
        console.error('Error fetching transfers:', error);
        res.status(500).json({ message: 'Internal server error fetching transfers.' });
    }
};

// Get User's Overall Transaction History (Deposits + Transfers)
exports.getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token

        const transactions = await knex('transactions')
            .where({ user_id: userId })
            .select('transaction_type', 'amount', 'recipient_account', 'status', 'transaction_id', 'created_at')
            .orderBy('created_at', 'desc');

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found.' });
        }

        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ message: 'Internal server error fetching transaction history.' });
    }
};
