import mongoose, { Schema } from "mongoose";
import userModel from "./user.model";
import Product from "./product.model";

const orderModel = new mongoose.Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref:userModel,
        required: [true, "user is required"]
    },
    productID: {
        type: [Schema.Types.ObjectId],
        ref:Product,
        required: [true, "product is required"]
    },  
    userBillingAddress: { 
        type: Object,
        required: [true, "billing address is required"]
    },
    userShippingAddress: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Order = mongoose.model("order", orderModel);
export default Order;