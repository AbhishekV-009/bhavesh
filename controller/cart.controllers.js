import cartModel from "../model/cart.model";
import productModel from "../model/product.model";

export const addToCart = async(req, res) => {
    try {
        const {id} = req.user;
        const {productId } = req.body
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

export const getCart = async(req, res) => {
    try {
        const {id} = req.user
        const cartData = await cartModel.find({userId:id})
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

export const getAllCart = async(req, res) => {
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

export const updateCart = async (req, res) => {
    try {
        const { status, cartID } = req.params;
        const cart = await cartModel.findOne({_id:cartID,userId:req.user.id}); 
        if (!cart) throw new Error("not found cart")
        let cartQuantity = cart.quantity;
        if (status === "increment") {
            cartQuantity += 1;
        } else{
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

export const delCart = async(req, res) => {
    try {
        const id = req.params.id
        const delData = await cartModel.deleteOne({ _id: id,userId:req.user.id})
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