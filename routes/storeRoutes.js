const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Store = require('../models/Store');
const { createStore, updateStore, getAllStores, getStoreProfile } = require('../controllers/storeController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/stores/',
    filename: function(req, file, cb) {
        cb(null, 'store-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', getAllStores);
router.post('/create', auth, createStore);
router.get('/me', auth, getStoreProfile);
router.put('/update', auth, updateStore);
router.post('/upload-image', auth, upload.single('store_image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Please upload a file" });

        const imagePath = `/uploads/stores/${req.file.filename}`;
        const store = await Store.findOneAndUpdate(
            { user_id: req.user.id },
            { store_image: imagePath },
            { new: true }
        );

        if (!store) return res.status(404).json({ message: "Store not found. Create a store first." });

        res.json({ message: "Store image updated successfully!", url: imagePath, store });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;