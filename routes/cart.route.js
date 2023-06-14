import express from "express"
import { addToCart, delCart, getAllCart, getCart, updateCart } from "../Controller/cart.controllers"
import { authorized, protect } from "../middleware/middleware";

const route=express.Router()

route.get("/getCart",protect,getCart)
route.post("/addToCart",protect,addToCart)
route.delete("/delCart/:id",protect,delCart)
route.patch("/updCart-quantity/:cartID/:status",protect,updateCart)

route.get("/allCart",protect,authorized,getAllCart)

export default route