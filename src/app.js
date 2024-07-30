import express from "express";
import displayRoutes from "express-routemap";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManagerDB from "./dao/db/product-manager-db.js";  // Importar ProductManagerDB
import CartManagerDB from "./dao/db/cart-manager-db.js";  // Importar CartManagerDB
import "./database.js";
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

const productManager = new ProductManagerDB();  // Instancia de ProductManagerDB
const cartManager = new CartManagerDB();  // Instancia de CartManagerDB

// Registrar helpers de Handlebars
Handlebars.registerHelper('range', function (start, end) {
    var result = [];
    for (var i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
});

Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde public

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine({
    handlebars: Handlebars,
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set("views", path.join(__dirname, 'views')); // Rutas relativas
app.set("view engine", "handlebars");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter); // Ruta para las vistas

// Ruta para la URL raíz
app.get('/', (req, res) => {
    res.render('home'); // Renderizar la vista 'home'
});

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Configuración de Socket.IO
const io = new Server(httpServer);

io.on('connection', async (socket) => {
    try {
        const products = await productManager.getProducts({});
        socket.emit('products', products.docs); // Enviar solo el array de productos
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
    }

    socket.on('deleteProduct', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const products = await productManager.getProducts({});
            io.sockets.emit('products', products.docs); // Enviar solo el array de productos
        } catch (error) {
            console.error('Error eliminando producto:', error.message);
        }
    });

    socket.on('addProduct', async (product) => {
        try {
            await productManager.addProduct(product);
            const products = await productManager.getProducts({});
            io.sockets.emit('products', products.docs); // Enviar solo el array de productos
        } catch (error) {
            console.error('Error agregando producto:', error.message);
        }
    });
});
