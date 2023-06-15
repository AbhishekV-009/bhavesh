import express from "express";
import { deleteCategory, getAllCategory, getCategoryById, postCategory, updateCategory } from "../controller/category.controller";
import multerFunction from "../utils/multerFunction";
import { authorized, protect } from "../middleware/middleware";

const categoryRouter = express.Router();

categoryRouter.get('/',protect,getAllCategory);
categoryRouter.get('/:id',protect,getCategoryById);

categoryRouter.post('/add-category',protect,authorized,multerFunction('./images/category').single('categoryImage'),postCategory)
categoryRouter.patch('/update-category/:id',protect,authorized,multerFunction('./images/category').single('categoryImage'),updateCategory)

categoryRouter.delete('/delete-category/:id',protect,authorized,deleteCategory)

export default categoryRouter;