// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Controller
const UserController = require('../controllers/user');

// Define routes
router.get('/testing', UserController.testing);

// Export router
module.exports = router;