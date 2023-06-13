import userModel from "../model/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"


export const signUp = async (req, res) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, contact, email, password } = req.body
        const userExist = await userModel.findOne({ email: email })
        if (userExist) {
            res.status(200).json({
                message: "user already exist"
            })
        }
        const encryptPassword = await bcrypt.hash(password, 10)
        const newUser = new userModel({
            ...req.body,
            password: encryptPassword
        })
        await newUser.save()
        const token = jwt.sign({ id: newUser.id }, process.env.SECRET_WEB_TOKEN, {
            expiresIn: "90d"
        });
        if (newUser) {
            res.status(200).json({
                status: "sign up successfully",
                token: token,
                data: {
                    newUser
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}



export const logIn = async (req, res) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            // Return validation errors
            return res.status(400).json({ errors: errors.array()[0].msg });
        }
        const { email, password } = req.body
        const existUser = await userModel.findOne({ email: email })
        const pass = await bcrypt.compare(password, existUser.password)

        if(!email || !password){
            throw new Error("invalid email or password")
        }

        if (!existUser || !pass) {
            throw new Error("invalid email or password")
        }
        const token = jwt.sign({ id: existUser.id }, process.env.SECRET_WEB_TOKEN, {
            expiresIn: "90d"
        });

        return res.status(201).json({
            token,
            message: "login successful"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

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
            throw new Error("this user has no rigth")
        }
        next();
    } catch (error) {
        return res.status(400).json({
            status:"failed",
            message: error.message
        })
    }
}