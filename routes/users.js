const express = require('express');

const router = express.Router();

const UserController = require('../controllers/userController');
const { create, update, updateStatus } = require('../middleware/user');

router.post('/', create, UserController.create);

router.get('/', UserController.list);

router.get('/:userId', UserController.getById);

router.put('/updateStatus/:userId', updateStatus, UserController.updateStatus);

router.put('/:userId', update, UserController.update);

router.delete('/:userId', UserController.delete);

module.exports = router;
