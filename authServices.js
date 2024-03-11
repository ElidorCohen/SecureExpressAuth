const jwt = require('jsonwebtoken');

const SECRET_KEY = 'elidor-secret-key';

function generateToken(user) {
    const payload = { username: user.username };
    const options = { expiresIn: '2h' }; 
    return jwt.sign(payload, SECRET_KEY, options);
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken
};