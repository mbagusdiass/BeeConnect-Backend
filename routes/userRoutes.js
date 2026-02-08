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

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        
        res.json(user);
    } catch (err) {
        console.error("Error Get Profile:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
});
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

router.put('/update-profile-full', auth, upload.single('profile_picture'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profile_picture = `/uploads/profiles/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { $set: updateData }, 
            { new: true }
        ).select('-password');

        res.json({ message: "Profile updated successfully!", user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});