// Import dependencies
const express = require('express');
const check = require("../middlewares/auth");
// Load Router
const router = express.Router();

// Import Controller
const UserController = require('../controllers/user');

// Define routes
router.get('/testing', check.auth, UserController.testing);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile/:id', check.auth, UserController.profile);

// Export router
module.exports = router;