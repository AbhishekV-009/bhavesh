import userModel from "../model/user.model";
import { catchAsync } from "../utils/catchAsync";

export const addAddress = catchAsync(async (req, res) => {
    const { id } = req.user;
    const addressAdd = await userModel.updateOne({ _id: id }, {
        $push: { address: req.body },
    })
    return res.status(200).json({
        status: "success",
        message: "address has been added",
        address: addressAdd
    })
})

export const updateAddress = catchAsync(async (req, res) => {
    const { id } = req.user;
    const { street, city, state, country, postalCode } = req.body
    const addressUpt = await userModel.updateOne({ _id: id, "address._id": req.params.id }, {
        $set: {
            "address.$[e].street": street,
            "address.$[e].city": city,
            "address.$[e].state": state,
            "address.$[e].country": country,
            "address.$[e].postalCode": postalCode,
        }
    }, {
        arrayFilters: [{ "e._id": req.params.id }]
    })
    return res.status(200).json({
        status: "success",
        address: addressUpt
    })
})

export const deleteAddress = catchAsync(async (req, res) => {
    const { id } = req.user;
    const addressDel = await userModel.updateOne({ _id: id, "address._id": req.params.id }, {
        $pull: {
            address: {_id:{$eq:req.params.id}}
        }
    })
    return res.status(200).json({
        address: addressDel
    })
})