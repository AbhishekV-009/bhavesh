import subCategory from "../model/subCategory.model";
import mongoose from "mongoose";
import fs from "fs";

export const getAllSubCategory = async (req, res) => {
    try {
        const matchStage = {
            $match:{}
        }

        if(req.query.category){
            matchStage.$match.category = new mongoose.Types.ObjectId(req.query.category);
        }
        const allSubCategory = await subCategory.aggregate([
            matchStage,
            {
                $lookup:{
                    from:"categories",
                    localField:"category",
                    foreignField:"_id",
                    as:"category"
                }
            },
            {
                $unwind:"$category"
            },
            {
                $project:{
                    "__v":0,
                    "category.description":0,
                    "category.categoryImage":0,
                    "category.status":0,
                    "category.__v":0
                }
            }
        ]);
        return res.status(200).json({
            status: "success",
            total: allSubCategory.length,
            images: `http://localhost:8000/images/subCategoryImage/{imageName}`,
            data: {
                subCategory: allSubCategory
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}


export const getSubCategoryById = async (req, res) => {
    try {
        const allSubCategory = await subCategory.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup:{
                    from:"categories",
                    localField:"category",
                    foreignField:"_id",
                    as:"category"
                }
            },
            {
                $unwind:"$category"
            },
            {
                $project:{
                    "__v":0,
                    "category.description":0,
                    "category.categoryImage":0,
                    "category.status":0,
                    "category.__v":0
                }
            }
        ]);
        return res.status(200).json({
            status: "success",
            data: {
                subCategory: allSubCategory
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const postSubCategory = async (req, res) => {
    try {
        if (!req.body) throw new Error('plz provide enter detail')
        const allSubCategory = await subCategory.create({ ...req.body, subCategoryImage: req.file.filename });
        return res.status(201).json({
            status: "success",
            data: {
                SubCategory: allSubCategory
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const updateSubCategory = async (req, res) => {
    try {
        const subCate = await subCategory.findById(req.params.id);
        if (!subCate) throw new Error("sub category doesn't exits");
        let subCateImage = subCate.subCategoryImage;
        if (req.file) {
            if (fs.existsSync(`./images/sub-category/${subCateImage}`)) {
                fs.unlinkSync(`./images/sub-category/${subCateImage}`);
            }
            subCateImage = req.file.filename;
        }
        const updateSubCate = await subCategory.updateOne({ _id: req.params.id }, {
            $set: {
                ...req.body,
                subCategoryImage: subCateImage
            }
        },{
            new:true,
            runValidators:true
        })
        return res.status(200).json({
            status: "updated",
            category: updateSubCate
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deleteSubCategory = async (req, res) => {
    try {
        const subCate = await subCategory.findById(req.params.id);
        if (!subCate) throw new Error("sub category doesn't exits");
        const delSubCate = await subCategory.deleteOne({ _id: req.params.id });
        if (delSubCate.acknowledged) {
            if (fs.existsSync(`./images/sub-category/${subCate.subCategoryImage}`)) {
                fs.unlinkSync(`./images/sub-category/${subCate.subCategoryImage}`);
            }
        }
        return res.status(200).json({
            status: "deleted",
            category: delSubCate
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}