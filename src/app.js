import express from "express";
import displayRoutes from "express-routemap";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/product-manager.js";

const app = express();
const PUERTO = 8080;

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'src', 'public'))); // Servir archivos estáticos desde src/public

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("views", path.join(process.cwd(), 'src', 'views')); // Rutas relativas
app.set("view engine", "handlebars");

// Servidor HTTP
const httpServer = app.listen(PUERTO, () => {
    displayRoutes(app);
});

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter); // Ruta para las vistas

const productManager = new ProductManager(path.join(process.cwd(), 'src', 'data', 'products.json'));

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

