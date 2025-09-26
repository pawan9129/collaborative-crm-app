const express = require('express');
const { body } = require('express-validator');
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const router = express.Router();

router.get('/', authMiddleware, leadController.getLeads);

router.post('/',[authMiddleware,rbacMiddleware(['ADMIN', 'MANAGER']),body('name').notEmpty(),body('email').isEmail(),validationMiddleware,],leadController.createLead);

router.put('/:id',[authMiddleware,rbacMiddleware(['ADMIN', 'MANAGER']),body('name').notEmpty(),body('email').isEmail(),validationMiddleware,],leadController.updateLead);
router.patch(
  '/:id',
  [
    authMiddleware,
    rbacMiddleware(['ADMIN', 'MANAGER']),
    body('status').notEmpty(),
    validationMiddleware,
  ],
  leadController.updateLead
);

router.delete('/:id',authMiddleware,rbacMiddleware(['ADMIN', 'MANAGER']),leadController.deleteLead);

// ✅ New route for single lead
router.get('/:id', authMiddleware, leadController.getLeadById);

module.exports = router;