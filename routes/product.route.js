import express from "express";
import { deleteProduct, deleteProductImage, getAllProduct, getProductById, postProduct, updateProduct } from "../controller/product.controller";
import multerFunction from "../utils/multerFunction";
import { authorized, protect } from "../middleware/middleware";
const productRouter = express.Router();

productRouter.get('/',protect,getAllProduct)

productRouter.get('/:id',protect,getProductById)

productRouter.post('/add-product',protect,authorized,multerFunction('./images/product').array('productImage',3),postProduct)

productRouter.patch('/update-product/:id',protect,authorized,multerFunction('./images/product').array('productImage',3),updateProduct)

productRouter.delete('/delete-product/:id',protect,authorized,deleteProduct)

productRouter.delete('/delete-productImage/:id/:imageName',protect,authorized,deleteProductImage)

export default productRouter