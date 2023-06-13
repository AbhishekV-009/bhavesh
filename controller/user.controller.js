import userModel from "../model/user.model";
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"

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


