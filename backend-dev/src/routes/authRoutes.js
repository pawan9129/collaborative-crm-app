const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validationMiddleware = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/login',[body('email').isEmail(),body('password').notEmpty(),validationMiddleware,],authController.login);
router.post('/register',[body('name').notEmpty(),body('email').isEmail(),body('password').isLength({ min: 6 }),validationMiddleware,],authController.register);
router.post('/refresh-token',[body('refreshToken').notEmpty(), validationMiddleware],authController.refreshToken);

module.exports = router;