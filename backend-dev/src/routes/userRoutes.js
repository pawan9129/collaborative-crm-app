const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const router = express.Router();

router.get('/', authMiddleware, rbacMiddleware(['ADMIN']), userController.getUsers);

// Add more routes

module.exports = router;