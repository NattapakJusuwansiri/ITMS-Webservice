const Holiday = require('../models/mssql/Holiday');
const Gspc = require('../models/mssql/Gspc');
const BaseController = require('./BaseController');
const { Op,fn,col,literal } = require('sequelize');
const { initLogger } = require('../logger');
const logger = initLogger('UserController');

class Controller extends BaseController {
    constructor() {
        super(Holiday,Gspc);
    }
    listAll = async (req, res, next) => {
        const method = 'Calener List';
        // const { userId } = req.user;
        const toDate = new Date();
        try {
            const holidays = await Holiday.findAll({
                attributes: ['HolidayDate'],
                where: {
                    HolidayDate: {
                        [Op.gt]: toDate
                    }
                },
                group: ['HolidayDate']
            });
            const fullQueseDate = await Gspc.findAll({
                attributes: ['[ShippingDate]', [fn('COUNT', col('[ShippingDate]')), 'countShippingDate']],
                where: {
                    ShippingDate: {
                        [Op.gt]: toDate
                    },
                },
                group: ['[ShippingDate]'],
                having: literal('COUNT(ShippingDate) >= 10')
            })
            let notDateToReserve = fullQueseDate.map(fullQueseDate => fullQueseDate?.dataValues?.ShippingDate)
            notDateToReserve = holidays.map(holiday => holiday?.dataValues?.HolidayDate);
            res.status(200).json({ notDateToReserve });
        } catch (error) {
            console.log(error)
            // logger.error(`Error ${error.message}`, { method, data: { userId } });
            next(error);
        }
    };
}
module.exports = new Controller();
