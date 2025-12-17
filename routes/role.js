const express = require('express');

const router = express.Router();

const controller = require('../controllers/roleController');

router.post('/', controller.create);

router.get('/', controller.listAll);

router.get('/:roleId', controller.getById);

router.put('/:roleId', controller.update);

router.delete('/:roleId', controller.delete);

module.exports = router;
