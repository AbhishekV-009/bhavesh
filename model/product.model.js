import mongoose, { Schema } from "mongoose";

const ProductModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"product name is required"]
    },
    price:{
        type:Number,
        required:[true,"product price is required"],
        default:0,
        validate:{
            validator:function(val){
                return val>=0;
            },
            message:'price should not be less than 0'
        }
    },
    status:{
        type:String,
        enum:{
            values:["enable","disable"],
            message:'status should only be enable or disable'
        },
        default:"enable"
    },
    stockStatus:{
        type:String,
        enum:{
            values:["out of stock","In Stock"],
            message:'status should only be out of stock or In Stock'
        },
        default:"In Stock"
    },
    quantity:{
        type:Number,
        default:1
    },
    category:{
        type:Schema.Types.ObjectId,
        required:[true,"product category is required"]
    },
    subCategory:{
        type:Schema.Types.ObjectId,
        required:[true,"product sub-category is required"]
    },
    productImage:{
        type:[String],
        required:[true,"product image is required"]
    },
    description:{
        type:String,
        required:[true,"product description is required"]
    },
    shortDescription:{
        type:String,
        required:[true,"product short-description is required"]
    }
})

const Product = mongoose.model("product",ProductModel);
export default Product;  