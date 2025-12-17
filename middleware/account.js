const { initLogger } = require('../logger');
const { isNullOrEmpty } = require('./utility');
const logger = initLogger('AccountMiddleware');

exports.validate = async (req, res, next) => {
    const method = 'Validate'
    const { username, password } = req.body;
    try {
        const errorObj = {};
        if (isNullOrEmpty(username)) errorObj['username'] = 'username is require';
        if (isNullOrEmpty(password)) errorObj['password'] = 'password is require';
        if (Object.keys(errorObj).length) return res.status(400).json({ errors: errorObj });
        else return next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { username } });
        next(error);
    }
};