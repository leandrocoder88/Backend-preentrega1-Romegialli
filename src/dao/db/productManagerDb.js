import productsModel from "../models/products.model.js";

class ProductManager {

    async addProduct({ title, description, price, code, stock, category, status, thumbnails }) {
        try {


            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const productExist = await productsModel.findOne({ code: code });

            if (productExist) {
                console.log("El codigo debe ser unico");
                return;
            };

            const newProduct = new productsModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error al agregar producto", error);
            throw error;
        }
    }

    async getProducts({ page, limit } = {}) {

        const totalProducts = await productsModel.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 5;

        try {
            const options = {
                page,
                limit
            };

            const result = await productsModel.paginate({}, options);

            const products = result.docs.map(prods => prods.toObject())

            return {
                products,
                totalPages,
                currentPage: page,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null
            };

        } catch (error) {
            console.log("Error de servidor", error);
            throw error;
        }
    }

    async getProductsApi(page, limit) {

        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 5;

        try {
            const options = {
                page,
                limit
            };

            const result = await productsModel.paginate({}, options);

            return result

        } catch (error) {
            console.log("Error de servidor", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {

            const buscado = productsModel.findById(id);

            if (!buscado) {
                console.log("Producto no encontrado");
                return null;
            } else {
                console.log("Producto encontrado");
                return buscado;
            }
        } catch (error) {
            console.log("Error de servidor", error);
            throw error;
        }
    }

    async updateProduct(id, productUpdate) {
        try {
            const updatedProduct = await productsModel.findByIdAndUpdate(id, productUpdate);

            if (!updatedProduct) {
                console.log("No existe producto para actualizar");
                return null;
            } else {
                console.log("Producto actualizado correctamente");
                return updatedProduct
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const productDeleted = await productsModel.findByIdAndDelete(id);

            if (productDeleted) {
                console.log("Producto eliminado");
                return productDeleted
            } else {
                console.log("No se encontró el producto");
                return null;
            }
        } catch (error) {
            console.log("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default ProductManager;