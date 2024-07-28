import "../../database.js"; // Importa la conexión a la base de datos
import ProductModel from "../models/product.model.js";

class ProductManagerDB {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios");
            }

            const existeProducto = await ProductModel.findOne({ code });

            if (existeProducto) {
                throw new Error("El código debe ser único");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            console.log("Producto creado:", newProduct);
            return newProduct._id;
        } catch (error) {
            console.error("Error al agregar producto:", error);
            throw error;
        }
    }

    async getProducts(filter = {}, options = {}) {
        try {
            const result = await ProductModel.paginate(filter, options);
            return result;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);

            if (!product) {
                console.error("Producto no encontrado:", id);
                throw new Error("Producto no encontrado");
            }

            console.log("Producto encontrado:", product);
            return product;
        } catch (error) {
            console.error("Error al buscar producto por id:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });

            if (!product) {
                console.error("No se encuentra el producto a actualizar:", id);
                throw new Error("No se encuentra el producto a actualizar");
            }

            console.log("Producto actualizado con éxito:", product);
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id);

            if (!product) {
                console.error("No se encuentra el producto que se debe borrar:", id);
                throw new Error("No se encuentra el producto que se debe borrar");
            }

            console.log("Producto eliminado:", id);
            return product;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }
}

export default ProductManagerDB;
