const Model = require('../models/mssql/Status');
const BaseController = require('./BaseController');

class Controller extends BaseController {
    constructor() {
        super(Model);
    }
}
module.exports = new Controller();
