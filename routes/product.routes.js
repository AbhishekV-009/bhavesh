import express from 'express';
import multerFuntion from '../utils/multerFunction'
import { getAllProduct, addProduct, updateProduct, getProduct, addColor, addSizeAndQuantity, updateColor, updateSizeAndQuantity, deleteProduct, deleteColor, deleteSizeAndQuantity } from '../controller/product.controller';
const productRouter = express.Router();

productRouter.route('/')
    .get(getAllProduct)
    .post(addProduct)
productRouter.route('/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct)

productRouter.route('/color/:productID')
    .post(multerFuntion('./images/colorImage').array('colorImage', 3), addColor)

productRouter.route('/color/:productID/:id')
    .patch(multerFuntion('./images/colorImage').single('colorImage'), updateColor)
    .delete(deleteColor)

productRouter.route('/size/:productID/:sizeAndQuantityID')
    .post(addSizeAndQuantity)
    .patch(updateSizeAndQuantity)
    .delete(deleteSizeAndQuantity)

export default productRouter;