const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

const { getAllUsers, deleteUser, adminUpdateUser, deleteStore,adminUpdateStoreStatus,
    adminUpdateStore } = require('../controllers/adminController');
const { deleteProduct } = require('../controllers/productController');
const { getAllStores } = require('../controllers/storeController')

const { createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const catStorage = multer.diskStorage({
    destination: './uploads/categories/',
    filename: (req, file, cb) => {
        cb(null, 'cat-' + Date.now() + path.extname(file.originalname));
    }
});
const uploadCat = multer({ storage: catStorage });
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id', auth, admin, adminUpdateUser);
router.delete('/users/:id', auth, admin, deleteUser);
router.delete('/stores/:id', auth, admin, deleteStore);
router.delete('/products/:id', auth, admin, deleteProduct);
router.post('/categories', auth, admin, uploadCat.single('category_image'), createCategory);
router.put('/categories/:id', auth, admin, uploadCat.single('category_image'), updateCategory);
router.delete('/categories/:id', auth, admin, deleteCategory);
router.put('/stores/:id/status', auth, admin, adminUpdateStoreStatus);
router.put('/stores/:id', auth, admin, adminUpdateStore);
router.get('/stores', auth, admin, getAllStores);
module.exports = router;