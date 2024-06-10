// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Middlewares
const check = require('../middlewares/auth');

// Import Controller
const SongController = require('../controllers/song');

// Define routes
router.get('/testing', SongController.testing);
router.post('/save', check.auth, SongController.save);

// Export router
module.exports = router;