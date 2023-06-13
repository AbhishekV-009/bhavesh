import express from "express"
import { addToCart, delCart, getCart } from "../Controller/cart.controllers"
import { protect } from "../controller/auth.controller"
const route=express.Router()

route.post("/addToCart",protect,addToCart)
route.get("/getCart",protect,getCart)
route.delete("/delCart/:id",protect,delCart)

export default route