import { Router } from "express";
import ProductManager from "../managers/product-manager.js";


const router = Router();
const productManager = new ProductManager("src/data/products.json");

// Vista Home
router.get("/", async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render("home", { products });
});

// Vista Real-Time Products
router.get("/realTimeProducts", async (req, res) => {
    res.render("realTimeProducts");
});

export default router;
