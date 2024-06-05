// Import dependencies
const express = require('express');
const check = require('../middlewares/auth');
// Load Router
const router = express.Router();

// Import Controller
const UserController = require('../controllers/user');

// Config uploads
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({storage})

// Define routes
router.get('/testing', check.auth, UserController.testing);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/profile/:id', check.auth, UserController.profile);
router.put('/update',check.auth, UserController.update);
router.post('/upload', [check.auth, uploads.single("file0")], UserController.upload);

// Export router
module.exports = router;