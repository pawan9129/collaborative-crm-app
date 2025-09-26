const express = require('express');
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, activityController.createActivity);
router.get('/:leadId', authMiddleware, activityController.getLeadActivities);
module.exports = router;