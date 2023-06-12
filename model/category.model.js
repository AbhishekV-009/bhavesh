import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"category name can't be empty"]
    },
    status:{
        type:String,
        enum:{
            values:["enable","disable"],
            message:'status should only be enable or disable'
        },
        default:"enable"
    },
    description:{
        type:String,
    },
    categoryImage:{
        type:String,
        required:[true,"add a category image"]
    }
})

const Category = mongoose.model("category",categoryModel);
export default Category;