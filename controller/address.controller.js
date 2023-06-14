import userModel from "../model/user.model";

export const addAddress = async (req, res) => {
    try {
        const { id, address: userAddress } = req.user;
        const addressAdd = await userModel.updateOne({ _id: id }, { $set: { address: req.body } })
        return res.status(200).json({
            status: "success",
            message: "address has been added",
            address: addressAdd
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

export const updateAddress = async (req, res) => {
    try {
        const { id, address } = req.user;
        const addressUpt = await userModel.updateOne({ _id: id }, { $set: { address: { ...address, ...req.body } } })
        return res.status(200).json({
            address: addressUpt
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.user;
        const addressDel = await userModel.updateOne({ _id: id }, {
            $set: {
                address: {}
            }
        })
        return res.status(200).json({
            address: addressDel
        })
    } catch (error) {
        return res.status(400).json({
            status: "failed",
            message: error.message
        })
    }
}