// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import middlewares
const check = require('../middlewares/auth');

// Import Controller
const AlbumController = require('../controllers/album');

// Define routes
router.get('/testing', AlbumController.testing);
router.post('/save', check.auth, AlbumController.save);
router.get('/one/:id', check.auth, AlbumController.one);

// Export router
module.exports = router;