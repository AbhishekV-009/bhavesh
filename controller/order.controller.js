import Order from "../model/order.model";
import Product from "../model/product.model";

export const getOrder = async (req,res)=>{
    try {
        const order = await Order.find({userID:req.user.id})
        return res.status(200).json({
            status:"success",
            data:{
                order
            }
        })
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
}

export const allOrder = async (req,res)=>{
    try {
        const order = await Order.find();
        return res.status(200).json({
            status:"success",
            data:{
                order
            }
        })
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
}

export const addOrder = async (req,res)=>{
    try {
        const {id} = req.user;
        const {productID} = req.body
        const product = await Product.findById(productID);
        if(!product) throw new Error("product is not exits");
        const order = await Order.findOne({userID:id,productID:productID});
        if(order){
            const quantityUpdate = await Order.updateOne({_id:order.id},{$set:{quantity:order.quantity+=1}})
            return res.status(201).json({
                status:"quantity updated",
                quantityUpdate,
            })
        }
        const postOrder = await Order.create({
            userID:id,
            ...req.body
        })
        return res.status(201).json({
            status:"created",
            data:{
                order:postOrder
            }
        }) 
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
} 

export const deleteOrder = async (req,res)=>{
    try {
        const delOrder = await Order.deleteOne({_id:req.params.id,userID:req.user.id})
        return res.status(200).json({
            status:"success",
            delOrder
        })
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
}