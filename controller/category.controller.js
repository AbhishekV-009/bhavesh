import Category from "../model/category.model"
import fs from "fs";
import { catchAsync } from "../utils/catchAsync";

export const getAllCategory = catchAsync(async (req, res) => {
    const allCategory = await Category.find();
    return res.status(200).json({
        status: "success",
        total: allCategory.length,
        images: `http://localhost:8000/images/category/{imageName}`,
        data: {
            category: allCategory
        }
    })
})


export const getCategoryById = catchAsync(async (req, res) => {
    const allCategory = await Category.findById(req.params.id);
    return res.status(200).json({
        status: "success",
        data: {
            category: allCategory
        }
    })
})

export const postCategory = catchAsync(async (req, res) => {
    if (!req.body) throw new Error('plz provide information')
    const allCategory = await Category.create({ ...req.body, categoryImage: req.file.filename });
    return res.status(201).json({
        status: "success",
        data: {
            category: allCategory
        }
    })
})

export const updateCategory = catchAsync(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error("category doesn't exits");
    let cateImage = category.categoryImage;
    if (req.file) {
        if (fs.existsSync(`./images/category/${cateImage}`)) {
            fs.unlinkSync(`./images/category/${cateImage}`);
        }
        cateImage = req.file.filename;
    }
    const updateCate = await Category.updateOne({ _id: req.params.id }, {
        $set: {
            ...req.body,
            categoryImage: cateImage
        }
    },{
        new:true,
        runValidators:true
    })
    return res.status(200).json({
        status: "updated",
        category: updateCate
    })
})

export const deleteCategory = catchAsync(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error("category doesn't exits");
    const delcate = await Category.deleteOne({ _id: req.params.id });
    if (delcate.acknowledged) {
        if (fs.existsSync(`./images/category/${category.categoryImage}`)) {
            fs.unlinkSync(`./images/category/${category.categoryImage}`);
        }
    }
    return res.status(200).json({
        status: "deleted",
        category: delcate
    })
})