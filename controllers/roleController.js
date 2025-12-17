const Model = require('../models/mssql/Role');
const BaseController = require('./BaseController');

class Controller extends BaseController {
    constructor() {
        super(Model);
    }
}
module.exports = new Controller();
