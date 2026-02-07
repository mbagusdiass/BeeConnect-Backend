const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB'))
    .catch((err) => console.error('Gagal koneksi ke MongoDB:', err));

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const categoryRouter = require('./routes/category');


app.get('/', (req, res) => {
    res.json({ 
        message: "Welcome to BeeConnect API",
        status: "Active",
        port: process.env.PORT 
    });
});

app.use('/api/auth', authRoutes);   
app.use('/api/users', userRoutes);  
app.use('/api/stores', storeRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/categories', categoryRouter);

const PORT = process.env.PORT || 5555;
app.listen(PORT, '0.0.0.0',() => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});