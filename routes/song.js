// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Controller
const SongController = require('../controllers/song');

// Define routes
router.get('/testing', SongController.testing);

// Export router
module.exports = router;