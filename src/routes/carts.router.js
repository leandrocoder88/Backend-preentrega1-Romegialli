import { Router } from "express";
import CartManagerDB from "../dao/db/cart-manager-db.js";
import ProductManagerDB from "../dao/db/product-manager-db.js";

const router = Router();
const cartManager = new CartManagerDB();
const productManager = new ProductManagerDB();

// Obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.obtenerCarritos();
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
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCarritoById(cid);
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
        const newCart = await cartManager.crearCarrito();
        res.status(201).json({ message: `Carrito ${newCart._id} creado correctamente`, cart: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Añadir un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body; // Asumiendo que se puede pasar la cantidad en el cuerpo de la solicitud

    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ message: `No se encontró el producto: ${pid}` });
        }

        const updatedCart = await cartManager.agregarProductoAlCarrito(cid, pid, quantity || 1);
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
