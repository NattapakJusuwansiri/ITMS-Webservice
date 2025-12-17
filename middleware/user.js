const { Op } = require('sequelize');
const { checkRequire, isNullOrEmpty } = require('../controllers/utility');
const User = require('../models/mssql/User');
const bcrypt = require('bcryptjs');
const { initLogger } = require('../logger');
const logger = initLogger('Validator');

const create = async (req, res, next) => {
	try {
		// ---- list to validate ----
		// - check null for require column
		// - username duplicate
		const user = req.body;
		const errorObj = {};
		checkRequire('username', user, errorObj);
		if (!Object.hasOwnProperty.call(errorObj, 'username')) {
			const data = await User.findOne({
				where: {
					username: user.username,
				},
			});
			if (data) errorObj.username = 'username is duplicate.';
		}
		checkRequire('password', user, errorObj);
		checkRequire('isActive', user, errorObj);

		if (Object.keys(errorObj).length) res.status(400).json({ errors: errorObj });
		else next();
	} catch (error) {
		logger.error(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const update = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const data = await User.findByPk(userId);
		if (!data) return res.status(404).json({ message: 'User not found.' });

		const errorObj = {};
		if (Object.keys(errorObj).length) res.status(400).json(errorObj);
		else {
			const { file, employeeId, name, roleId, isActive, password, } = req.body;

			req.body = {
				imageFileId: file?.fileId,
				password,
				name,
				roleId,
				isActive,
				updateDate: new Date(),
				updateUserId: req.body.userId,
				employeeId
			};

			if (isNullOrEmpty(req.body.password)) delete req.body.password;
			else req.body.password = await bcrypt.hash(password, 8);
			if (isNullOrEmpty(req.body.employeeId)) delete req.body.employeeId;
			if (isNullOrEmpty(req.body.name)) delete req.body.name;
			if (isNullOrEmpty(req.body.roleId)) delete req.body.roleId;
			if (isNullOrEmpty(req.body.isActive)) delete req.body.isActive;
			if (isNullOrEmpty(req.body.imageFileId)) delete req.body.imageFileId;

			next();
		};
	} catch (error) {
		logger.error(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

const updateStatus = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { isActive } = req.body;
		req.body = { isActive };
		const data = await User.findByPk(userId);
		if (!data) return res.status(404).json({ message: 'User not found.' });
		if (isNullOrEmpty(isActive)) return res.status(401).send({ message: 'Is Active is require.' });
		next();
	} catch (error) {
		logger.error(error);
		res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = { create, update, updateStatus };
