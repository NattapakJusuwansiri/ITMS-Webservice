const { initLogger } = require('../logger.js');
const logger = initLogger('BaseController');

class BaseController {
    constructor(model) {
        this.model = model;
        this.modelName = model.name;
        this.primaryKey = `${
            this.modelName.charAt(0).toLowerCase() + this.modelName.slice(1)
        }Id`;
        this.allowedUpdateAttributes = [];

        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.listAll = this.listAll.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    create = async (req, res, next) => {
        const method = 'Create';
        const { userId } = req.user;
        try {
            const newItem = await this.model.create(req.body);
            res.status(201).json(newItem);
        } catch (error) {
            this.handleError(error, method,userId, next);
        }
    };

    list = async (req, res, next) => {
        const method = 'List';
        const { userId } = req.user;
        try {
            let { pageNo, itemPerPage } = req.query;
            pageNo = !isNaN(pageNo) ? Number(pageNo) : 1;
            itemPerPage = !isNaN(itemPerPage) ? Number(itemPerPage) : 0;
            var options = {
                page: pageNo,
                paginate: itemPerPage,
            };
            for (let key in this.model.getAttributes()) {
                if (key == 'orderNo') {
                    options.order = [['orderNo', 'ASC']];
                    break;
                }
            }

            const {
                docs: datas,
                pages,
                total,
            } = await this.model.paginate(options);

            res.status(200).json({
                datas,
                pagination: { totalPages: pages, totalItems: total },
            });
        } catch (error) {
            this.handleError(error, method, { userId }, next);
        }
    };

    listAll = async (req, res, next) => {
        const method = 'ListAll';
        // const { userId } = req.user;
        try {
            var options = {
                where: req.query,
            };
            for (let key in this.model.getAttributes()) {
                if (key == 'orderNo') {
                    options.order = [['orderNo', 'ASC']];
                    break;
                }
            }
            const datas = await this.model.findAll(options);
            res.status(200).json(datas);
        } catch (error) {
            // this.handleError(error, method, { userId }, next);
        }
    };

    getById = async (req, res, next) => {
        const method = 'GetById';
        const { userId } = req.user;
        const dataId = req.params[this.primaryKey] ?? req.params['id'];
        try {
            const item = await this.model.findByPk(dataId);
            if (item) {
                res.status(200).json(item);
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId },
                });
                res.status(404).json({
                    message: `Data not found`,
                });
            }
        } catch (error) {
            this.handleError(error, method, { userId, dataId }, next);
        }
    };

    update = async (req, res, next) => {
        const method = 'Update';
        const { userId } = req.user;
        const dataId = req.params[this.primaryKey] ?? req.params['id'];
        try {
            const updateData = this.filterAllowedAttributes(
                req.body,
                this.allowedUpdateAttributes
            );
            const [updated] = await this.model.update(updateData, {
                where: {
                    [this.primaryKey]: dataId ?? req.body[this.primaryKey],
                },
            });

            if (updated) {
                const updatedItem = await this.model.findByPk(dataId);
                logger.info('Completed', {
                    method,
                    data: { userId, dataId, model: this.modelName },
                });
                res.status(200).json(updatedItem);
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId, model: this.modelName },
                });
                res.status(404).json({
                    message: `Data not found`,
                });
            }
        } catch (error) {
            this.handleError(error, method, { userId, dataId }, next);
        }
    };

    reorder = async (req, res, next) => {
        const method = 'Reorder';
        const { userId } = req.user;
        try {
            const { list } = req.body;
            if (list) {
                for (let i = 0; i < list.length; i++) {
                    const e = list[i];
                    await this.model.update(
                        { orderNo: i + 1 },
                        {
                            where: { [this.primaryKey]: e[this.primaryKey] },
                        }
                    );
                }
            }
            res.status(200).json({ message: 'reorder is successfully' });
        } catch (error) {
            this.handleError(error, method, { userId }, next);
        }
    };

    delete = async (req, res, next) => {
        const method = 'Delete';
        const { userId } = req.user;
        const dataId = req.params[this.primaryKey] ?? req.params['id'];
        try {
            const deleted = await this.model.destroy({
                where: { [this.primaryKey]: dataId },
            });
            if (deleted) {
                logger.info('Completed', {
                    method,
                    data: { userId, dataId, model: this.modelName },
                });
                res.status(200).json({
                    message: `Delete data successfully`,
                });
            } else {
                logger.info('Data not found', {
                    method,
                    data: { userId, dataId, model: this.modelName },
                });
                res.status(404).json({
                    message: `Data not found`,
                });
            }
        } catch (error) {
            this.handleError(error, method, { userId }, next);
        }
    };

    handleError = (error, method, data, next) => {
        logger.error(`Error ${error.message}`, {
            method,
            data: { ...data, ...{ model: this.modelName } },
        });
        next(error);
    };

    setAllowedUpdateAttributes(attributes) {
        this.allowedUpdateAttributes = attributes;
    }

    // Helper method to filter allowed attributes
    filterAllowedAttributes = (data, allowedAttributes) => {
        if (!allowedAttributes || allowedAttributes.length === 0) {
            return data; // If no allowed attributes specified, return all data
        }

        return Object.keys(data)
            .filter((key) => allowedAttributes.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});
    };
}

module.exports = BaseController;
