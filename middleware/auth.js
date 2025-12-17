const { initLogger } = require('../logger');
const logger = initLogger('AuthMiddleware');
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const method = 'Authorization';
	try {
		let isValid = false;
		if (
			req.headers.authorization &&
			req.headers.authorization?.split(' ').length > 0
		) {
			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, process.env.secretKey, (error, decoded) => {
				if (!error) {
                    isValid = true;
                    req.user = decoded.user;
                } else {
                    console.error('JWT verification error:', error);
                }
			});
		}
		if (isValid) next();
		else {
			logger.info(`Unauthorized`, { method });
			res.status(401).json({ message: 'Unauthorized' });
		}
	} catch (error) {
		logger.error(`Error ${error.message}`, { method });
		next(error);
	}
};
