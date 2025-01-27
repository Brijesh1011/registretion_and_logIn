import  dotenv  from "dotenv";
import connectiondb from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./env'
})

connectiondb()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERRRR: ",error)
        throw error
    })
   app.listen(process.env.PORT || 8000,()=>{
    console.log(`SERVER IS RUNNING on port:${process.env.PORT}`)
   })
})
.catch((err)=>{
    console.log("MONGO DB CONNECTION  FAIL !!",err)
})
