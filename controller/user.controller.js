import userModel from "../model/user.model";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Cookies from 'cookies'
import { validationResult } from "express-validator"
import { catchAsync } from "../utils/catchAsync";


export const signUp = catchAsync(async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body
    const userExist = await userModel.findOne({ email: email })
    if (userExist) {
        return res.status(200).json({
            message: "user already exist"
        })
    }
    const encryptPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
        ...req.body,
        password: encryptPassword
    })

    if (!newUser) throw new Error("user can't be added")

    const token = jwt.sign({ id: newUser.id }, process.env.SECRET_WEB_TOKEN, {
        expiresIn: "90d"
    });

    var cookies = new Cookies(req, res)
    cookies.set('create token', token)

    return res.status(200).json({
        status: "sign up successfully",
        token: token,
        data: {
            newUser
        }
    })
})

export const logIn = catchAsync(async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        // Return validation errors
        return res.status(400).json({ errors: errors.array()[0].msg });
    }
    const { email, password } = req.body
    const existUser = await userModel.findOne({ email: email })
    const pass = await bcrypt.compare(password, existUser.password)

    if (!email || !password) {
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
})

export const getUsers = catchAsync(async (req, res) => {
    const allUsers = await userModel.find()
    if (allUsers) {
        res.status(200).json({
            data: allUsers,
            message: "all users"
        })
    }
})

export const delUser = catchAsync(async (req, res) => {
    const delUser = await userModel.deleteOne({ _id: req.params.id })
    if (delUser) {
        res.status(200).json({
            message: "user deleted"
        })
    }
})

export const updUser = catchAsync(async (req, res) => {
    const user = await userModel.findOne({ _id: req.params.id })
    let newpassword = user.password
    if (req.body.password) {
        newpassword = await bcrypt.hash(req.body.password, 10)
    }
    const update = await userModel.updateOne({ _id: req.params.id }, {
        $set: {
            ...req.body,
            password: newpassword
        }
    })
    res.status(200).json({
        message: "user updated",
        updateUser: update
    })
})


