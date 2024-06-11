import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const cartsFilePath = path.resolve("./src/data/carts.json");
const productsFilePath = path.resolve("./src/data/products.json");

// Función para leer archivos JSON
const readJSONFile = (filePath) => {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
};

// Función para escribir archivos JSON
const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Obtener todos los carritos
router.get("/", (req, res) => {
    const { limit } = req.query;
    const carts = readJSONFile(cartsFilePath);

    if (limit) {
        res.json(carts.slice(0, limit));
    } else {
        res.json(carts);
    }
});

// Obtener un carrito por ID
router.get("/:cid", (req, res) => {
    const { cid } = req.params;
    const carts = readJSONFile(cartsFilePath);
    const cart = carts.find(cart => cart.id === parseInt(cid));

    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send("Carrito no encontrado");
    }
});

// Crear un nuevo carrito
router.post("/", (req, res) => {
    const products = req.body;
    const carts = readJSONFile(cartsFilePath);

    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products };

    carts.push(newCart);
    writeJSONFile(cartsFilePath, carts);

    res.status(201).json({ message: `Carrito ${id} creado correctamente` });
});

// Añadir un producto a un carrito
router.post("/:cid/product/:pid", (req, res) => {
    const { cid, pid } = req.params;

    const carts = readJSONFile(cartsFilePath);
    const products = readJSONFile(productsFilePath);

    const cart = carts.find(cart => cart.id === parseInt(cid));
    if (!cart) {
        return res.status(404).json({ message: `No se encontró el carrito: ${cid}` });
    }

    const product = products.find(product => product.id === parseInt(pid));
    if (!product) {
        return res.status(404).json({ message: `No se encontró el producto: ${pid}` });
    }

    const productIndex = cart.products.findIndex(p => p.prodId === parseInt(pid));
    if (productIndex === -1) {
        cart.products.push({ prodId: parseInt(pid), quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }

    writeJSONFile(cartsFilePath, carts);
    res.status(201).json(cart);
});

export default router;