import { Router } from "express";
import ProductManagerDB from "../dao/db/product-manager-db.js";

const router = Router();
const productManager = new ProductManagerDB();

// Obtener todos los productos
router.get("/", async (req, res) => {
    const { limit, page, sort, query } = req.query;

    try {
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        };

        const filter = query ? { category: query } : {};

        const result = await productManager.getProducts(filter, options);

        const { docs, totalPages, page: currentPage, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

        res.json({
            status: "success",
            payload: docs,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/products?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/products?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        const product = await productManager.createProduct(newProduct);
        res.status(201).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// Eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(pid);
        res.json({ status: "success", message: `Producto con id ${pid} eliminado con éxito` });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    try {
        const product = await productManager.updateProduct(pid, updatedProduct);
        res.json({ status: "success", message: "Producto actualizado con éxito", product });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

export default router;
