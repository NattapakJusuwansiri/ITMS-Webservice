const Request = require('../models/mssql/Request');
const actionLogHelper = require('../helper/requestActionLog');
const FlowStep = require('../models/mssql/FlowStep');
const { initLogger } = require('../logger');
const logger = initLogger('RequestHelper');
const { Op } = require('sequelize');
const stateManager = require('../helper/stateManager');
const StateType = require('../enum/stateType');
const status = require('../enum/status');


async function updateFlowSteps(requestId, flowSteps, transaction) {
    const method = 'UpdateFlowSteps';
    try {
        await actionLogHelper.clearFlow(requestId, transaction);
        const ids = flowSteps.filter(a => a.flowStepId != null).map(a => a.flowStepId);
        var wherObj = {
            requestId
        };
        if (ids.length)
            wherObj.flowStepId = {
                [Op.notIn]: ids
            }
        await FlowStep.destroy({
            where: wherObj
            , transaction
        });
        var results = [];
        for (let i = 0; i < flowSteps.length; i++) {
            const e = flowSteps[i];
            if (e.flowStepId) {
                const appr = await FlowStep.findByPk(e.flowStepId);
                if (!appr) throw new Error('Approval Flow is not found.');
                appr.userId = e.userId ?? null;
                appr.flowGroupId = e.flowGroupId ?? null;
                appr.flowStepTypeId = e.flowStepTypeId ?? null;
                appr.orderNo = i + 1;
                await appr.save({ transaction });
                results.push(appr);
            } else {
                const appr = await FlowStep.create(
                    {
                        requestId,
                        userId: e.userId ?? null,
                        flowGroupId: e.flowGroupId ?? null,
                        flowStepTypeId: e.flowStepTypeId,
                        orderNo: i + 1
                    },
                    { transaction }
                );
                results.push(appr);
            }
        }
        return results;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId, flowSteps } });
        throw error;
    }
}

exports.update = async (requestId, userId, actionId, flowSteps, transaction) => {
    const method = 'Update';
    try {
        const request = await Request.findByPk(requestId);
        request.flowStepId = null;
        request.masterFlowStepId = null;
        await request.save({ transaction });
        const nextState = await stateManager(request.statusId, actionId, StateType.Gspc);
        if (!nextState) throw new Error('next state is null');
        request.statusId = nextState;
        let flowStepDatas = await updateFlowSteps(requestId, flowSteps, transaction);
        request.flowStepDatas = flowStepDatas;
        request.flowStepId = flowStepDatas[0].flowStepId;
        request.updateDate = new Date();
        request.updateUserId = userId;
        if (nextState == status.Pending) request.requestDate = new Date();
        await actionLogHelper.logging(requestId, actionId, userId, transaction);
        await request.save({ transaction });
        return request;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { requestId, userId, actionId, flowSteps } });
        throw error;
    }
};