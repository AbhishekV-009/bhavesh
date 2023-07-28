import { catchAsync } from '../utils/catchAsync'
import cartModel from "../model/cart.model";
import mongoose from 'mongoose';

export const getCart = catchAsync(async (req, res) => {
    const { id } = req.user
    const cartData = await cartModel.aggregate([
        {
            $match: { userID: new mongoose.Types.ObjectId(id) }
        },
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productID",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $unwind: "$product.colorAndSize"
        },
        {
            $unwind: "$product.colorAndSize.sizeAndQuantity"
        },
        {
            $match: {
                $and: [
                    { $expr: { $eq: ["$product.colorAndSize._id", "$colorID"] } },
                    { $expr: { $eq: ["$product.colorAndSize.sizeAndQuantity._id", "$sizeID"] } }
                ]
            }
        },
        {
            $project: {
                product: {
                    description: 0,
                    shortDescription: 0,
                    categoryID: 0,
                    subCategoryID: 0,
                    status: 0,
                    createdAt: 0,
                    __v: 0
                },
                __v: 0
            }
        }
    ]);

    return res.status(201).json({
        status: "success",
        data: cartData
    })
})

export const getAllCart = catchAsync(async (req, res) => {
    const cartData = await cartModel.aggregate([
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productID",
                as: "product"
            }
        },
        {
            $unwind: "$product"
        },
        {
            $unwind: "$product.colorAndSize"
        },
        {
            $unwind: "$product.colorAndSize.sizeAndQuantity"
        },
        {
            $match: {
                $and: [
                    { $expr: { $eq: ["$product.colorAndSize._id", "$colorID"] } },
                    { $expr: { $eq: ["$product.colorAndSize.sizeAndQuantity._id", "$sizeID"] } }
                ]
            }
        },
        {
            $project: {
                product: {
                    description: 0,
                    shortDescription: 0,
                    categoryID: 0,
                    subCategoryID: 0,
                    status: 0,
                    createdAt: 0,
                    __v: 0
                },
                __v: 0
            }
        }
    ])
    return res.status(201).json({
        message: "all Cart",
        length: cartData.length,
        data: cartData,
    })
})

export const addToCart = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { productID, colorID, sizeID } = req.body;
    const exist = await cartModel.findOne({ userID: id, productID: productID })
    if (exist) {
        if (exist.quantity < 10 && exist.quantity >= 1) {
            const updateQty = await cartModel.updateOne({ _id: exist._id, userID: id }, {
                $set: {
                    quantity: exist.quantity + 1
                }
            })
            if (updateQty.acknowledged && updateQty.modifiedCount >= 1) {
                return res.status(200).json({
                    message: "quantity updated"
                })
            } else {
                return res.status(200).json({
                    message: "can't update quantity"
                })
            }
        } else {
            return res.status(200).json({
                message: "limit exceed"
            })
        }
    }
    const addCart = await cartModel.create({
        userID: id,
        productID: productID,
        colorID: colorID,
        sizeID: sizeID
    })
    return res.status(201).json({
        status: "success",
        addCart
    })
})

export const updateCart = catchAsync(async (req, res) => {
    const { status, cartID } = req.params;
    const cart = await cartModel.findOne({ _id: cartID, userID: req.user.id });
    if (!cart) throw new Error("not found cart")
    let cartQuantity = cart.quantity;
    if (status === "increment") {
        cartQuantity += 1;
    } else {
        cartQuantity -= 1;
    }

    if (cartQuantity == 0) {
        const delCart = await cartModel.deleteOne({ _id: cart.id });
        if (delCart.acknowledged) {
            return res.status(201).json({
                status: "deleted",
                data: {
                    delCart
                }
            })
        }
    }

    if (cartQuantity > 10) {
        throw new Error("you cannot add more than 10 items")
    }

    const updateQuantity = await cartModel.updateOne({ _id: cart.id }, { $set: { quantity: cartQuantity } })
    if (updateQuantity.acknowledged) {
        return res.status(200).json({
            status: "added to cart",
            data: {
                updateQuantity
            }
        })
    }
})

export const delCart = catchAsync(async (req, res) => {
    const id = req.params.id
    const delData = await cartModel.deleteOne({ _id: id, userID: req.user.id })
    if (delData.deletedCount <= 0) throw new Error("can't find items")
    return res.status(201).json({
        message: "Item deleted",
        delData
    })
})