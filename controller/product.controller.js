import Product from '../model/product.model'
import { catchAsync } from '../utils/catchAsync'
import fs from "fs";
import mongoose from 'mongoose';

export const getAllProduct = catchAsync(async (req, res) => {
    let page = req.query.page || 1;
    let limit = req.query.limit || 100;
    let sortBy = "-createdAt";
    let matchStage = {}
    //search related to name,category name and sub Category name
    if(req.query.price){
        let price = JSON.parse(JSON.stringify({...req.query.price}).replace(/\b(gte|lte|gt|lt)\b/g,(match)=> `$${match}`))
        for(let i in price){
            price[i] = Number(price[i])
        }
        matchStage["price"] = price
    }

    if(req.query.category) matchStage["categoryID._id"] = new mongoose.Types.ObjectId(req.query.category);
    if(req.query.subCategory) matchStage["subCategoryID._id"] = new mongoose.Types.ObjectId(req.query.subCategory);
    if(req.query.color) matchStage["colorAndSize.colorName"] = req.query.color;
    if(req.query.size) matchStage["colorAndSize.sizeAndQuantity.size"] = req.query.size


    if (req.query.q) {
        let search = req.query.q
        matchStage.$or = [
            { name: { $regex: new RegExp(`.*${search}*.`), $options: "i" } },
            { "categoryID.name": { $regex: new RegExp(`.*${search}*.`), $options: "i" } },
            { "subCategoryID.name": { $regex: new RegExp(`.*${search}*.`), $options: "i" } },
        ]
    }

    if(req.query.sortBy){
        sortBy = sortBy.split(',').join(" ");
    }

    console.log(matchStage)

    const allProduct = await Product.aggregate([
        {
            $lookup: {
                from: "categories",
                foreignField: "_id",
                localField: "categoryID",
                as: "categoryID"
            }
        },
        {
            $lookup: {
                from: "subcategories",
                foreignField: "_id",
                localField: "subCategoryID",
                as: "subCategoryID"
            }
        },
        {
            $unwind: "$categoryID"
        },
        {
            $unwind: "$subCategoryID"
        },
        {
            $unwind: "$colorAndSize"
        },
        {
            $unwind: "$colorAndSize.sizeAndQuantity"
        },
        {
            $match: matchStage
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        },
        {
            $project: {
                categoryID: {
                    status: 0,
                    description: 0,
                    __v: 0
                },
                subCategoryID: {
                    category: 0,
                    status: 0,
                    description: 0,
                    __v: 0
                },
                __v: 0
            }
        }
    ]).sort(sortBy);
    res.status(200).json({
        status: "success",
        length: allProduct.length,
        allProduct
    })
})
export const getProduct = catchAsync(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    res.status(200).json({
        status: "success",
        product
    })
})


export const addProduct = catchAsync(async (req, res) => {
    const { name, price, status, shortDescription, description, stockStatus, categoryID, subCategoryID } = req.body
    const addProduct = await Product.create({
        name: name,
        price: price,
        status: status,
        shortDescription: shortDescription,
        description: description,
        categoryID: categoryID,
        subCategoryID: subCategoryID,
        stockStatus: stockStatus
    });
    res.status(200).json({
        status: "success",
        message: "Product Added",
        addProduct
    })
})
export const addColor = catchAsync(async (req, res) => {
    const { colorName } = req.body
    const colorImage = req.files.map((e) => e.filename)
    const addcolor = await Product.updateOne({ _id: req.params.productID }, {
        $push: {
            colorAndSize: {
                colorName: colorName,
                colorImage: colorImage
            }
        }
    });
    res.status(200).json({
        status: "success",
        message: "color Added",
        addcolor
    })
})
export const addSizeAndQuantity = catchAsync(async (req, res) => {
    let { size, price, quantity } = req.body;
    const { productID, sizeAndQuantityID } = req.params;
    const product = await Product.findOne({ _id: productID, "colorAndSize._id": sizeAndQuantityID })
    if (!price) price = product.price
    const addSizeAndQuantity = await Product.updateOne({ _id: productID, "colorAndSize._id": sizeAndQuantityID }, {
        $push: {
            "colorAndSize.$[e].sizeAndQuantity": {
                size: size,
                price: price,
                quantity: quantity
            }
        }
    },
        {
            arrayFilters: [{ "e._id": sizeAndQuantityID }]
        });
    res.status(200).json({
        status: "success",
        message: "size added",
        addSizeAndQuantity
    })
})


export const updateProduct = catchAsync(async (req, res) => {
    const { id } = req.params
    const { name, price, status, shortDescription, description, stockStatus, categoryID, subCategoryID } = req.body
    const updateProduct = await Product.updateOne({ _id: id }, {
        $set: {
            name: name,
            price: price,
            status: status,
            shortDescription: shortDescription,
            description: description,
            categoryID: categoryID,
            subCategoryID: subCategoryID,
            stockStatus: stockStatus
        }
    });
    res.status(200).json({
        status: "success",
        updateProduct
    })
})
export const updateColor = catchAsync(async (req, res) => {
    const { productID, id } = req.params
    const { colorName } = req.body;
    const { imageName } = req.query

    if (req.file && imageName) {
        if (fs.existsSync(`./images/colorImage/${imageName}`)) {
            fs.unlinkSync(`./images/colorImage/${imageName}`)
            const updateColor = await Product.updateOne({ _id: productID, "colorAndSize.colorImage": imageName }, {
                $set: {
                    "colorAndSize.$[e].colorName": colorName,
                    "colorAndSize.$[e].colorImage.$[e2]": req.file.filename
                }
            },
                {
                    arrayFilters: [{ "e._id": id }, { e2: imageName }]
                }
            );
            return res.status(200).json({
                status: "success",
                message: "color image updated",
                updateColor
            })
        }

    }
    const updateColor = await Product.updateOne({ _id: productID, "colorAndSize._id": id }, {
        $set: {
            "colorAndSize.$.colorName": colorName,
        }
    });
    return res.status(200).json({
        status: "success",
        message: "color updated",
        updateColor
    })
})
export const updateSizeAndQuantity = catchAsync(async (req, res) => {
    const { productID, sizeAndQuantityID } = req.params
    const { size, price, quantity } = req.body

    const updateSizeAndQuantity = await Product.updateOne({ _id: productID, "colorAndSize.sizeAndQuantity._id": sizeAndQuantityID }, {
        $set: {
            "colorAndSize.$.sizeAndQuantity.$[e].size": size,
            "colorAndSize.$.sizeAndQuantity.$[e].price": price,
            "colorAndSize.$.sizeAndQuantity.$[e].quantity": quantity
        }
    },
        {
            arrayFilters: [{ "e._id": sizeAndQuantityID }]
        });
    return res.status(200).json({
        status: "success",
        updateSizeAndQuantity
    })
})


export const deleteProduct = catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!product) throw new Error("product does not exists")

    const deleteProduct = await Product.deleteOne({ _id: id });
    product.colorAndSize.forEach(({ colorImage }) => colorImage.map((e) => {
        if (fs.existsSync(`./images/colorImage/${e}`)) {
            fs.unlinkSync(`./images/colorImage/${e}`)
        }
    }))
    return res.status(200).json({
        status: "success",
        deleteProduct
    })
})
export const deleteColor = catchAsync(async (req, res) => {
    const { productID, id } = req.params;
    const productColor = await Product.findOne({ _id: productID, 'colorAndSize._id': id });
    if (!productColor) throw new Error('product does not exits')

    const deleteCol = await Product.updateOne({ _id: productID, 'colorAndSize._id': id }, {
        $pull: {
            "colorAndSize": { _id: { $eq: id } }
        }
    })

    if (deleteCol.acknowledged && deleteCol.modifiedCount > 0) {
        productColor.colorAndSize.filter((e) => e._id == id)
            .map((e) => e.colorImage.map((e) => fs.unlinkSync(`./images/colorImage/${e}`)))
    }

    return res.status(200).json({
        status: 'success',
        message: "color deleted",
        deleteCol
    })
})
export const deleteSizeAndQuantity = catchAsync(async (req, res) => {
    const { productID, sizeAndQuantityID } = req.params;
    const deleteSizeAndQuantity = await Product.updateOne({ _id: productID, "colorAndSize.sizeAndQuantity._id": sizeAndQuantityID }, {
        $pull: {
            'colorAndSize.$.sizeAndQuantity': { _id: { $eq: sizeAndQuantityID } }
        }
    });
    return res.status(200).json({
        status: "success",
        message: "size deleted",
        deleteSizeAndQuantity
    })
})
