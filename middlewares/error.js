import ErrorHandler from "../utils/errorHandlerClass.js"

export const errorHandler=(err,req,res,next)=>{


    const statusCode=err.statusCode || 500

    res.status(statusCode).json({
        success:err?false:true,
        msg:err.message ||"Internal server error",
        stack:process.env.NODE_ENV ==='production'?null:err?.stack,
    })


}

export const notFound=(req,res,next)=>{
    res.status(404).json({
        success:false,
        message:`Not Found ${req?.originalUrl}`
    })
}

