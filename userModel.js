const pool = require('./dbConfig');
const bcrypt = require('bcryptjs');
const logger = require('./winstonLogger');

const createUser = async (username, password) => {
    logger.debug('Creating new user: ' + username)
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            'INSERT INTO elidor_users (username, hashed_password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        return result;
    } catch (error) {
        console.error('Error creating new user:', error.message);
        throw error;
    }
};

const userExists = async (username) => {
    logger.debug('Checking if user exists: ' + username);
    const [rows] = await pool.execute(
        'SELECT * FROM elidor_users WHERE username = ?',
        [username]
    );
    return rows.length > 0;
}

async function validateUser(username, password) {
    logger.debug('Validating user: ' + username);
    const [users] = await pool.execute('SELECT * FROM elidor_users WHERE username = ?', [username]);
    if (users.length === 0) {
        return { exists: false, valid: false };
    } else {
        const user = users[0];
        const passwordIsValid = await bcrypt.compare(password, user.hashed_password);
        return { exists: true, valid: passwordIsValid };
    }
}



module.exports = {
    createUser,
    userExists,
    validateUser
};
