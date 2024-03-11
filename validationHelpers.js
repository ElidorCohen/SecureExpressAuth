const logger = require('./winstonLogger');

function isValidUsername(username) {
    logger.debug('Validating username: ' + username);
    const re = /^[A-Za-z0-9]{6,}$/;
    return re.test(username);
}

function isValidPassword(password) {
    logger.debug('Validating password: ' + "********");
    const re = /^[A-Za-z0-9]{8,}$/; 
    return re.test(password);
}

module.exports = {
    isValidUsername,
    isValidPassword
};