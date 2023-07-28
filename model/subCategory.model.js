import mongoose, { Schema } from "mongoose";
import Category from "./category.model";

const subCategoryModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"sub-category name can't be empty"]
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:Category,
        required:[true,'please tell which type of category it is']
    },
    status:{
        type:String,
        enum:{
            values:["enable","disable"],
            message:'status should only be enable or disable'
        },
        default:"enable"
    },
    description:String,
    subCategoryImage:{
        type:String,
        required:[true,"add a sub category image"]
    }
})


const subCategory = mongoose.model("subCategory",subCategoryModel);
export default subCategory