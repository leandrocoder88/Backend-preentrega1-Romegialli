import express from "express";
import displayRoutes from "express-routemap";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/carts.router.js";

const app = express();
const PUERTO = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Bienvenido a Delicias Aladas");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PUERTO, () => {
    displayRoutes(app);
});