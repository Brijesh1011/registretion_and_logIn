import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectiondb=async()=>{
    try {
       const ci =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`Mongo db connected DB_Host:${ci.connection.host}`);
    } catch (error) {
        console.log("mongo connection fail",error)
        process.exit(1)
    }
}
export default connectiondb