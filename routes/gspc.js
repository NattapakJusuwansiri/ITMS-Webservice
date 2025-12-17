const express = require('express');

const router = express.Router();
const gspc = require('../controllers/gspcController');
const calendar = require('../controllers/calendarController');

/**
 * 
 * If you auth data you need to fetch first.
 * 
 */
const {checkLimit, fetchData, authGet, authOwner, bindFlowSteps, mapBannerDetail, bindFilter, validate, validateDelete, bindFilterBannerDetails } = require('../middleware/gspc')

// Holiday and Full Quese Calender
router.get('/calender', calendar.listAll);
router.post('/calender',calendar.create);

// Gspc Request
router.get('/requester',checkLimit, gspc.listRequest);
router.get('/approve',checkLimit, gspc.listApprove);
router.get('/isSuport',checkLimit, gspc.listIsSupport);
router.get('/innovation',checkLimit, gspc.listInnovation);
router.post('/',validate,bindFlowSteps, gspc.create);
router.put('/approve/:requestId', gspc.approve);
router.put('/:requestId', gspc.update);
router.delete('/:requestId', gspc.delete);
router.get('/:requestId',  gspc.getById);


module.exports = router;
