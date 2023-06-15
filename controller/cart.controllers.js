import mongoose from "mongoose";
import cartModel from "../model/cart.model";
import productModel from "../model/product.model";

export const addToCart = async (req, res) => {
    try {
        const { id } = req.user;
        const { productId } = req.body
        const product = await productModel.findOne({ _id: productId })
        const exist = await cartModel.findOne({ userId: id, productId: productId })
        if (exist) {
            if (exist.quantity < 10 && exist.quantity >= 1) {

                const updateQty = await cartModel.updateOne({ _id: exist._id }, {
                    $set: {
                        quantity: exist.quantity + 1
                    }
                })
                if (updateQty) {
                    return res.status(200).json({
                        message: "quantity updated"
                    })
                } else {
                    return res.status(200).json({
                        message: "cannot update quantity"
                    })
                }
            } else {
                return res.status(200).json({
                    message: "limit exceed"
                })
            }
        }


        const addData = await cartModel.create({
            userId: id,
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.productImage
        })
        if (addData) {
            return res.status(201).json({
                data: addData,
                message: "added to cart"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getCart = async (req, res) => {
    try {
        const { id } = req.user
        const cartData = await cartModel.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: '_id',
                    as: "userId"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: '_id',
                    as: "productId"
                }
            },
            {
                $unwind: "$userId"
            },
            {
                $unwind: "$productId"
            },
            {
                $project: {
                    "userId.contact": 0,
                    "userId.password": 0,
                    "userId.role": 0,
                    "userId.createdAt": 0,
                    "userId.__v": 0,
                    "productId.name": 0,
                    "productId.price": 0,
                    "productId.status": 0,
                    "productId.stockStatus": 0,
                    "productId.quantity": 0,
                    "productId.category": 0,
                    "productId.subCategory": 0,
                    "productId.productImage": 0,
                    "productId.__v": 0,
                    "__v": 0
                }
            }
        ])
        if (cartData) {
            return res.status(201).json({
                data: cartData,
                message: "Cart"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getAllCart = async (req, res) => {
    try {
        const cartData = await cartModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: '_id',
                    as: "userId"
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: '_id',
                    as: "productId"
                }
            },
            {
                $unwind: "$userId"
            },
            {
                $unwind: "$productId"
            },
            {
                $project: {
                    "userId.contact": 0,
                    "userId.password": 0,
                    "userId.role": 0,
                    "userId.createdAt": 0,
                    "userId.__v": 0,
                    "productId.name": 0,
                    "productId.price": 0,
                    "productId.status": 0,
                    "productId.stockStatus": 0,
                    "productId.quantity": 0,
                    "productId.category": 0,
                    "productId.subCategory": 0,
                    "productId.productImage": 0,
                    "productId.__v": 0,
                    "__v": 0
                }
            }
        ])
        if (cartData) {
            return res.status(201).json({
                message: "all Cart",
                length: cartData.length,
                data: cartData,
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const updateCart = async (req, res) => {
    try {
        const { status, cartID } = req.params;
        const cart = await cartModel.findOne({ _id: cartID, userId: req.user.id });
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
    } catch (error) {
        return res.status(500).json({
            status: "error",
            messgae: error.message
        })
    }
}

export const delCart = async (req, res) => {
    try {
        const id = req.params.id
        const delData = await cartModel.deleteOne({ _id: id, userId: req.user.id })
        if (delData.deletedCount<=0) throw new Error("can't find items")
        return res.status(201).json({
            message: "Item deleted",
            delData
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}