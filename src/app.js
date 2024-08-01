import express from "express"
import displayRoutes from "express-routemap"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/products.routes.js"
import cartRouter from "./routes/cart.routes.js"
import viewsRouter from "./routes/views.routes.js"
import productsModel from "./dao/models/products.model.js"
import CartManager from "./dao/db/cartManagerDb.js"
import ProductManager from "./dao/db/productManagerDb.js"
import "./database.js"


const PUERTO = 8080;
const app = express();
const cartManager = new CartManager();
const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");


const httpServer = app.listen(PUERTO, () => {
    displayRoutes(app)
});

const stats = async () => {
    const resp = await productsModel.find({ status: true }).explain("executionStats");

    console.log(resp)
}
// stats()


app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const io = new Server(httpServer);

io.on("connection", async (socket) => {

    socket.emit("products", await productManager.getProducts({ page: 1, limit: 5 }));

    socket.on('getProducts', async ({ page = 1, limit = 5 } = {}) => {
        try {
            const productsData = await productManager.getProducts({ page, limit });
            socket.emit('products', productsData);

        } catch (error) {
            console.error('Error fetching products:', error);
            socket.emit('error', 'Error fetching products');
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            if (!id) {
                socket.emit("error", "ID de producto no proporcionado");
                return;
            }

            const deletedProduct = await productManager.deleteProduct(id);

            if (!deletedProduct) {
                socket.emit("error", "Producto no encontrado");
                return;
            }

            io.sockets.emit("products", await productManager.getProducts({ page: 1, limit: 5 }));

        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            socket.emit("error", "Error al eliminar el producto");
        }
    })

    socket.on("addProduct", async (product) => {
        try {
            const newProduct = await productManager.addProduct(product);

            io.sockets.emit("products", await productManager.getProducts({ page: 1, limit: 5 }));

        } catch (error) {
            console.error("Error al agregar el producto:", error);
            socket.emit("error", "Error al agregar el producto");
        }
    })

    socket.emit("carts", await cartManager.getCarts());

    socket.on("deleteCart", async (id) => {
        try {
            if (!id) {
                socket.emit("error", "ID de carrito no proporcionado");
                return;
            }

            const deletedCart = await cartManager.deleteCart(id);

            if (!deletedCart) {
                socket.emit("error", "Carrito no encontrado");
                return;
            }

            io.sockets.emit(cartManager.getCarts());

        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            socket.emit("error", "Error al eliminar el carrito");
        }
    })

    socket.on("deleteProdCart", async (prodId, id) => {

        try {
            if (!id) {
                socket.emit("error", "ID de carrito no proporcionado");
                return;
            }

            const deletedProd = await cartManager.removeProdCart(id, prodId);

            if (!deletedProd) {
                socket.emit("error", "Carrito no encontrado");
                return;
            }

            io.sockets.emit(cartManager.getCarts());

        } catch (error) {
            console.error("Error al eliminar el carrito:", error);
            socket.emit("error", "Error al eliminar el carrito");
        }

    })

    socket.on("addProdToCart", async (products) => {
        try {
            let cart = await cartManager.createCart();

            if (!cart) {
                throw new Error('Error al crear o encontrar el carrito');
            } else {
                for (const { id, quantity } of products) {
                    await cartManager.addProdToCart(cart._id, id, quantity);
                }

                socket.emit('redirect', { url: `/realtimecarts` });

            }
        }

        catch (error) {
            console.error('Error generando carrito:', error);
            socket.emit('error', { message: 'Error agregando productos' });
        }

    })
})

async function getCartDataWithProductNames(cartManager) {
    const carts = await cartManager.getCarts();
    const productIds = carts.flatMap(cart => cart.products.map(prod => prod.product));
    const products = await productsModel.find({ _id: { $in: productIds } });

    const productsMap = products.reduce((map, product) => {
        map[product._id] = product.title;
        return map;
    }, {});

    carts.forEach(cart => {
        cart.products.forEach(prod => {
            prod.name = productsMap[prod.product] || 'Nombre Desconocido';
        });
    });

    return carts;
}