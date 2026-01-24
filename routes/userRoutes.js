const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const { updateProfile } = require('../controllers/userController');

const storage = multer.diskStorage({
    destination: './uploads/profiles/',
    filename: function(req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/upload-photo', auth, upload.single('profile_picture'), async (req, res) => {
    try {
        const imagePath = `/uploads/profiles/${req.file.filename}`;
        await User.findByIdAndUpdate(req.user.id, { profile_picture: imagePath });
        res.json({ message: "Photo updated!", url: imagePath });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.put('/update-me', auth, updateProfile);
module.exports = router;