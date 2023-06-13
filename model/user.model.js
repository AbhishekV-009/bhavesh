import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: "user",
        enum: {
            values: ["user", "admin"],
            message: "role should be user or admin"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

})

export default mongoose.model("user", userModel)