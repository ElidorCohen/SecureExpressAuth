const express = require('express');
const router = express.Router();
const {createUser, userExists, validateUser} = require('./userModel');
const {isValidUsername, isValidPassword} = require('./validationHelpers');
const {generateToken} = require('./authServices');
const {authenticateToken} = require('./authMiddleware');
const { apiLimiter } = require('./expressLimiter');
const logger = require('./winstonLogger');


router.get('/hello', (req, res) => {
    res.send('Hello World');
});


router.post('/login', apiLimiter, async (req, res) => {
    logger.debug('Login request received');
    const { username, password } = req.body;
    logger.debug("Processing login request for user: " + username);
    if (!isValidUsername(username) || !isValidPassword(password)) {
        return res.status(400).send({ message: 'Invalid username or password format.' });
    }

    const validationResult = await validateUser(username, password);
    if (!validationResult.exists) {
        res.status(404).send({ message: 'Username does not exist.' });
    } else if (!validationResult.valid) {
        res.status(401).send({ message: 'Incorrect password.' });
    } else {
        const token = generateToken({ username });
        res.status(200).send({ token });
    }
});


router.post('/register', apiLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (await userExists(username)) {
            return res.status(400).send({ message: 'User already exists' });
        }

        let errorMessage = ''

        if (!isValidUsername(username)) {
            errorMessage = 'Username must be at least 6 characters long and contain only letters and numbers.';
        }

        if (!isValidPassword(password)) {
            if (errorMessage) {
                errorMessage += ' ';
            }
            errorMessage += 'Password must be at least 8 characters long and contain only letters and numbers.';
        } 

        if (errorMessage) {
            return res.status(400).send({ message: errorMessage });
        }

        await createUser(username, password);
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).send({ message: error.message });
    }
});


router.get('/private', apiLimiter, authenticateToken, (req, res) => {
    res.send("Welcome to the private area, " + req.user.username);
});


module.exports = router;
