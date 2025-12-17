const { Sequelize } = require('sequelize');
require('dotenv').config();

const { initDBLogger: initLogger } = require('../../logger');
const logger = initLogger('Sequelize')

const sequelize = new Sequelize(
	process.env.DATABASE_MSSQL,
	process.env.USERNAME_MSSQL,
	process.env.PASSWORD_MSSQL,
	{
		host: process.env.HOST_MSSQL,
		dialect: process.env.DIALECT_MSSQL,
		dialectOptions: {
			options: {
				encrypt: false
			}
		},
		// logging: false,
		logging: (msg, options) => logger.info(msg.replace(/(\r\n|\r|\n)/g, ' '), { method: options.type ?? null, data: { where: options.where ?? null, bind: options.bind ?? null } }),
	},
);

module.exports = sequelize;
