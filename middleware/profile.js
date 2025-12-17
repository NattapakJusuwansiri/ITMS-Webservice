const { Op } = require('sequelize');
const { checkRequire, isNullOrEmpty } = require('../controllers/utility');
const User = require('../models/mssql/User');
const bcrypt = require('bcryptjs');
const { initLogger } = require('../logger');
const logger = initLogger('Validator');

const resetPassword = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const { currentPassword, newPassword: password, confirmNewPassword } = req.body;

		if (isNullOrEmpty(userId)) return res.status(401).send({ message: 'User Id is require.' });
		if (isNullOrEmpty(currentPassword)) return res.status(401).send({ message: 'Current Password is require.' });
		if (isNullOrEmpty(password)) return res.status(401).send({ message: 'New Password is require.' });
		if (isNullOrEmpty(confirmNewPassword)) return res.status(401).send({ message: 'Confirm New Password is require.' });
		if (currentPassword === password) return res.status(401).send({ message: 'New password is same as old password.' });
		if (confirmNewPassword != password) return res.status(401).send({ message: 'Passwords is not match.' });

		const userData = await User.findByPk(userId);
		const user = userData.dataValues;
		const passwordIsValid = await bcrypt.compare(
			currentPassword,
			user.password
		);
		delete req.body.currentPassword;
		if (!passwordIsValid) {
			return res
				.status(401)
				.send({ message: 'Current Password is incorrect.' });
		} else {
			req.body = { password: await bcrypt.hash(password, 8) }
			next();
		}
	} catch (error) {
		logger.error(error.message)
		return res
			.status(500)
			.send({ message: 'Error On Validate Reset Password.' });
	}
};

const uploadImage = async (req, res, next) => {
	const { file } = req.body;
	if (isNullOrEmpty(file.fileId)) return res.status(401).send({ message: 'File is require.' });
	req.body = { imageFileId: file.fileId };
	next();
};

module.exports = { resetPassword, uploadImage };
