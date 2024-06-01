// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Controller
const AlbumController = require('../controllers/album');

// Define routes
router.get('/testing', AlbumController.testing);

// Export router
module.exports = router;