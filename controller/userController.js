const database = require('../services/database');
const bcrypt = require('bcrypt');
const { validateUserRegistration } = require('../validators/userValidator');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const validationErrors = validateUserRegistration({ username, email, password });
    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        const existingUser = await database.pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
          );
      
        if (existingUser.rows.length > 0) {
        const existingField = existingUser.rows[0].username === username ? 'Username' : 'Email';
        return res.status(409).json({ error: `${existingField} already exists.` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await database.pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, username, email, total_points',
            [username, email, hashedPassword]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await database.pool.query('SELECT user_id, username, email FROM users WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

module.exports = {
    registerUser,
    getUserById,
};
