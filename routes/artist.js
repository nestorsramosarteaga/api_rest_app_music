// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Controller
const ArtistController = require('../controllers/artist');

// Define routes
router.get('/testing', ArtistController.testing);

// Export router
module.exports = router;