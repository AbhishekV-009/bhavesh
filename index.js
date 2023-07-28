import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import categoryRouter from "./routes/category.route";
import subCategoryRouter from "./routes/subCategory.route";
import userRouter from "./routes/user.route"
import orderRouter from "./routes/order.route";
import addressRouter from "./routes/address.route";
import cartRoute from "./routes/cart.route";
import productRouter from "./routes/product.routes";
dotenv.config();

const app = express();
const port = process.env.PORT || 8001

var corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))

mongoose.connect(process.env.DATABASE)
    .then(()=>console.log(`database is connected`))
    .catch(()=>console.log(`something got wrong`))

app.use(express.json());
app.use(express.static(__dirname));

app.use("/user",userRouter)
app.use("/address",addressRouter)

app.use("/category",categoryRouter);
app.use("/subCategory",subCategoryRouter);

app.use('/product',productRouter)

app.use("/cart",cartRoute)
app.use("/order",orderRouter)


app.listen(port,()=>{
    console.log(`app is listening at ${port} port`)
})