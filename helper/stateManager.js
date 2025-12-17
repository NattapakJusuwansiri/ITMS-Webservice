const StateTransition = require('../models/mssql/StateTransition');
const { initLogger } = require('../logger');
const logger = initLogger('StateManager');
const sequelize = require('../models/mssql');
const { QueryTypes } = require('sequelize');

module.exports = async (currentId, actionId, stateTypeId) => {
    const method = 'StateTransition';
    try {
        const nextState = await sequelize.query(
            `SELECT [nextId]
            FROM [StateTransition]
            WHERE stateTypeId = :stateTypeId AND currentId = :currentId AND actionId = :actionId
            `,
            {
                replacements: {
                    currentId,
                    actionId,
                    stateTypeId
                },
                mapToModel: true,
                model: StateTransition,
                type: QueryTypes.SELECT
            }
        );
        if (nextState.length == 1) return nextState[0].nextId;
        else return null;
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { currentId, actionId, stateTypeId } });
        throw error;
    }
};