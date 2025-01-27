import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:  process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOncloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null

       const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        // console.log("file is upload on cloudinary",response.url)
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) //remove file local
        return null
    }
}

export {uploadOncloudinary}

