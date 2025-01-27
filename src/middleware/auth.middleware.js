import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";



export const verifyJWT=asyncHandler(async(req,res,next)=>{

   try {
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
 
    if(!token){
     throw new ApiError(401,"Unauthorizes request....")
    }
    // console.log("......... token",token)
   const decoedtoken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//    console.log("Decoded token",decoedtoken)
   const user= await User.findById(decoedtoken?._id).select("-password -refreshToken")
   
   if(!user){
     throw new ApiError(401,"Invalid acccess token")
   }
   req.user=user;
   next()
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token")
   }

})