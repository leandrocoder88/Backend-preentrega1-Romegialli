import cartsModel from "../models/carts.model.js";

class CartManager {


    async getCarts() {
        try {
            const carts = await cartsModel.find();
            return carts;

        } catch (error) {
            console.log("Error de servidor", error);
            throw error;
        }
    }

    async createCart(data) {

        try {
            const newCart = new cartsModel({ products: [] })
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear un carrito", error)
        }

    }

    async getCartById(cartId) {
        try {
            const cart = await cartsModel.findById(cartId)

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return cart;

        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async addProdToCart(cartId, productId, quantity = 1) {

        try {
            const cart = await this.getCartById(cartId);
            const productExist = cart.products.find(p => p.product._id.toString() === productId.toString());

            if (productExist) {
                productExist.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");
            await cart.save()
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await cartsModel.findByIdAndDelete(cartId)

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return cart;

        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async removeProdCart(cartId, prodId) {

        try {
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            cart.products = cart.products.filter(p => p.product._id.toString() !== prodId.toString());

            await cart.save();

            return cart;

        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async emptyCart(cartId) {

        try {
            const cart = await cartsModel.findById(cartId);

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            cart.products = [];

            await cart.save();

            return cart;

        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }
}

export default CartManager;