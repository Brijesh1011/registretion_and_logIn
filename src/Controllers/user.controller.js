import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOncloudinary} from "../utils/cloudinary.js"


const generateAccessandRefreshToken=async(userId)=>{
  try {
   const user= await User.findById(userId)
   if (!user) {
    throw new ApiError(404, "User  not found");
    }
    const accessToken= user.generateAccessToken()

    console.log("Access token is this",accessToken)
    const refreshToken= user.generateRefreshToken()

     user.refreshToken=refreshToken
     await user.save({validateBeforeSave:false})
     return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"somthing wrong in genereting token")
  }
}

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

const loginuser=asyncHandler(async (req,res)=>{
          const {username,email,password}=req.body
          if(!(username || email)){
            throw new ApiError(400,"username or email is required")
          }
         const user=await User.findOne({
          $or:[{username},{email}]
         })

         if(!user){
          throw new ApiError(404,"user is not not exist")
         }
         const ispassvalid= await user.isPasswordCorrect(password)
         if(!ispassvalid){
          throw new ApiError(400,"password is not wrong")
         }

        const{accessToken,refreshToken}=  await generateAccessandRefreshToken(user._id)
        
       const loginuser=await User.findById(user._id).select("-password -refreshToken")

       const options={
        httpOnly:true,
        secure:true
       }

       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
        new ApiResponse(
          200,
          {
            user:loginuser,accessToken,refreshToken
          },
          "user Login done"
        )
       )

})

const logoutuser=asyncHandler(async(req,res)=>{

    
   await User.findByIdAndUpdate(
      req.user._id,
      {
        $set:{refreshToken:undefined}

      },
      {
        new:true
      }
    )

    const options={
      httpOnly:true,
      secure:true
     }
     return res
     .status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"logout Done successfully"))

})

export {registrerUser,loginuser,logoutuser}