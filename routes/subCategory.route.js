import express from "express";
import multerFunction from "../utils/multerFunction";
import { deleteSubCategory, getAllSubCategory, getSubCategoryById, postSubCategory, updateSubCategory} from "../controller/subCategory.controller";
import { authorized, protect } from "../middleware/middleware";
const subCategoryRouter = express.Router();

subCategoryRouter.get('/',protect,getAllSubCategory);
subCategoryRouter.get('/:id',protect,getSubCategoryById);

subCategoryRouter.post('/add-subCategory',protect,authorized,multerFunction('./images/sub-category').single('subCategoryImage'),postSubCategory)
subCategoryRouter.patch('/update-subCategory/:id',protect,authorized,multerFunction('./images/sub-category').single('subCategoryImage'),updateSubCategory)

subCategoryRouter.delete('/delete-subCategory/:id',protect,authorized,deleteSubCategory)

export default subCategoryRouter;