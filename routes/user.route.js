import express from "express";
import {
    delUser,
    getUsers,
    logIn,
    signUp, 
    updUser,
} from "../controller/user.controller";
import { body } from "express-validator";
import { authorized, protect } from "../middleware/middleware";
const route = express.Router();

route.post("/signUp", [
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('contact').notEmpty().withMessage('Contact number is required.').isMobilePhone().withMessage('Please enter a valid mobile phone number.'),
    body('email').notEmpty().withMessage('Email is required.').isEmail().withMessage('Please enter a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], signUp);

route.post(
    "/login", [
        body("email").notEmpty().withMessage("Email is required.").isEmail().withMessage("Please enter a valid email address."),
        body("password").notEmpty().withMessage("Password is required.").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    ],logIn);

route.get("/getUsers",protect,authorized,getUsers);
route.delete("/delUser/:id",protect,authorized,delUser);
route.patch("/updUser/:id",protect,authorized,updUser);

export default route;