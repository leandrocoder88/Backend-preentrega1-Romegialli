import { Router } from "express";
import CartManager from "../managers/cart-manager.js";
import ProductManager from "../managers/product-manager.js";
import path from "path";

const router = Router();
const cartManager = new CartManager(path.resolve("src/data/cart.json"));
const productManager = new ProductManager(path.resolve("src/data/products.json"));

// Obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        const { limit } = req.query;
        if (limit) {
            res.json(carts.slice(0, limit));
        } else {
            res.json(carts);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(parseInt(req.params.cid));
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).send("Carrito no encontrado");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: `Carrito ${newCart.id} creado correctamente`, cart: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Añadir un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const product = await productManager.getProductById(productId);
        if (!product) {
            return res.status(404).json({ message: `No se encontró el producto: ${productId}` });
        }

        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;