
const Request = require('../models/mssql/Request');
const { initLogger } = require('../logger');
const logger = initLogger('Middleware');

exports.checkOwner = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { requestId } = req.params;
        const request = await Request.findByPk(requestId);
        if (request.dataValues.createUserId != userId)
            throw new Error('Unauthorized')
        next();
    } catch (error) {
        logger.error(error);
        res.status(401).send('Unauthorized');
    }
};

exports.validateCreate = async (req, res, next) => {
    try {
        const { actionId } = req.body;
        if (!actionId)
            res.status(400).json({
                message: 'need actionId to request.',
            });
        else
            next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};

exports.validateUpdate = async (req, res, next) => {
    try {
        const { flowSteps } = req.body;
        if (!flowSteps || flowSteps.length == 0)
            res.status(400).json({
                message: 'need approval flow steps to request.',
            });
        else
            next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};