import cartModel from "../model/cart.model";
import Order from "../model/order.model";
import Product from "../model/product.model";

export const getOrder = async (req, res) => {
    try {
        const order = await Order.find({ userID: req.user.id })
        return res.status(200).json({
            status: "success",
            data: {
                order
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

export const allOrder = async (req, res) => {
    try {
        const order = await Order.find();
        return res.status(200).json({
            status: "success",
            data: {
                order
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

export const addSingleOrder = async (req, res) => {
    try {
        const { id, address } = req.user;
        const { productID } = req.body
        const product = await Product.findById(productID);
        if (!product) throw new Error("product is not exits");
        const postOrder = await Order.create({
            ...req.body,
            userID: id,
            userBillingAddress: address
        })
        return res.status(201).json({
            status: "created",
            data: {
                order: postOrder
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}


export const addCartOrder = async (req, res) => {
    try {
        const { id, address } = req.user;
        const cart = await cartModel.find({ userId: id });
        if (cart<=0) throw new Error("cart is empty");
        const postOrder = await Order.create({
            userID:id,
            productID:cart.map(e => e.productId),
            userBillingAddress:address
        })
        return res.status(201).json({
            status: "created",
            data: {
                order: postOrder
            }
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}