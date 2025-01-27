import { Router } from "express";
import { registrerUser } from "../Controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

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

export default router