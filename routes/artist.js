// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Middlewares
const check = require('../middlewares/auth');

// Import Controller
const ArtistController = require('../controllers/artist');

// Config uploads
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists")
    },
    filename: (req, file, cb) => {
        cb(null, "artist-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({storage})

// Define routes
router.get('/testing', ArtistController.testing);
router.post('/save', check.auth, ArtistController.save);
router.get('/one/:id', check.auth, ArtistController.one);
router.get('/list/:page?', check.auth, ArtistController.list);
router.put('/update/:id', check.auth, ArtistController.update);
router.delete('/remove/:id', check.auth, ArtistController.remove);
router.post('/upload/:id', [check.auth, uploads.single("file0")], ArtistController.upload);
router.get('/image/:file', ArtistController.image);

// Export router
module.exports = router;