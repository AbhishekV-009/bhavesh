import mongoose from "mongoose";
import cartModel from "../model/cart.model";
import Order from "../model/order.model";
import { catchAsync } from "../utils/catchAsync";

export const getOrder = catchAsync(async (req, res) => {
    const {id} = req.user;
    const order = await Order.aggregate([
        {
            $match:{userID:new mongoose.Types.ObjectId(id)}
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
            $unwind:"$product"
        },
        {
            $unwind:"$product.colorAndSize"
        },
        {
            $unwind:"$product.colorAndSize.sizeAndQuantity"
        },
        {
            $match:{
                $and:[
                    {$expr:{$eq:["$product.colorAndSize._id","$colorID"]}},
                    {$expr:{$eq:["$product.colorAndSize.sizeAndQuantity._id","$sizeID"]}}
                ]
            }
        },
        {
            $project:{
                product:{
                    description:0,
                    shortDescription:0,
                    categoryID:0,
                    subCategoryID:0,
                    status:0,
                    createdAt:0,
                    __v:0
                },
                __v:0
            }
        }
    ])
    return res.status(200).json({
        status: "success",
        length: order.length,
        data: {
            order
        }
    })
})

export const allOrder = catchAsync(async (req, res) => {
    const order = await Order.aggregate([
        {
            $lookup: {
                from: "products",
                foreignField: "_id",
                localField: "productID",
                as: "product"
            }
        },
        {
            $unwind:"$product"
        },
        {
            $unwind:"$product.colorAndSize"
        },
        {
            $unwind:"$product.colorAndSize.sizeAndQuantity"
        },
        {
            $match:{
                $and:[
                    {$expr:{$eq:["$product.colorAndSize._id","$colorID"]}},
                    {$expr:{$eq:["$product.colorAndSize.sizeAndQuantity._id","$sizeID"]}}
                ]
            }
        },
        {
            $project:{
                product:{
                    description:0,
                    shortDescription:0,
                    categoryID:0,
                    subCategoryID:0,
                    status:0,
                    createdAt:0,
                    __v:0
                },
                __v:0
            }
        }
    ])
    return res.status(200).json({
        status: "success",
        length: order.length,
        data: {
            order
        }
    })
})

export const addSingleOrder = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { productID, colorID, sizeID } = req.body
    const postOrder = await Order.create({
        userID: id,
        productID: productID,
        colorID: colorID,
        sizeID: sizeID
    })
    return res.status(201).json({
        status: "created",
        data: {
            order: postOrder
        }
    })
})


export const addCartOrder = catchAsync(async (req, res) => {
    const { id } = req.user;
    const cart = await cartModel.find({ userID: id });
    if (cart <= 0) throw new Error("cart is empty");
    const postOrder = await Order.insertMany(cart)
    return res.status(201).json({
        status: "created",
        data: {
            order: postOrder
        }
    })
})