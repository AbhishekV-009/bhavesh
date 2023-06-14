import express from "express";
import { addCartOrder, addOrder, addSingleOrder, allOrder, deleteOrder, getOrder } from "../controller/order.controller";
import { authorized, protect } from "../middleware/middleware";

const orderRouter = express.Router();

orderRouter.get("/",protect,getOrder)
orderRouter.get("/allOrder",protect,authorized,allOrder)


orderRouter.post("/add-order",protect,addSingleOrder)
orderRouter.post("/cart-order",protect,addCartOrder)



export default orderRouter;