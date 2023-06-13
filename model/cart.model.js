import mongoose from "mongoose";
import productModel from "./product.model";
import userModel from "./user.model";
const cartModel = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productModel,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

export default mongoose.model("cart", cartModel)