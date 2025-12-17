const express = require('express');

const router = express.Router();

const controller = require('../controllers/calendarController');

router.get('/', controller.listAll);

module.exports = router;
