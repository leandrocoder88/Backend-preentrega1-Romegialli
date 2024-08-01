import { Router } from "express";
import fs from "fs"
import path from "path"
import ProductManager from "../dao/db/productManagerDb.js";

const router = Router();

const productManager = new ProductManager();

const productsFilePath = path.resolve("./src/public/files/products.json");


router.get("/", async (req, res) => {

    try {

        const limit = parseInt(req.query.limit, 10) || 5;
        const page = parseInt(req.query.page, 10) || 1;

        const products = await productManager.getProductsApi(page, limit);

        res.status(200).json(products);

    } catch (error) {
        console.error("error al limitar la lista", error)
        res.status(500).send("error de servidor");
    }


})

router.get("/:pid", async (req, res) => {

    try {
        const productFinded = await productManager.getProductById(req.params.pid)

        if (!productFinded) {
            return res.status(404).json({ error: "Producto no encontrado" }).status(404);
        }
        res.status(200).json(productFinded);

    } catch (error) {
        console.error("prod no encontrado", error);

        res.status(500).send("Error interno del servidor");
    }
});

router.post("/", async (req, res) => {

    try {
        const newProduct = await productManager.addProduct(req.body);


        res.status(201).send(`Producto agregado exitosamente`);

    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).send(`Error interno del servidor: ${error} `);
    }
});

router.delete("/:pid", async (req, res) => {

    try {
        const productFinded = await productManager.deleteProduct(req.params.pid)
        if (!productFinded) {
            return res.status(404).json({ error: "Producto no encontrado" }).status(404);
        }
        res.status(200).send("Producto eliminado correctamente");

    } catch (error) {
        console.error("prod no encontrado", error);

        res.status(500).send("Error interno del servidor");
    }
});

router.put("/:pid", async (req, res) => {

    const id = req.params.pid;
    const productUpdate = req.body

    try {

        await productManager.updateProduct(id, productUpdate);

        res.status(200).json({ message: "Product actualizado exitosamente" });

    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});



export default router; 