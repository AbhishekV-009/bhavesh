import express from "express"
import { addToCart, delCart, getAllCart, getCart, updateCart } from "../Controller/cart.controllers"
import { authorized, protect } from "../middleware/middleware";

const route=express.Router()

route.get("/",protect,getCart)
route.post("/add-cart",protect,addToCart)
route.patch("/updCart-quantity/:cartID/:status",protect,updateCart)
route.delete("/delete-cart/:id",protect,delCart)

route.get("/allCart",protect,authorized,getAllCart)

export default route