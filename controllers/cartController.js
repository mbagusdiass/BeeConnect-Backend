const Cart = require('../models/Cart');
exports.addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        let cart = await Cart.findOne({ user_id });

        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.product_id.toString() === product_id);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product_id, quantity });
            }
            await cart.save();
        } else {
            cart = new Cart({
                user_id,
                items: [{ product_id, quantity }]
            });
            await cart.save();
        }

        res.status(200).json({ message: "Added to cart", cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id })
            .populate({
                path: 'items.product_id',
                select: 'product_name price product_image store_id',
                populate: { path: 'store_id', select: 'store_name' }
            });

        if (!cart) return res.status(200).json({ items: [] });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product_id.toString() !== req.params.productId);
        await cart.save();
        res.json({ message: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};