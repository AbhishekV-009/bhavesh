import cartModel from "../model/cart.model";
import productModel from "../model/product.model";

export const addToCart = async(req, res) => {
    try {
        const { userId, productId } = req.body
        const product = await productModel.findOne({ _id: productId })
        const exist = await cartModel.findOne({ userId: userId, productId: productId })
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
            userId: userId,
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image
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

export const getCart = async(req, res) => {
    try {
        const cartData = await cartModel.find()
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

export const delCart = async(req, res) => {
    try {
        const id = req.params.id
        const delData = await cartModel.deleteOne({ _id: id })
        if (delData) {
            return res.status(201).json({
                message: "Item deleted"
            })
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}