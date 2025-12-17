const Model = require('../models/mssql/File');
const path = require('path');
const fs = require('fs');
var mime = require('mime-types');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const { initLogger } = require('../logger');
const logger = initLogger('FileController');

exports.upload = async (req, res, next) => {
    const method = 'Upload';
    const { userId } = req.user;
    try {
        if (!req.files || !req.files.length) {
            return res.status(400).send('No file uploaded.');
        } else {
            var result = [];
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];
                const originalname = Buffer.from(
                    file.originalname,
                    'latin1'
                ).toString('utf8');
                var filedata = await Model.create({
                    fileId: uuidv4(),
                    name: originalname,
                    size: file.size,
                    contentType: file.mimetype,
                    path: file.path,
                    createDate: new Date(),
                    createUserId: req.user.userId,
                    isTemp: true,
                });

                result.push({
                    ...filedata.dataValues,
                    ...file,
                });
            }
            res.status(200).json({ files: result });
        }
    } catch (error) {
        logger.error(`Error ${error.message}`, { method, data: { userId } });
        next(error);
    }
};

exports.getById = async (req, res, next) => {
    const method = 'GetById';
    const { userId } = req.user;
    const { fileId } = req.params;
    try {
        const file = await Model.findByPk(fileId);
        if (file) {
            const fullPath = path.join(__dirname, '..', file.path);
            const fileExists = fs.existsSync(fullPath);
            if (fileExists) {
                const readStream = fs.createReadStream(fullPath);
                res.setHeader('Content-Type', mime.lookup(fullPath));
                res.setHeader('Content-Disposition', `${file.name}`);
                return readStream.pipe(res);
            } else
                logger.info(`File not exist`, {
                    method,
                    data: { userId, fileId },
                });
        } else
            logger.info(`File not found`, { method, data: { userId, fileId } });
        return res.status(404).send('File not found');
    } catch (error) {
        logger.error(`Error ${error.message}`, {
            method,
            data: { userId, fileId },
        });
        next(error);
    }
};
