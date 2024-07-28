import { Router } from "express";
import ProductManagerDB from "../dao/db/product-manager-db.js";
import CartManagerDB from "../dao/db/cart-manager-db.js";

const router = Router();
const productManager = new ProductManagerDB();
const cartManager = new CartManagerDB();

// Vista Home
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'asc' } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: { price: sort === 'asc' ? 1 : -1 }
        };
        const productos = await productManager.getProducts({}, options);
        res.render("home", { productos: productos.docs, ...productos });
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Vista Real-Time Products
router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error("Error al mostrar los productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Obtener un carrito por ID y mostrar sus productos
router.get("/carts/:cid", async (req, res) => {
    const cartID = req.params.cid;
    try {
        const carrito = await cartManager.getCarritoById(cartID);
        if (!carrito) {
            console.log("No existe el carrito");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));
        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
