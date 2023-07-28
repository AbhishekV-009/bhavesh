import jwt from "jsonwebtoken";
import userModel from "../model/user.model";
import { catchAsync } from "../utils/catchAsync";

export const protect = catchAsync(async (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization || !authorization.startsWith("Bearer")){
        throw new Error("please login to access")
    }
    const token = jwt.verify(authorization.split(" ")[1],process.env.SECRET_WEB_TOKEN);
    const user = await userModel.findById(token.id);
    if(!user) throw new Error("user doesn't exits");
    req.user = user;
    next();
})

export const authorized = catchAsync(async (req,res,next)=>{
    const user = req.user;
    if(user.role !== "admin"){
        throw new Error("this user has no Rights")
    }
    next();
})