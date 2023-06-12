import subCategory from "../model/subCategory.model";
import fs from "fs";

export const getAllSubCategory = async (req, res) => {
    try {
        const allSubCategory = await subCategory.aggregate([
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
        const subCategory = await subCategory.findById(req.params.id);
        if (!subCategory) throw new Error("category doesn't exits");
        let subCateImage = subCategory.subCategoryImage;
        if (req.file) {
            if (fs.existsSync(`./images/category/${subCateImage}`)) {
                fs.unlinkSync(`./images/category/${subCateImage}`);
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

export const deleteCategory = async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}