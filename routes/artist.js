// Import dependencies
const express = require('express');
const check = require('../middlewares/auth');

// Load Router
const router = express.Router();

// Import Controller
const ArtistController = require('../controllers/artist');

// Define routes
router.get('/testing', ArtistController.testing);
router.post('/save', check.auth, ArtistController.save);
router.get('/one/:id', check.auth, ArtistController.one);
router.get('/list/:page?', check.auth, ArtistController.list);
router.put('/update/:id', check.auth, ArtistController.update);

// Export router
module.exports = router;