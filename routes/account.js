const express = require('express');

const router = express.Router();

const controller = require('../controllers/accountController');
const { validate } = require('../middleware/account');
const auth = require('../middleware/auth');


router.post('/login', validate, controller.login);
router.get('/',auth,controller.data);

module.exports = router;
