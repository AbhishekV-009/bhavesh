import express from "express";
import { deleteCategory, getAllCategory, getCategoryById, postCategory, updateCategory } from "../controller/category.controller";
import multerFunction from "../utils/multerFunction";
const categoryRouter = express.Router();

categoryRouter.get('/',getAllCategory);
categoryRouter.get('/:id',getCategoryById);

categoryRouter.post('/add-category',multerFunction('./images/category').single('categoryImage'),postCategory)
categoryRouter.patch('/update-category/:id',multerFunction('./images/category').single('categoryImage'),updateCategory)

categoryRouter.delete('/delete-category/:id',deleteCategory)

export default categoryRouter;