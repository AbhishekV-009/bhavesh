import express from "express";
import { addOrder, allOrder, deleteOrder, getOrder } from "../controller/order.controller";
import { authorized, protect } from "../controller/auth.controller";
const orderRouter = express.Router();

orderRouter.get("/",protect,getOrder)
orderRouter.get("/allOrder",protect,authorized,allOrder)


orderRouter.post("/add-order",protect,addOrder)
orderRouter.delete("/delete-order/:id",protect,deleteOrder)


export default orderRouter;