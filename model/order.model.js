import mongoose, { Schema } from "mongoose";
import userModel from "./user.model";

const orderModel = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userModel,
        required: [true, "userId is required"],
    },
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "productId is required"],
    },
    colorID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    sizeID: {
        type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model("order", orderModel);
export default Order;