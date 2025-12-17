const express = require('express');

const router = express.Router();

const UserController = require('../controllers/userController');
const {  resetPassword, uploadImage } = require('../middleware/profile');

router.put('/resetPassword/:userId', resetPassword, UserController.update);
router.put('/uploadImage/:userId', uploadImage, UserController.update);

module.exports = router;
