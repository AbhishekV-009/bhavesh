import express from "express"
import { addToCart, delCart, getAllCart, getCart, updateCart } from "../controller/cart.controllers"
import { authorized, protect } from "../middleware/middleware";

const cartRoute=express.Router()

cartRoute.get("/",protect,getCart)
cartRoute.post("/add-cart",protect,addToCart)
cartRoute.patch("/updCart-quantity/:cartID/:status",protect,updateCart)
cartRoute.delete("/delete-cart/:id",protect,delCart)

cartRoute.get("/allCart",protect,authorized,getAllCart)

export default cartRoute