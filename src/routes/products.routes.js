import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const productsFilePath = path.resolve("./src/public/files/products.json");

// Función para leer el archivo de productos
const readProductsFile = () => {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data);
};

// Función para escribir en el archivo de productos
const writeProductsFile = (data) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2));
};

// Middleware para cargar los productos
router.use((req, res, next) => {
    req.products = readProductsFile();
    next();
});

// Obtener todos los productos
router.get("/", (req, res) => {
    const { products } = req;
    const { limit } = req.query;

    const productsToSend = limit ? products.slice(0, limit) : products;
    res.json(productsToSend);
});

// Obtener un producto por su ID
router.get("/:pid", (req, res) => {
    const { pid } = req.params;
    const { products } = req;

    const product = products.find(product => product.id === parseInt(pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send("Producto no encontrado");
    }
});

// Crear un nuevo producto
router.post("/", (req, res) => {
    const { body: newProduct } = req;
    const { products } = req;

    const requiredFields = ["name", "brand", "description", "price", "img", "categorie", "code", "stock", "status"];
    const missingFields = requiredFields.filter(field => !newProduct[field]);

    if (missingFields.length > 0) {
        res.status(400).json({ error: "Complete todos los campos" });
        return;
    }

    if (products.some(item => item.code === newProduct.code)) {
        res.status(400).send("El código debe ser único");
        return;
    }

    const id = products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
    const updatedProducts = [...products, { id, ...newProduct }];

    writeProductsFile(updatedProducts);
    res.status(201).json({ id });
});

// Eliminar un producto por su ID
router.delete("/:pid", (req, res) => {
    const { pid } = req.params;
    const { products } = req;

    const updatedProducts = products.filter(product => product.id !== parseInt(pid));

    if (updatedProducts.length < products.length) {
        writeProductsFile(updatedProducts);
        res.send(`Producto con id ${pid} eliminado con éxito`);
    } else {
        res.status(404).json({ error: "PRODUCTO NO ENCONTRADO" });
    }
});

// Actualizar un producto por su ID
router.put("/:pid", (req, res) => {
    const { pid } = req.params;
    const { body: updatedProduct } = req;
    const { products } = req;

    const index = products.findIndex(product => product.id === parseInt(pid));
    if (index !== -1) {
        const updatedProducts = [...products];
        updatedProducts[index] = { ...updatedProducts[index], ...updatedProduct };
        writeProductsFile(updatedProducts);
        res.json({ message: "Producto actualizado con éxito", product: updatedProducts[index] });
    } else {
        res.status(404).json({ error: "PRODUCTO NO ENCONTRADO" });
    }
});

export default router;