const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const knex = require('../knexfile')[process.env.NODE_ENV || 'development'];

const db = require('knex')(knex);

// Helper function to generate a unique bank account number
const generateAccountNumber = () => {
    return 'ACC' + Math.random().toString(36).substring(2, 15).toUpperCase(); // Random 13-character string starting with 'ACC'
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db('users').where({ email }).first();
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const [userId] = await db('users').insert({
            name,
            email,
            password: hashedPassword,
        });

        // Generate unique account number
        const uniqueAccountNumber = generateAccountNumber();

        // Create a bank account for the user
        await db('bank_accounts').insert({
            user_id: userId,
            unique_account_number: uniqueAccountNumber,
            balance: 0, // Set initial balance to 0
        });

        res.status(201).json({ message: 'User created successfully, and bank account created!', unique_account_number: uniqueAccountNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await db('users').where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

