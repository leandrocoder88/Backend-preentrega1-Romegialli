import mongoose from "mongoose";


const colection = "carts";

const cartSchema = new mongoose.Schema({

    products: [

        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }

        }]

})

cartSchema.pre("findOne", function (next) {
    this.populate("products.product");
    next();
})


const cartsModel = mongoose.model(colection, cartSchema)

export default cartsModel;