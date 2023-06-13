import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import categoryRouter from "./routes/category.route";
import subCategoryRouter from "./routes/subCategory.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";
import userRouter from "./routes/user.route"
dotenv.config();
const app = express();
const port = process.env.PORT || 8001

mongoose.connect(process.env.DATABASE)
    .then(()=>console.log(`database is connected`))
    .catch(()=>console.log(`something got wrong`))

app.use(express.json());
app.use(express.static(__dirname));


app.use("/category",categoryRouter);
app.use("/subCategory",subCategoryRouter);
app.use("/product",productRouter);
app.use('/cart',cartRouter)


app.use("/user",userRouter)


app.listen(port,()=>{
    console.log(`app is listening at ${port} port`)
})