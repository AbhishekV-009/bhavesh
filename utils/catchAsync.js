export const catchAsync = (fn)=>{
    return async (req,res,next)=>{
        try {
            await fn(req,res,next);
        } catch (error) {
            return res.status(400).json({
                status:"api failed",
                message:error.message
            })
        }
    }
}