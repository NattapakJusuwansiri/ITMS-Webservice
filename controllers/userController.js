const User = require('../models/mssql/User');
const File = require('../models/mssql/File');
const Role = require('../models/mssql/Role');
const { Op, col } = require('sequelize');
const bcrypt = require('bcryptjs');
const BaseController = require('./BaseController');
const { checkFilterNull, isNullOrEmpty } = require('./utility');

const { initLogger } = require('../logger');
const logger = initLogger('UserController');

class UserController extends BaseController {
    constructor() {
        super(User);
    }

    create = async (req, res, next) => {
        const method = 'Create';
        // const { userId } = req.user;
        const user = req.body;
        try {
            const hashedPassword = await bcrypt.hash(user.password, 8);
            const newUser = await User.create({
                username: user.username,
                password: hashedPassword,
                name: isNullOrEmpty(user.name) ? null : user.name,
                roleId: isNullOrEmpty(user.roleId) ? null : user.roleId,
                isActive: user.isActive,
                createDate: new Date(),
                createUserId: 1,
            });
            res.status(201).json({
                message: 'Create successfully',
                user: newUser,
                userId: newUser.userId,
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                // data: { userId },
            });
            next(error);
        }
    };

    list = async (req, res, next) => {
        const method = 'Create';
        // const { userId } = req.user;
        try {
            const { username, roleId, name, isActive } = req.query;
            let { pageNo, itemPerPage } = req.query;
            pageNo = !isNaN(pageNo) ? Number(pageNo) : 1;
            itemPerPage = !isNaN(itemPerPage) ? Number(itemPerPage) : 20;

            let whereObj = {
                username: {
                    [Op.like]: `%${username ? username.toLowerCase() : ''}%`,
                },
                name: {
                    [Op.like]: `%${name ? name.toLowerCase() : ''}%`,
                },
                roleId,
                isActive,
            };
            whereObj = checkFilterNull(whereObj, req.query);
            const {
                docs: datas,
                pages,
                total,
            } = await User.paginate({
                page: pageNo,
                paginate: itemPerPage,
                where: whereObj,
                attributes: [
                    'userId',
                    'employeeId',
                    'username',
                    'roleId',
                    'name',
                    'isActive',
                    'createDate',
                    'updateDate',
                    [col('role.name'), 'roleName'],
                ],
                include: [
                    {
                        model: Role,
                        as: 'role',
                        attributes: [],
                    },
                ],
                raw: true,
            });

            res.status(200).json({
                datas,
                pagination: { totalPages: pages, totalItems: total },
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                // data: { userId },
            });
            next(error);
        }
    };

    getById = async (req, res, next) => {
        const method = 'GetById';
        const { userId } = req.user;
        try {
            const { userId } = req.params;
            const user = await User.findByPk(userId, {
                attributes: [
                    'userId',
                    'username',
                    'roleId',
                    'name',
                    'employeeId',
                    'isActive',
                    'createDate',
                    'updateDate',
                    [col('role.name'), 'roleName'],
                ],
                include: [{ model: Role, as: 'role', attributes: [] }],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    update = async (req, res, next) => {
        const method = 'Update';
        const { userId } = req.user;
        const { userId: dataId } = req.params;
        try {
            const updateObj = {
                ...req.body,
                ...{
                    updateDate: new Date(),
                    updateUserId: req.user.userId,
                },
            };
            await User.update(updateObj, { where: { userId: dataId } });
            if (req.body.imageFileId)
                await File.update(
                    { isTemp: false },
                    { where: { fileId: req.body.imageFileId } }
                );
            res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    updateStatus = async (req, res, next) => {
        const method = 'Update';
        const { userId } = req.user;
        try {
            const { userId } = req.params;
            const { isActive } = req.body;
            await User.update({ isActive }, { where: { userId } });
            const updatedUser = await User.findByPk(userId);
            res.status(200).json({
                message: 'User updated successfully',
                updatedUser,
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };
}

module.exports = new UserController();
