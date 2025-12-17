const ActionLog = require('../models/mssql/ActionLog');
const RequestActionLog = require('../models/mssql/RequestActionLog');

const { initLogger } = require('../logger');
const logger = initLogger('ActionLogHelper');

exports.logging = async (requestId, actionId, actionUserId, transaction = null) => {
    const method = 'Logging';
    try {
        const options = {};
        if (transaction) options.transaction = transaction;

        const actionLog = await ActionLog.create({
            actionId,
            actionUserId,
            actionDate: new Date()
        }, options);
        actionLog.requestActionLog = await RequestActionLog.create({ actionLogId: actionLog.actionLogId, requestId }, options)
        return actionLog;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId, actionId, actionUserId } });
        throw error;
    }
};


exports.approve = async (requestId, actionId, actionUserId, comment, flowStepId, transaction = null) => {
    const method = 'Approve';
    try {
        const options = {};
        if (transaction) options.transaction = transaction;
        const actionLog = await ActionLog.create({
            actionId,
            actionUserId,
            actionDate: new Date()
        }, options);
        actionLog.requestActionLog = await RequestActionLog.create({ actionLogId: actionLog.actionLogId, requestId, comment, flowStepId }, options)
        return actionLog;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId, actionId, actionUserId, comment, flowStepId } });
        throw error;
    }
};

exports.approveMaster = async (requestId, actionId, actionUserId, comment, masterFlowStepId, transaction = null) => {
    const method = 'ApproveMaster';
    try {
        const options = {};
        if (transaction) options.transaction = transaction;

        const actionLog = await ActionLog.create({
            actionId,
            actionUserId,
            actionDate: new Date()
        }, options);
        actionLog.requestActionLog = await RequestActionLog.create({ actionLogId: actionLog.actionLogId, requestId, comment, masterFlowStepId }, options)
        return actionLog;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId, actionId, actionUserId, comment, masterFlowStepId } });
        throw error;
    }
};


exports.clearFlow = async (requestId, transaction = null) => {
    const method = 'ClearFlow';
    try {
        const options = {
            where: {
                requestId
            }
        };
        if (transaction) options.transaction = transaction;

        await RequestActionLog.update({ flowStepId: null, masterFlowStepId: null }, options);
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId } });
        throw error;
    }
};
