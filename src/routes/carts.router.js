import express from 'express';
import Cart from '../dao/models/cart.model.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const newCart = new Cart();
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.productId');
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await Cart.findByIdAndUpdate(cid, { $set: { products } }, { new: true });
        res.json({ status: 'success', message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findById(cid);
        const product = cart.products.find(p => p.productId.toString() === pid);
        if (product) {
            product.quantity = quantity;
            await cart.save();
            res.json({ status: 'success', message: 'Product quantity updated' });
        } else {
            res.status(404).json({ status: 'error', message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        await Cart.findByIdAndUpdate(cid, { $set: { products: [] } });
        res.json({ status: 'success', message: 'All products removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        cart.products = cart.products.filter(p => p.productId.toString() !== pid);
        await cart.save();
        res.json({ status: 'success', message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
