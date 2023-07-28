import mongoose from "mongoose";
import userModel from "./user.model";

const cartSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: [true,"userId is required"],
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"productId is required"],
    },
    colorID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    sizeID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
        type: Number,
        default: 1,
        required: [true,"quantity is required"]
    }
})

const cartModel = mongoose.model("cart", cartSchema)
export default cartModel