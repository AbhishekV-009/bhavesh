import express from "express";
import multerFunction from "../utils/multerFunction";
import { deleteSubCategory, getAllSubCategory, getSubCategoryById, postSubCategory, updateSubCategory} from "../controller/subCategory.controller";
const subCategoryRouter = express.Router();

subCategoryRouter.get('/',getAllSubCategory);
subCategoryRouter.get('/:id',getSubCategoryById);

subCategoryRouter.post('/add-subCategory',multerFunction('./images/sub-category').single('subCategoryImage'),postSubCategory)
subCategoryRouter.patch('/update-subCategory/:id',multerFunction('./images/sub-category').single('subCategoryImage'),updateSubCategory)

subCategoryRouter.delete('/delete-subCategory/:id',deleteSubCategory)

export default subCategoryRouter;