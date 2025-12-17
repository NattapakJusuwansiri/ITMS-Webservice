const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initLogger } = require('../logger');
const logger = initLogger('AccountController');

const User = require('../models/mssql/User');
const Role = require('../models/mssql/Role');
const Employee = require('../models/mssql/Employee');

exports.login = async (req, res, next) => {
    const method = 'Login';
    const { username, password } = req.body;
    try {
        const userData = await User.findOne({
            where: { username },
            attributes: [
                'userId',
                'employeeId',
                'name',
                'userName',
                'roleId',
                'isActive',
                'password',
            ],
        });
        if (userData) {
            const user = userData.get();
            const passwordIsValid = await bcrypt.compare(
                password,
                user.password
            );
            if (passwordIsValid) {
                delete user.password;
                const roleData = await Role.findByPk(user.roleId, {
                    attributes: ['name', 'level'],
                });
                user.role = roleData ? roleData.get() : null;
                user.isAdmin = user.role?.level >= 99;
                user.isAdminBO = user.role?.level >= 10;
                const token = jwt.sign(
                    {
                        user,
                        role: roleData?.get(),
                    },
                    process.env.secretKey,
                    {
                        expiresIn: '1d',
                    }
                );
                delete user.role?.level;
                if (user.employeeId) {
                    const empData = await Employee.findByPk(user.employeeId, {
                        attributes: ['nameEn'],
                    });
                    user.employee = empData.get();
                }
                logger.info('Complete', { method, data: { username } });
                return res.status(200).send({ user, accessToken: token });
            }
            logger.info('Password is Incorrect', {
                method,
                data: { username },
            });
        }
        logger.info('User not found', { method, data: { username } });
        return res.status(400).send({
            message: 'The Username or Password is Incorrect. Try again.',
        });
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { username } });
        next(error);
    }
};

exports.data = async (req, res, next) => {
    const method = 'Data';
    const { userId } = req.user;
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Role, as: 'role' },
                {
                    model: Employee,
                    as: 'employee',
                    attributes: { exclude: ['idCard'] },
                },
            ],
        });
        res.status(200).json(user.get());
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId } });
        next(error);
    }
};
