import { Router } from "express";
import ProductManager from "../managers/product-manager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// Obtener todos los productos
router.get("/", async (req, res) => {
    const products = await productManager.getAllProducts();
    const { limit } = req.query;
    const productsToSend = limit ? products.slice(0, limit) : products;
    res.json(productsToSend);
});

// Obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(parseInt(pid));
        res.json(product);
    } catch (error) {
        res.status(404).send("Producto no encontrado");
    }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        const id = await productManager.createProduct(newProduct);
        res.status(201).json({ id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(parseInt(pid));
        res.send(`Producto con id ${pid} eliminado con éxito`);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    try {
        const product = await productManager.updateProduct(parseInt(pid), updatedProduct);
        res.json({ message: "Producto actualizado con éxito", product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
