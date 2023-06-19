import mongoose from "mongoose";

const categoryModel = new mongoose.Schema({
    categoryName:{
        type:String,
        required:[true,"category name can't be empty"]
    },
    categoryStatus:{
        type:String,
        enum:{
            values:["enable","disable"],
            message:'status should only be enable or disable'
        },
        default:"enable"
    },
    categoryDescription:{
        type:String,
    },
    categoryImage:{
        type:String,
        required:[true,"add a category image"]
    },
})

const Category = mongoose.model("category",categoryModel);
export default Category;