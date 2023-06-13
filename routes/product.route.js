import express from "express";
import { deleteProduct, deleteProductImage, getAllProduct, getProductById, postProduct, updateProduct } from "../controller/product.controller";
import multerFunction from "../utils/multerFunction";
import { authorized, protect } from "../controller/auth.controller";
const productRouter = express.Router();

productRouter.get('/',protect,getAllProduct)

productRouter.get('/:id',protect,getProductById)

productRouter.post('/add-product',multerFunction('./images/product').array('productImage',3),protect,authorized,postProduct)

productRouter.patch('/update-product/:id',multerFunction('./images/product').array('productImage',3),protect,authorized,updateProduct)

productRouter.delete('/delete-product/:id',protect,authorized,deleteProduct)

productRouter.delete('/delete-productImage/:id/:imageName',protect,authorized,deleteProductImage)

export default productRouter