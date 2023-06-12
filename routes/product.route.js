import express from "express";
import { deleteProduct, deleteProductImage, getAllProduct, getProductById, postProduct, updateProduct } from "../controller/product.controller";
import multerFunction from "../utils/multerFunction";
const productRouter = express.Router();

productRouter.get('/',getAllProduct)
productRouter.get('/:id',getProductById)
productRouter.post('/add-product',multerFunction('./images/product').array('productImage',3),postProduct)
productRouter.patch('/update-product/:id',multerFunction('./images/product').array('productImage',3),updateProduct)
productRouter.delete('/delete-product/:id',deleteProduct)

productRouter.delete('/delete-productImage/:id/:imageName',deleteProductImage)

export default productRouter