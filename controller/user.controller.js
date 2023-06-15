import userModel from "../model/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Cookies from 'cookies'
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

        var cookies = new Cookies(req, res)
        cookies.set('create token', token)

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

        var cookies = new Cookies(req, res)
        cookies.set('login token', token)

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


export const getUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find()
        if (allUsers) {
            res.status(200).json({
                data: allUsers,
                message: "all users"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const delUser = async (req, res) => {
    try {
        const delUser = await userModel.deleteOne({ _id: req.params.id })
        if (delUser) {
            res.status(200).json({
                message: "user deleted"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

export const updUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id })
        let newpassword = user.password
        if (await req.body.password) {
            newpassword = await bcrypt.hash(req.body.password, 10)
        }
        const update = await userModel.updateOne({ _id: req.params.id }, {
            $set: {
                ...req.body,
                password: newpassword
            }
        })
        if (delUser) {
            res.status(200).json({
                message: "user updated"
            })
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}


