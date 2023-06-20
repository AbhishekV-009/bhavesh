import Product from "../model/product.model"
import mongoose from "mongoose";
import fs from 'fs';

export const getAllProduct = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 100;
        const page = Number(req.query.page) || 1;
        const sortByPrice = Number(req.query.sortPrice) || 1;

        const matchStage = {
            $match: {}
        }
        // price gte lte
        let queryCopy = { ...req.query }
        queryCopy = JSON.parse(JSON.stringify(queryCopy).replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`));
        for (let i in queryCopy.price) {
            queryCopy.price[i] = Number(queryCopy.price[i]);
        }
        if (req.query.price) {
            matchStage.$match.price = queryCopy.price
        }

        //get prroduct by category
        if (req.query.category) {
            matchStage.$match = {...matchStage.$match,"category._id":new mongoose.Types.ObjectId(req.query.category)}
        }

        //get prroduct by subCategory
        if (req.query.subCategory) {
            matchStage.$match = {...matchStage.$match,"subCategory._id":new mongoose.Types.ObjectId(req.query.subCategory)}
        }

        // search by name category_name and subCategory_name
        if (req.query.q) {
            const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
            const searchRgx = rgx(req.query.q);
            matchStage.$match.$or = [
                { name: { $regex: searchRgx, $options: "i" } },
                { "category.name": { $regex: searchRgx, $options: "i" } },
                { "subCategory.name": { $regex: searchRgx, $options: "i" } },
            ]
        }

        const product = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $unwind: "$subCategory"
            },
            {
                $project: {
                    "__v": 0,
                    "category.__v": 0,
                    "subCategory.__v": 0
                }
            },
            matchStage,
            {
                $sort: { price: sortByPrice }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        return res.status(200).json({
            status: "success",
            total: product.length,
            images: `http://localhost:8000/images/product/{imageName}`,
            data: {
                product
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $unwind: "$subCategory"
            },
            {
                $project: {
                    "__v": 0,
                    "category.__v": 0,
                    "subCategory.__v": 0
                }
            }
        ]);
        return res.status(201).json({
            status: "success",
            product
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const postProduct = async (req, res) => {
    try {
        const productImg = req.files.map((e) => e.filename);
        const addProduct = await Product.create({
            ...req.body,
            productImage: productImg
        })
        return res.status(200).json({
            status: "success",
            product: addProduct
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        if (!product) throw new Error("product doesn't exits");
        let productImg = product.productImage
        if (req.files) {
            let img = req.files.map((e) => e.filename);
            productImg = [...productImg, ...img];
        }
        const updateProd = await Product.updateOne({ _id: id }, {
            $set: { ...req.body, productImage: productImg }
        },
            {
                new: true,
                runValidators: true
            })
        return res.status(200).json({
            status: "success",
            updateProd
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) throw new Error("product doesn't exits");
        const delProduct = await Product.deleteOne({ _id: id })
        if (delProduct.acknowledged) {
            product.productImage.forEach((e) => {
                if (fs.existsSync(`./images/product/${e}`)) {
                    fs.unlinkSync(`./images/product/${e}`)
                }
            })
        }
        return res.status(200).json({
            status: "success",
            product: delProduct
        })
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const deleteProductImage = async (req, res) => {
    try {
        const { id, imageName } = req.params;
        const product = await Product.findById(id);
        if (!product) throw new Error("product doesn't exits");
        if (fs.existsSync(`./images/product/${imageName}`)) {
            const newProductImage = product.productImage.filter((e) => e !== imageName);
            const updateImage = await Product.updateOne({ _id: id }, { $set: { productImage: newProductImage } });
            if (updateImage.acknowledged) {
                fs.unlinkSync(`./images/product/${imageName}`)
            }
            return res.status(200).json({
                status: "success",
                updateImage
            })
        } else {
            throw new Error('image are deleted already')
        }
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}