export const catchAsync = (fn)=>{
    return async (req,res)=>{
        try {
            await fn(req,res);
        } catch (error) {
            return res.status(400).json({
                status:"api failed",
                message:error.message
            })
        }
    }
}