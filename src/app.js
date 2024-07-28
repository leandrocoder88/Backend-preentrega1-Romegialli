import express from "express";
import displayRoutes from "express-routemap";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./dao/fs/product-manager.js";
import "./database.js";
import Handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

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
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde src/public

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

const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

// Ruta para manejar la URL raíz
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
    socket.emit('products', await productManager.getAllProducts());

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(parseInt(id));
        io.sockets.emit('products', await productManager.getAllProducts());
    });

    socket.on('addProduct', async (product) => {
        try {
            await productManager.createProduct(product);
            io.sockets.emit('products', await productManager.getAllProducts());
        } catch (error) {
            console.error('Error adding product:', error.message);
        }
    });
});
