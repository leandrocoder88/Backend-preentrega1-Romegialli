import { promises as fs } from 'fs';
import path from 'path';

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async readJSONFile() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }

    async writeJSONFile(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    }

    async getAllProducts() {
        return await this.readJSONFile();
    }

    async getProductById(productId) {
        const products = await this.readJSONFile();
        return products.find(product => product.id === productId);
    }

    async createProduct(newProduct) {
        const products = await this.readJSONFile();

        const requiredFields = ["title", "description", "price", "img", "code", "stock", "category", "status"];
        const missingFields = requiredFields.filter(field => !newProduct[field]);

        if (missingFields.length > 1) {
            throw new Error("Complete todos los campos");
        }

        if (products.some(item => item.code === newProduct.code)) {
            throw new Error("El código debe ser único");
        }

        const id = products.length ? Math.max(...products.map(product => product.id)) + 1 : 1;
        const updatedProducts = [...products, { id, ...newProduct }];

        await this.writeJSONFile(updatedProducts);

        console.log("Producto creado:", { id, ...newProduct });
        return id;
    }

    async deleteProduct(productId) {
        const products = await this.readJSONFile();
        const updatedProducts = products.filter(product => product.id !== productId);

        if (updatedProducts.length === products.length) {
            console.error("PRODUCTO NO ENCONTRADO:", productId);
            throw new Error("PRODUCTO NO ENCONTRADO");
        }

        await this.writeJSONFile(updatedProducts);

        console.log("Producto eliminado:", productId);
    }

    async updateProduct(productId, updatedProduct) {
        const products = await this.readJSONFile();
        const index = products.findIndex(product => product.id === productId);

        if (index === -1) {
            console.error("PRODUCTO NO ENCONTRADO:", productId);
            throw new Error("PRODUCTO NO ENCONTRADO");
        }

        products[index] = { ...products[index], ...updatedProduct };
        await this.writeJSONFile(products);

        console.log("Producto actualizado:", products[index]);
        return products[index];
    }
}

export default ProductManager;
