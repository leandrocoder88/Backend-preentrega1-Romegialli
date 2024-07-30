import express from 'express';
import CartManagerDB from '../dao/db/cart-manager-db.js';

const router = express.Router();
const cartManager = new CartManagerDB();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.crearCarrito();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carritos = await cartManager.obtenerCarritos();
        res.status(200).json({ status: 'success', payload: carritos });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carrito = await cartManager.getCarritoById(cid);
        res.status(200).json({ status: 'success', payload: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Agregar un producto al carrito
router.post('/:cid/products', async (req, res) => {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    try {
        const updatedCart = await cartManager.agregarProductoAlCarrito(cid, productId, quantity);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.eliminarProductoDelCarrito(cid, pid);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const updatedCart = await cartManager.actualizarCarrito(cid, products);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const updatedCart = await cartManager.actualizarCantidadProducto(cid, pid, quantity);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const updatedCart = await cartManager.eliminarTodosLosProductos(cid);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
