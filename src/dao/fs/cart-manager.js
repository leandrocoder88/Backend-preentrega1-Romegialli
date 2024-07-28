import { promises as fs } from 'fs';
import path from 'path';

class CartManager {
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

    async getAllCarts() {
        return await this.readJSONFile();
    }

    async getCartById(cartId) {
        const carts = await this.readJSONFile();
        return carts.find(cart => cart.id === cartId);
    }

    async createCart(products = []) {
        const carts = await this.readJSONFile();
        const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
        const newCart = { id, products };
        carts.push(newCart);
        await this.writeJSONFile(carts);
        return newCart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const carts = await this.readJSONFile();
        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) throw new Error(`Carrito con id ${cartId} no encontrado`);

        const productIndex = cart.products.findIndex(p => p.prodId === productId);

        if (productIndex === -1) {
            cart.products.push({ prodId: productId, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        await this.writeJSONFile(carts);
        return cart;
    }
}

export default CartManager;