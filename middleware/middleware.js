import jwt from "jsonwebtoken";
import userModel from "../model/user.model";

export const protect = async (req,res,next)=>{
    try {
        const {authorization} = req.headers;
        if(!authorization || !authorization.startsWith("Bearer")){
            throw new Error("please login to access")
        }
        const token = jwt.verify(authorization.split(" ")[1],process.env.SECRET_WEB_TOKEN);
        const user = await userModel.findById(token.id);
        if(!user) throw new Error("user doesn't exits");
        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message: error.message
        })
    }
}

export const authorized = async (req,res,next)=>{
    try {
        const user = req.user;
        if(user.role !== "admin"){
            throw new Error("this user has no Rights")
        }
        next();
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message: error.message
        })
    }
}