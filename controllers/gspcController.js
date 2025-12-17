const BaseController = require('./BaseController');

const Gspc = require('../models/mssql/Gspc');
const Request = require('../models/mssql/Request');
const User = require('../models/mssql/User');
const Status = require('../models/mssql/Status');
const FlowStep = require('../models/mssql/FlowStep');
const FlowGroup = require('../models/mssql/FlowGroup');
const ActionLog = require('../models/mssql/ActionLog');
const RequestActionLog = require('../models/mssql/RequestActionLog');
const Action = require('../models/mssql/Action');
const MasterFlowStep = require('../models/mssql/MasterFlowStep');
const Employee = require('../models/mssql/Employee');
const Equiepment = require('../models/mssql/Equiepment')
const sequelize = require('../models/mssql');
const { Op } = require('sequelize');

const { initLogger } = require('../logger');

const reqActionLogHelper = require('../helper/requestActionLog');
const requestHelper = require('../helper/request');
const stateManager = require('../helper/stateManager');

const requestType = require('../enum/RequestType');
const masterFlow = require('../enum/MasterFlow');
const status = require('../enum/status');
const { createJobEmail } = require('../helper/job');
const StateType = require('../enum/stateType');
const action = require('../enum/action');
const stateType = require('../enum/stateType');

const logger = initLogger('BannerController');
class Controller extends BaseController {
    constructor() {
        super(Gspc);
    }

    listRequest = async (req, res, next) => {
        const method = 'ListRequest';
        const { userId } = req.user;
        try {
            let { pageNo, itemPerPage, filter } = req.query;
            pageNo = !isNaN(pageNo) ? Number(pageNo) : 1;
            itemPerPage = !isNaN(itemPerPage) ? Number(itemPerPage) : 0;

            const count = await Request.count({
                where: {
                    ...filter, // รวมเงื่อนไขอื่น ๆ ที่มีอยู่
                    createUserId: userId, // เพิ่มเงื่อนไขที่คุณต้องการ
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                    },
                    {
                        model: User,
                        as: 'createUser',
                        attributes: { exclude: ['password'] },
                        include: [{ model: Employee, as: 'employee' }],
                    },
                ],
            });

            const datas = await Request.findAll({
                attributes: { exclude: ['description','updateDate','updateUserId','createDate','createUserId'] },
                order: [['updateDate', 'DESC']],
                offset: (pageNo - 1) * itemPerPage,
                limit: itemPerPage,
                where: {
                    ...filter, 
                    createUserId: userId, 
                    requestTypeId:1,
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                        attributes: { exclude: ['description'] },
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                        attributes: { exclude: ['ticketId','isSupporterId','tel','note','isAcceptPolicy','policyId'] },
                        include: [{ 
                            model: Equiepment, as: 'equiepment', 
                            attributes: { exclude: ['equiepmentTypeId','isActive','capacity','os','osVersion','sectionCode','macAddress','ipAddress','fileId'] } , 
                        }],
                    },
                    {
                        model: FlowStep,
                        as: 'flowStep',
                        where:{
                            UserId: userId,
                        },
                        include: [{ model: User, as: 'user',attributes: ['name'], }],
                    },
                ],
            });

            res.status(200).json({
                datas,
                pagination: {
                    totalPages: Math.ceil(count / itemPerPage),
                    totalItems: count,
                },
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    listApprove = async (req, res, next) => {
        const method = 'ListApprove';
        const { userId } = req.user;
        try {
            let { pageNo, itemPerPage, filter } = req.query;
            pageNo = !isNaN(pageNo) ? Number(pageNo) : 1;
            itemPerPage = !isNaN(itemPerPage) ? Number(itemPerPage) : 0;

            const count = await Request.count({
                where: {
                    ...filter,
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                        statusId:status.Pending,
                        attributes: { exclude: ['description'] },
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                        attributes: { exclude: ['ticketId','isSupporterId','tel','note','isAcceptPolicy','policyId'] },
                        include: [{ 
                            model: Equiepment, as: 'equiepment', 
                            attributes: { exclude: ['equiepmentTypeId','isActive','capacity','os','osVersion','sectionCode','macAddress','ipAddress','fileId'] } , 
                        }],
                    },
                    {
                        model: User,
                        as: 'createUser',
                        include: [{ model: Employee, as: 'employee' }],
                    },
                    {
                        model: FlowStep,
                        as: 'flowStep',
                        where:{
                            UserId: userId,
                        },
                        include: [{ model: User, as: 'user' }],
                    },
                ],
            });

            const datas = await Request.findAll({
                attributes: { exclude: ['description','updateDate','updateUserId','createDate','createUserId'] },
                order: [['updateDate', 'DESC']],
                offset: (pageNo - 1) * itemPerPage,
                limit: itemPerPage,
                where: {
                    ...filter, 
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                    },
                    {
                        model: User,
                        attributes:  ['name'],
                        as: 'createUser',
                        include: [
                            {
                                model: Employee,
                                as: 'employee',
                                attributes: { exclude: ['idCard'] },
                            },
                        ],
                    },
                ],
            });

            res.status(200).json({
                datas,
                pagination: {
                    totalPages: Math.ceil(count / itemPerPage),
                    totalItems: count,
                },
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    listIsSupport = async (req, res, next) => {
        const method = 'ListIs';
        const { userId } = req.user;
        try {
            let { pageNo, itemPerPage, filter } = req.query;
            pageNo = !isNaN(pageNo) ? Number(pageNo) : 1;
            itemPerPage = !isNaN(itemPerPage) ? Number(itemPerPage) : 0;

            const count = await Request.count({
                where: {
                    ...filter,
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                        statusId:status.Approved,
                        attributes: { exclude: ['description'] },
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                        attributes: { exclude: ['ticketId','isSupporterId','tel','note','isAcceptPolicy','policyId'] },
                        include: [{ 
                            model: Equiepment, as: 'equiepment', 
                            attributes: { exclude: ['equiepmentTypeId','isActive','capacity','os','osVersion','sectionCode','macAddress','ipAddress','fileId'] } , 
                        }],
                    },
                    {
                        model: User,
                        as: 'createUser',
                        include: [{ model: Employee, as: 'employee' }],
                    },
                    {
                        model: FlowStep,
                        as: 'flowStep',
                        where:{
                            UserId: userId,
                        },
                        include: [{ model: User, as: 'user' }],
                    },
                ],
            });

            const datas = await Request.findAll({
                attributes: { exclude: ['description','updateDate','updateUserId','createDate','createUserId'] },
                order: [['updateDate', 'DESC']],
                offset: (pageNo - 1) * itemPerPage,
                limit: itemPerPage,
                where: {
                    ...filter, 
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                    },
                    {
                        model: User,
                        attributes:  ['name'],
                        as: 'createUser',
                        include: [
                            {
                                model: Employee,
                                as: 'employee',
                                attributes: { exclude: ['idCard'] },
                            },
                        ],
                    },
                ],
            });

            res.status(200).json({
                datas,
                pagination: {
                    totalPages: Math.ceil(count / itemPerPage),
                    totalItems: count,
                },
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    listInnovation = async (req, res, next) => {
        const method = 'ListInn';
        const { userId } = req.user;
        try {
            let { pageNo, itemPerPage, filter } = req.query;
            pageNo = !isNaN(pageNo) ? Number(pageNo) : 1;
            itemPerPage = !isNaN(itemPerPage) ? Number(itemPerPage) : 0;

            const count = await Request.count({
                where: {
                    ...filter,
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                        statusId:status.Revision,
                        attributes: { exclude: ['description'] },
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                        attributes: { exclude: ['tel','note','isAcceptPolicy','policyId'] },
                        include: [{ 
                            model: Equiepment, as: 'equiepment', 
                            attributes: { exclude: ['equiepmentTypeId','isActive','capacity','os','osVersion','sectionCode','macAddress','ipAddress','fileId'] } , 
                        }],
                    },
                    {
                        model: User,
                        as: 'createUser',
                        include: [{ model: Employee, as: 'employee' }],
                    },
                    {
                        model: FlowStep,
                        as: 'flowStep',
                        where:{
                            UserId: userId,
                        },
                        include: [{ model: User, as: 'user' }],
                    },
                ],
            });

            const datas = await Request.findAll({
                attributes: { exclude: ['description','updateDate','updateUserId','createDate','createUserId'] },
                order: [['updateDate', 'DESC']],
                offset: (pageNo - 1) * itemPerPage,
                limit: itemPerPage,
                where: {
                    ...filter, 
                },
                include: [
                    {
                        model: Status,
                        as: 'status',
                    },
                    {
                        model: Gspc,
                        as: 'gspc',
                    },
                    {
                        model: User,
                        attributes:  ['name'],
                        as: 'createUser',
                        include: [
                            {
                                model: Employee,
                                as: 'employee',
                                attributes: { exclude: ['idCard'] },
                            },
                        ],
                    },
                ],
            });

            res.status(200).json({
                datas,
                pagination: {
                    totalPages: Math.ceil(count / itemPerPage),
                    totalItems: count,
                },
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    getById = async (req, res, next) => {
        const method = 'GetById';
        const { userId } = req.user;
        const { requestId } = req.params;
        try {
            const request = await Request.findByPk(requestId, {
                include: [
                    { model: Gspc, as: 'gspc', required: true },
                    { model: Status, as: 'status' },
                    {
                        model: User,
                        attributes: { exclude: ['password'] },
                        as: 'createUser',
                        include: [
                            {
                                model: Employee,
                                as: 'employee',
                                attributes: { exclude: ['idCard'] },
                            },
                        ],
                    },
                ],
            });
            if (request) {
                let result = request.get();
                result.flowSteps = await FlowStep.findAll({
                    where: {
                        requestId,
                    },
                    order: [['orderNo']],
                    include: [
                        {
                            model: User,
                            attributes: { exclude: ['password'] },
                            as: 'user',
                            include: [
                                {
                                    model: Employee,
                                    as: 'employee',
                                    attributes: { exclude: ['idCard'] },
                                },
                            ],
                        },
                        { model: FlowGroup, as: 'flowGroup' },
                        {
                            model: RequestActionLog,
                            as: 'requestActionLog',
                            include: [
                                {
                                    model: ActionLog,
                                    as: 'actionLog',
                                    include: [
                                        {
                                            model: User,
                                            as: 'actionUser',
                                            attributes: {
                                                exclude: ['password'],
                                            },
                                            include: [
                                                {
                                                    model: Employee,
                                                    as: 'employee',
                                                    attributes: {
                                                        exclude: ['idCard'],
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                });
                if (result.masterFlowId) {
                    const masterFlowSteps = await MasterFlowStep.findAll({
                        where: {
                            masterFlowId: result.masterFlowId,
                        },
                        order: [['orderNo']],
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: { exclude: ['password'] },
                                include: [
                                    {
                                        model: Employee,
                                        as: 'employee',
                                        attributes: { exclude: ['idCard'] },
                                    },
                                ],
                            },
                            { model: FlowGroup, as: 'flowGroup' },
                            {
                                model: RequestActionLog,
                                as: 'requestActionLog',
                                where: { requestId },
                                required: false,
                                include: [
                                    {
                                        model: ActionLog,
                                        as: 'actionLog',
                                        include: [
                                            {
                                                model: User,
                                                as: 'actionUser',
                                                attributes: {
                                                    exclude: ['password'],
                                                },
                                                include: [
                                                    {
                                                        model: Employee,
                                                        as: 'employee',
                                                        attributes: {
                                                            exclude: ['idCard'],
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    });
                    result.flowSteps = result.flowSteps.concat(masterFlowSteps);
                }

                result.actionLogs = await ActionLog.findAll({
                    include: [
                        {
                            model: RequestActionLog,
                            as: 'requestActionLog',
                            where: { requestId },
                        },
                        { model: Action, as: 'action' },
                        {
                            model: User,
                            attributes: { exclude: ['password'] },
                            as: 'actionUser',
                            include: [
                                {
                                    model: Employee,
                                    as: 'employee',
                                    attributes: { exclude: ['idCard'] },
                                },
                            ],
                        },
                    ],
                    order: [['actionDate', 'DESC']],
                });
                res.status(200).json(result);
            } else res.status(404).json({ message: 'Data Not Found' });
        } catch (error) {
            console.log(error)
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId, requestId },
            });
            next(error);
        }
    };

    create = async (req, res, next) => {
        const method = 'Create';
        const { userId } = req.user;
        try {
            await sequelize.transaction(async (transaction) => {
                const { flowSteps } = req.body; //[JJ] binding by middleware [bindFlowSteps]
                const { gspc } = req.body;
                const { actionId } = req.body;
                console.log()
                const gspcData = await this.createGspc(
                    gspc,
                    transaction
                );
                await gspcData.save({ transaction });
                const nextState = await stateManager(
                    status.Draft,
                    actionId,
                    StateType.Gspc
                );
                if (!nextState) throw new Error('State is null');
                var data = await Request.create(
                    Object.assign(req.body, {
                        requestTypeId: requestType.Gspc,
                        masterFlowId: masterFlow.Gspc,
                        dataId: gspcData.dataId,
                        statusId: nextState,
                        updateDate: new Date(),
                        createDate: new Date(),
                        createUserId: userId,
                        requestDate:
                            nextState == status.Pending ? new Date() : null,
                    }),
                    { transaction }
                );

                let flowStepDatas = await this.createFlowSteps(
                    data.requestId,
                    flowSteps,
                    transaction
                );
                data.flowStepId = flowStepDatas[0].flowStepId;
                await data.save({ transaction });
                await reqActionLogHelper.logging(
                    data.requestId,
                    actionId,
                    userId,
                    transaction
                );
                data.dataValues['flowStepDatas'] = flowStepDatas;
                if (nextState == status.Pending && flowStepDatas[0].userId) {
                    data.flowStepDatas = flowStepDatas;
                    // await this.createEmailJob(data);
                }
                logger.info(`Request Created`, {
                    method,
                    data: {
                        requestId: data.requestId,
                        actionId,
                        userId,
                        statusId: data.statusId,
                    },
                });
                res.status(201).json({
                    data: { ...data.dataValues, ...gspcData.dataValues },
                });
            });
        } catch (error) {
            // console.log(error)
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    createGspc = async (data, transaction) => {
        const method = 'CreateGspc';
        try {
            if(data.isAcceptPolicy == true){
                console.log(data)
                const result = await Gspc.create(data, {
                    transaction,
                    fields: ['shippingDate', 'equiepmentId','tel','note','isAcceptPolicy','policyId'],
                });
                return result;
            }
        } catch (error) {
            logger.error(`Error ${error.message}`, { method });
            throw error;
        }
    };

    createFlowSteps = async (requestId, flowSteps, transaction) => {
        const method = 'CreateFlowSteps';
        try {
            var result = [];
            for (let i = 0; i < flowSteps.length; i++) {
                const element = flowSteps[i];
                const appr = await FlowStep.create(
                    {
                        requestId,
                        userId: element.userId ?? null,
                        flowGroupId: element.flowGroupId ?? null,
                        flowStepTypeId: element.flowStepTypeId,
                        orderNo: i + 1,
                    },
                    { transaction }
                );
                result.push(appr.get());
            }
            return result;
        } catch (error) {
            logger.error(`Error ${error.message}`, { method });
            throw error;
        }
    };

    update = async (req, res, next) => {
        const method = 'Update';
        const { requestId } = req.params;
        const { userId } = req.user;
        try {
            await sequelize.transaction(async (ts) => {
                const { actionId, gspc } = req.body;
                const { flowSteps } = req.body;

                const request = await requestHelper.update(
                    requestId,
                    userId,
                    actionId,
                    flowSteps,
                    ts
                );

                //update banner data
                await this.updateGspc(request.dataId, gspc, ts);
                if (
                    request.statusId == status.Pending &&
                    request?.flowStepDatas[0]?.userId
                )
                    // await this.createEmailJob(request);

                logger.info(`Request Updated`, {
                    method,
                    data: {
                        userId,
                        requestId,
                        actionId,
                        statusId: request.statusId,
                    },
                });
                res.status(200).json(request);
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId },
            });
            next(error);
        }
    };

    updateGspc = async (dataId, gspc, transaction) => {
        const method = 'UpdateGspc';
        try {
            await Gspc.update(gspc, {
                where: { dataId },
                fields: ['[ShippingDate]', '[EquiepmentId]','[TicketId]','[ISSupporterId]','[Tel]','[Note]','[IsAcceptPolicy]','[PolicyId]'],
                transaction,
            });
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { bannerId },
            });
            throw error;
        }
    };

    // TODO: [JJ]: create worker for delete.
    // Dynamic to data deletion
    delete = async (req, res, next) => {
        const method = 'Delete';
        const { requestId } = req.params;
        const { userId } = req.user;
        try {
            const request = req.request;
            await request.update({ isDelete: true, deleteDate: new Date() });
            // const bannerId = request.dataId;
            // const requestActionLogs = await RequestActionLog.findAll({ where: { requestId }, transaction })
            // for (let i = 0; i < requestActionLogs.length; i++) {
            //     const e = requestActionLogs[i];
            //     await e.destroy({ transaction });
            //     await ActionLog.destroy({
            //         where: {
            //             actionLogId: e.actionLogId
            //         }, transaction
            //     });
            // }

            // const bannerDetails = await BannerDetail.findAll({ where: { bannerId } });
            // for (let i = 0; i < bannerDetails.length; i++) {
            //     const e = bannerDetails[i];
            //     await e.destroy({ transaction });
            //     await File.update({ isDelete: true, deleteDate: new Date(), deleteUserId: userId }, {
            //         where: {
            //             fileId: e.fileId
            //         }, transaction
            //     });
            // }

            // await Banner.destroy({ where: { bannerId }, transaction });
            // request.flowStepId = null;
            // await request.save({ transaction });
            // FlowStep.destroy({ where: { requestId }, transaction });
            // await request.destroy({ transaction });
            await reqActionLogHelper.logging(requestId, action.DELETE, userId);
            logger.info(`Completed`, { method, data: { userId, requestId } });
            res.status(200).send('Completed');
        } catch (error) {
            logger.error(`Error ${error.message}`, {
                method,
                data: { userId, requestId },
            });
            next(error);
        }
    };

    async createEmailJob(request) {
        const method = 'CreateEmailJob';
        try {
            const approveUser = await User.findByPk(
                request.flowStepDatas[0]?.userId
            );
            if (approveUser.employeeId) {
                const approveEmp = await Employee.findByPk(
                    approveUser.employeeId
                );
                const reqUser = await User.findByPk(request.createUserId);
                const reqEmp = await Employee.findByPk(reqUser.employeeId);
                const locals = {
                    approverName: approveEmp.nameEn,
                    requesterName: reqEmp.nameEn,
                    linkToForm: `http://localhost:9000/prm/#/approve/banner/${request.requestId}`,
                    teamName: 'Innovation',
                };
                if (approveEmp?.email)
                    await createJobEmail('request', approveEmp.email, locals);
            }
        } catch (error) {
            logger.error(`Error ${error.message}`, { method });
            throw error;
        }
    }
}

module.exports = new Controller();
