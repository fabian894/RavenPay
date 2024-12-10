exports.getBankAccount = async (req, res) => {
    const userId = req.user.id; // Assuming the user is authenticated and we have the user ID

    try {
        // Retrieve the user's bank account details
        const account = await db('bank_accounts').where({ user_id: userId }).first();
        if (!account) {
            return res.status(404).json({ message: 'Bank account not found.' });
        }

        res.status(200).json({
            unique_account_number: account.unique_account_number,
            balance: account.balance,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
