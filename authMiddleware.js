const { verifyToken } = require('./authServices');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    try {
        const user = verifyToken(token); // Synchronously verify the token
        req.user = user; 
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return res.sendStatus(403); // Invalid token
    }
}

module.exports = { authenticateToken };