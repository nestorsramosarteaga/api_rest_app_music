// Import dependencies
const express = require('express');

// Load Router
const router = express.Router();

// Import middlewares
const check = require('../middlewares/auth');

// Import Controller
const AlbumController = require('../controllers/album');

// Config uploads
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/albums")
    },
    filename: (req, file, cb) => {
        cb(null, "album-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({storage})

// Define routes
router.get('/testing', AlbumController.testing);
router.post('/save', check.auth, AlbumController.save);
router.get('/one/:id', check.auth, AlbumController.one);
router.get('/list/:artistId', check.auth, AlbumController.list);
router.put('/update/:id', check.auth, AlbumController.update);
router.post('/upload/:id', [check.auth, uploads.single("file0")], AlbumController.upload);
router.get('/image/:file', AlbumController.image);
// Export router
module.exports = router;