require('dotenv').config();
const { initLogger } = require('../logger');
const logger = initLogger('Middleware');
const Role = require('../models/mssql/Role')

module.exports = async (req, res, next) => {
	try {
		if (req.user && req.user.roleId) {
			const role = await Role.findByPk(req.user.roleId);
			if (role.level >= 98)
				return next();
		}
		throw Error('You are not admin');
	} catch (error) {
		logger.error(error);
		res.status(401).send('Unauthorized');
	}
};
