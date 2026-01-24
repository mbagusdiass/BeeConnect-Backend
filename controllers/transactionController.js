const Transaction = require('../models/Transaction');
const TransactionDetail = require('../models/TransactionDetail');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const snap = require('../config/midtrans'); 
const Store = require('../models/Store');
exports.checkout = async (req, res) => {
    try {
        const user_id = req.user.id;

        const cart = await Cart.findOne({ user_id }).populate('items.product_id');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        let total_price = 0;
        const order_id = `BECON-${Date.now()}-${user_id.toString().slice(-4)}`;

        const transaction = new Transaction({
            buyer_id: user_id,
            order_id: order_id,
            total_price: 0, 
            payment_status: 'pending'
        });

        for (const item of cart.items) {
            const product = item.product_id;
            
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.product_name}` });
            }

            const subtotal = product.price * item.quantity;
            total_price += subtotal;

            const detail = new TransactionDetail({
                transaction_id: transaction._id,
                product_id: product._id,
                product_name_snapshot: product.product_name,
                price_snapshot: product.price,
                quantity: item.quantity,
                subtotal: subtotal
            });
            await detail.save();

            itemDetailsForMidtrans.push({
                id: product._id.toString(),
                price: product.price,
                quantity: item.quantity,
                name: product.product_name
            });
        }

        transaction.total_price = total_price;

        let parameter = {
            "transaction_details": {
                "order_id": order_id,
                "gross_amount": total_price
            },
            "item_details": itemDetailsForMidtrans,
            "customer_details": {
                "first_name": req.user.name,
                "email": req.user.email,
                "phone": req.user.phone_number || ""
            },
            "usage_limit": 1
        };
        const midtransResponse = await snap.createTransaction(parameter);
        
        transaction.snap_token = midtransResponse.token;
        await transaction.save();
        await Cart.findOneAndDelete({ user_id });
        res.status(201).json({
            message: "Transaction created successfully",
            snap_token: transaction.snap_token,
            order_id: transaction.order_id,
            total_price: transaction.total_price
        });

    } catch (err) {
        console.error("Checkout Error:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};
exports.getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ buyer_id: req.user.id })
            .sort({ createdAt: -1 });
            
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getTransactionDetail = async (req, res) => {
    try {
        const details = await TransactionDetail.find({ transaction_id: req.params.transactionId });
        res.json(details);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBuyerHistory = async (req, res) => {
    try {
        const history = await Transaction.find({ buyer_id: req.user.id })
            .sort({ createdAt: -1 }); 

        res.json({
            success: true,
            message: "Buyer transaction history retrieved",
            data: history
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getSellerHistory = async (req, res) => {
    try {
        const store = await Store.findOne({ user_id: req.user.id });
        if (!store) return res.status(404).json({ message: "Store not found" });

        const sales = await TransactionDetail.find()
            .populate({
                path: 'transaction_id',
                match: { payment_status: 'settlement' }
            })
            .populate('product_id', 'product_name product_image')
            .sort({ createdAt: -1 });
        const filteredSales = sales.filter(item => 
            item.transaction_id !== null && 
            item.product_id !== null
        );

        res.json({
            success: true,
            message: "Seller sales history retrieved",
            data: filteredSales
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getDetailHistory = async (req, res) => {
    try {
        const details = await TransactionDetail.find({ transaction_id: req.params.id })
            .populate('product_id', 'product_name price product_image');

        if (!details || details.length === 0) {
            return res.status(404).json({ message: "No items found for this transaction" });
        }

        res.json({
            success: true,
            data: details
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};