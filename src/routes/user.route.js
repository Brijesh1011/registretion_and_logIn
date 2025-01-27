import { Router } from "express";
import { loginuser, logoutuser, registrerUser } from "../Controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router=Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    ,registrerUser)
   
    router.route("/login").post(loginuser)
    router.route("/logout").post(verifyJWT, logoutuser)


export default router