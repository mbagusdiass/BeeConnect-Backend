const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    getMyProducts 
} = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/products/',
    filename: (req, file, cb) => {
        cb(null, 'prod-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/my-products', auth, getMyProducts); 
router.get('/store/:storeId', getProductById);
router.post('/', auth, upload.single('product_image'), createProduct);
router.put('/update/:id', auth, upload.single('product_image'), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;