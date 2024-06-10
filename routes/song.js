// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import Middlewares
const check = require('../middlewares/auth');

// Import Controller
const SongController = require('../controllers/song');

// Config uploads
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs")
    },
    filename: (req, file, cb) => {
        cb(null, "song-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({storage})

// Define routes
router.get('/testing', SongController.testing);
router.post('/save', check.auth, SongController.save);
router.get('/one/:id', check.auth, SongController.one);
router.get('/list/:albumId', check.auth, SongController.list);
router.put('/update/:id', check.auth, SongController.update);
router.delete('/remove/:id', check.auth, SongController.remove);
router.post('/upload/:id', [check.auth, uploads.single("file0")], SongController.upload);
router.get('/image/:file', SongController.image);

// Export router
module.exports = router;