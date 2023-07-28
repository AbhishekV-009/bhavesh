import mongoose from "mongoose";

const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name is required"]
    },
    price: {
        type: Number,
        required: [true, "product price is required"],
        default: 0,
        validate: {
            validator: function (val) {
                return val >= 0;
            },
            message: 'price should not be less than 0'
        }
    },
    description: {
        type: String,
        required: [true, "product description is required"]
    },
    shortDescription: {
        type: String,
        required: [true, "product short-description is required"]
    },
    categoryID:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"categoryID is required"]
    },
    subCategoryID:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"subCategoryID is required"]
    },
    status: {
        type: String,
        enum: {
            values: ["enable", "disable"],
            message: 'status should only be enable or disable'
        },
        default: "enable"
    },

    //color and size 
    colorAndSize: [
        {
            colorName: {
                type: String
            },
            colorImage: {
                type: [String]
            },
            sizeAndQuantity: [
                {
                    size: String,
                    price: Number,
                    quantity: String
                }
            ]
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


const Product = mongoose.model("product", ProductModel);
export default Product;
