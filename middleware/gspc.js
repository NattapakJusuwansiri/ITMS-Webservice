const { initLogger } = require('../logger');
const { isNullOrEmpty } = require('./utility')
const Employee = require('../models/mssql/Employee')
const Department = require('../models/mssql/Department')
const User = require('../models/mssql/User')
const Request = require('../models/mssql/Request')
const Gspc = require('../models/mssql/Gspc')
const FlowStep = require('../models/mssql/FlowStep');
const FlowGroup = require('../models/mssql/FlowGroup');
const FlowGroupMember = require('../models/mssql/FlowGroupMember');
const MasterFlowStep = require('../models/mssql/MasterFlowStep');

const { Op } = require('sequelize');

const { HODREQ, HOSREQ } = require('../enum/FlowStepType');
const RequestType = require('../enum/RequestType');
const { ESS, PR } = require('../enum/BannerDetailType');
const { Pending, Approved } = require('../enum/status');

const logger = initLogger('GspcMiddleware');

const dateDifferenceInDays = (dateInitial, dateFinal) =>
    (new Date(dateFinal) - new Date(dateInitial)) / 86_400_000;

const checkLimit = async (start, end, limit) => {
    const method = 'CheckLimit'
    try {
        end = new Date(end)
        start = new Date(start)
        const gspc = await Gspc.findAll({
            include: [
                {
                    model: Request, as: 'request',
                }
            ],
            where: {
                "$gspc.request.statusId$": { [Op.in]: [Pending, Approved] },
            }
        })

        const dayCount = {};

        let dateOutLimit = null;

        loop:
        for (let i = 0; i < gspc.length; i++) {
            const gspci = gspc[i];

            const startDate = new Date(Math.max(gspci.startDate, start));
            const endDate = new Date(Math.min(gspci.endDate, end));

            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
                const dayKey = date.toISOString().split('T')[0];
                dayCount[dayKey] = (dayCount[dayKey] || 0) + 1;
                if (dayCount[dayKey] >= limit) {
                    dateOutLimit = date;
                    break loop;
                }
            }
        }
        return dateOutLimit;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method });
        throw error;
    }
}

exports.validate = async (req, res, next) => {
    const method = 'Validator';
    const { userId } = req.user;
    try {
        const data = req.body;
        const errorObj = {};
        var message = null;

        if (isNullOrEmpty(data.gspc?.shippingDate)) errorObj.shippingDate = { messageError: 'Shipping Date is require' }
        if (isNullOrEmpty(data.gspc?.equiepmentId)) errorObj.equiepmentId = { messageError: 'Equiepment is require' }
        if (isNullOrEmpty(data.gspc?.isAcceptPolicy)) errorObj.isAcceptPolicy = { messageError: 'Accept Policy is require' }
        if (isNullOrEmpty(data.gspc?.policyId)) errorObj.policyId = { messageError: 'Policy is require' }
        if (isNullOrEmpty(data.actionId)) errorObj.actionId = { messageError: 'Action is require' }

        if (Object.keys(errorObj).length || message)
            return res.status(400).json({ errors: errorObj, message });
        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId } });
        next(error);
    }
};

exports.fetchData = async (req, res, next) => {
    const method = 'FetchData';
    const { userId } = req.user;
    const { requestId } = req.params;
    try {
        if (!isNullOrEmpty(requestId)) {
            const request = await Request.findByPk(requestId);
            if (request) {
                req.request = request;
                return next();
            } else {
                logger.info(`Request not found`, { method, data: { requestId, userId } });
                return res.status(404).json({ message: `Request not found` })
            }
        } else {
            logger.info(`Request Id is null`, { method, data: { userId } });
            return res.status(400).json({ message: `Request Id can not be null` })
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId, requestId } });
        next(error);
    }
};

exports.authGet = async (req, res, next) => {
    const method = 'AuthGet';
    const { userId, isAdmin } = req.user;
    const request = req.request;
    try {
        if (isAdmin) return next();
        else if (request.createUserId == userId)
            return next();
        else {
            if (!isNullOrEmpty(request.flowStepId)) {
                const flowStep = await FlowStep.findAll({
                    where: {
                        requestId: request.requestId,
                        [Op.or]: [
                            { userId: userId },
                            { '$[flowGroup->flowGroupMember].userId$': userId },
                        ],
                    },
                    include: [
                        { model: FlowGroup, as: 'flowGroup', include: [{ model: FlowGroupMember, as: 'flowGroupMember' }] }
                    ]
                });
                if (flowStep.length)
                    return next();
            }
            if (!isNullOrEmpty(request.masterFlowStepId)) {
                const masterFlowStep = await MasterFlowStep.findAll({
                    where: {
                        masterFlowId: request.masterFlowId,
                        [Op.or]: [
                            { userId: userId },
                            { '$[flowGroup->flowGroupMember].userId$': userId },
                        ],
                    },
                    include: [
                        { model: FlowGroup, as: 'flowGroup', include: [{ model: FlowGroupMember, as: 'flowGroupMember' }] }
                    ]
                });
                if (masterFlowStep.length)
                    return next();
            }
        }
        logger.info('Unauthorized', { method, data: { userId, requestId: request.requestId } });
        return res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId, requestId: request?.requestId } });
        next(error);
    }
};

exports.authOwner = async (req, res, next) => {
    const method = 'AuthOwner';
    const { userId, isAdmin } = req.user;
    const request = req.request;
    try {
        if (isAdmin) return next();
        if (request.createUserId != userId) {
            logger.info('User not found', { method, data: { userId, requestId: request.requestId } });
            return res.status(401).json({ message: 'Unauthorized' });
        } else
            return next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId, requestId: request?.requestId } });
        next(error);
    }
};

const recusiveReportTo = async (reportTo, orgStructureId) => {
    const method = 'RecusiveReportTo';
    try {
        const empData = await Employee.findByPk(reportTo.employeeId, { raw: true });
        const dept = await Department.findByPk(empData.departmentId, { raw: true })
        if (dept.orgStructureId == orgStructureId && empData.isHead) {
            return empData;
        }
        else if (empData.reportToId == null) {
            return null;
        }
        else {
            const reportToData = await Employee.findByPk(empData.reportToId, { raw: true });
            return await recusiveReportTo(reportToData, orgStructureId)
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { employeeId: reportTo?.employeeId, orgStructureId } });
        throw error;
    }
}

exports.bindFlowSteps = async (req, res, next) => {
    const method = 'BindFlowSteps';
    // const { userId } = req.user;
    const { requestId } = req.params;
    try {
        // TODO: [JJ]: Refactor recursive method.
        if (!requestId) {
            const { employeeId } = req.user;
            const empData = await Employee.findByPk(employeeId, { raw: true });
            const hos = await recusiveReportTo(empData, 4) // [JJ] 5 = orgStructureId = Section
            if (!hos) {
                logger.info('Head of section not found', { method, data: { userId } });
                return res.status(400).json({ message: 'Approver not found' });
            }
            const hosUser = await User.findOne({
                where: {
                    employeeId: hos.employeeId
                }
            })
            const hod = await recusiveReportTo(empData, 5) // [JJ] 5 = orgStructureId = Department
            if (!hod) {
                logger.info('Head of department not found', { method, data: { userId } });
                return res.status(400).json({ message: 'Approver not found' });
            }
            const hodUser = await User.findOne({
                where: {
                    employeeId: hod.employeeId
                }
            })

            req.body.flowSteps = [
                { userId: hosUser.userId, flowStepTypeId: HOSREQ },
                { userId: hodUser.userId, flowStepTypeId: HODREQ },
            ];
        } else {
            const apprFlows = await FlowStep.findAll({
                where: {
                    requestId,
                    flowStepTypeId: {
                        [Op.or]: [HOSREQ, HODREQ],
                    },
                }
            })
            if (apprFlows.length == 2) {
                req.body.flowSteps = apprFlows;
            }
            else {
                logger.info('Approval Flow Step length should be 2', { method, data: { userId, requestId: requestId } });
                return res.status(400).json({ message: 'Approve flow not match.' });
            }
        }
        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId } });
        next(error);
    }
};

exports.mapBannerDetail = async (req, res, next) => {
    const method = 'MapBannerDetail';
    try {
        const { bannerDetailEss, bannerDetailPr } = req.body;
        req.body.bannerDetails = [];
        if (bannerDetailEss)
            req.body.bannerDetails.push({ ...bannerDetailEss, ...{ bannerDetailTypeId: ESS, fileId: bannerDetailEss.fileId ?? bannerDetailEss.file.fileId } })
        if (bannerDetailPr)
            req.body.bannerDetails.push({ ...bannerDetailPr, ...{ bannerDetailTypeId: PR, fileId: bannerDetailPr.fileId ?? bannerDetailPr.file.fileId } })
        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId, requestId: request?.requestId } });
        next(error);
    }
};

exports.bindFilter = (req, res, next) => {
    const method = 'BindFilter';
    const { isAdmin } = req.user;
    try {
        const { keyword, statusId } = req.query;
        req.query.filter = {};
        req.query.filter[Op.or] = [];
        if (!isNullOrEmpty(keyword)) {
            const kw = keyword.trim().toLowerCase();
            req.query.filter[Op.or].push(
                { '$banner.code$': { [Op.like]: `%${kw}%` } },
                { '$banner.reason$': { [Op.like]: `%${kw}%` } },
            )
        }

        if (!isNullOrEmpty(statusId))
            req.query.filter.statusId = statusId;

        req.query.filter.requestTypeId = RequestType.Banner;

        if (!req.query.filter[Op.or].length)
            delete req.query.filter[Op.or]

        if (!isAdmin){
            req.query.filter.createUserId = req.user.userId;
            req.query.filter.isDelete = false;
        }

        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
};

exports.bindFilterBannerDetails = (req, res, next) => {
    const method = 'BindFilterBannerDetails';
    const { isAdmin } = req.user;
    try {
        const { keyword, statusId } = req.query;
        req.query.filter = {
            "$banner.request.statusId$": Approved,
            // bannerDetailTypeId
        };
        // req.query.filter[Op.or] = [];
        // if (!isNullOrEmpty(keyword)) {
        //     const kw = keyword.trim().toLowerCase();
        //     req.query.filter[Op.or].push(
        //         { '$banner.code$': { [Op.like]: `%${kw}%` } },
        //         { '$banner.reason$': { [Op.like]: `%${kw}%` } },
        //     )
        // }

        // if (!isNullOrEmpty(statusId))
        //     req.query.filter.statusId = statusId;

        // req.query.filter.requestTypeId = RequestType.Banner;

        // if (!req.query.filter[Op.or].length)
        //     delete req.query.filter[Op.or]

        // if (!isAdmin)
        //     req.query.filter.createUserId = req.user.userId;
        next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method });
        next(error);
    }
};


exports.validateDelete = async (req, res, next) => {
    const method = 'ValidateDelete';
    const { userId, isAdmin } = req.user;
    const request = req.request;
    try {
        if (isAdmin) return next();
        // TODO: [JJ]: use Enum
        if (request.dataValues.statusId != 1) {
            logger.error(`Unable to delete: Request status is not in draft.`, { method, data: { userId, requestId: request.requestId } });
            res.status(400).json({ message: 'Unable to delete: Request status is not in draft.' });
        }
        else
            next();
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId, requestId: request?.requestId } });
        next(error);
    }
}