import { Router } from "express";
import CartManager from "../managers/cart-manager.js";
import ProductManager from "../managers/product-manager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");
const productManager = new ProductManager("./src/data/products.json");

// Obtener todos los carritos
router.get("/", async (req, res) => {
    const { limit } = req.query;
    const carts = await cartManager.getAllCarts();

    if (limit) {
        res.json(carts.slice(0, limit));
    } else {
        res.json(carts);
    }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(parseInt(cid));
        res.json(cart);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    const products = req.body;
    const newCart = await cartManager.createCart(products);
    res.status(201).json({ message: `Carrito ${newCart.id} creado correctamente` });
});

// Añadir un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const product = await productManager.getProductById(parseInt(pid));
        if (!product) {
            return res.status(404).json({ message: `No se encontró el producto: ${pid}` });
        }
        const cart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.status(201).json(cart);
    } catch (error) {
        res.status(404).send(error.message);
    }
});

export default router;
