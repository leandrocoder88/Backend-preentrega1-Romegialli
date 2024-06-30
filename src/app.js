import express from "express";
import displayRoutes from "express-routemap";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js"; // Nueva ruta para las vistas
import ProductManager from "./managers/product-manager.js"
const app = express();
const PUERTO = 8080;

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

// Servidor HTTP
const httpServer = app.listen(PUERTO, () => {
    displayRoutes(app);
});


// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter); // Ruta para las vistas


const productManager = new ProductManager("./src/data/products.json");

// Configuración de Socket.IO
const io = new Server(httpServer);

io.on("connection", async (socket) => {


    socket.emit("products", await productManager.getAllProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("products", await productManager.getAllProducts());
    });

    socket.on("addProduct", async (product) => {
        await productManager.createProduct(product);
        io.sockets.emit("products", await productManager.getAllProducts());
    });
});
