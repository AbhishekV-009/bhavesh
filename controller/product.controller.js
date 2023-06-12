import Product from "../model/product.model"

export const getAllProduct = async (req, res) => {
    try {
        const product = await Product.find();
        return res.status(200).json({
            status: "success",
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
        
        const addProduct = await Product.create({
            ...req.body,
            productImage:req.files.filename
        })
        return res.status(201).json({
            status: "success",
            product:addProduct
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


        return res.status(200).json({
            status: "success",
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

export const updateProduct = async (req, res) => {
    try {


        return res.status(200).json({
            status: "success",
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

export const deleteProduct = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const deleteProductImage = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}