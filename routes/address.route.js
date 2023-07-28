import express from "express";
import { protect } from "../middleware/middleware";
import { addAddress, deleteAddress, updateAddress } from "../controller/address.controller";
const addressRouter = express.Router();

addressRouter.post("/add-address",protect,addAddress);
addressRouter.patch("/update-address/:id",protect,updateAddress);
addressRouter.delete("/delete-address/:id",protect,deleteAddress);


export default addressRouter;