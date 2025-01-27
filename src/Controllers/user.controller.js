import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js"

const registrerUser=asyncHandler(async (req,res)=>{

    const {fullName,email,username,password}=req.body
    console.log(email)


 if(
    [fullName,email,username,password].some((fields)=>fields?.trim()==="")
 ) {
      throw new ApiError(400,"All fields are required")
 }
 const existedUser=await User.findOne({
    $or:[{username},{email}]
 })
 if(existedUser){
    throw new ApiError(409,"username or passwprd is already used")
 }

  const avatarLocalpath=req.files?.avatar[0]?.path
//   console.log("avatar localpath :  ",avatarLocalpath)
  const coverImageLocalpath=req.files?.coverImage[0]?.path

  if(!avatarLocalpath){
    throw new ApiError(400,"avatar is required") 
  }
  
  const avatar= await uploadOncloudinary(avatarLocalpath)
//   console.log("avatar on cloudinary......",avatar)
  const coverImage= await uploadOncloudinary(coverImageLocalpath)

  if(!avatar){
    throw new ApiError(400,"avatar is required") 
  }
  const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
  })
  
  const createdUser=await User.findById(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500,"something want wrong while registretion user") 

    }

   return res
   .status(201)
   .json(new ApiResponse(200,createdUser,"user registered done"))

})

export {registrerUser}