import { Router } from "express"
import { registerUser } from "../controllers/user.contoller.js";
import { upload } from "../middleweres/Multer.middleware.js";

const router = Router()

router.route("/register").post( 
    // this is middleware for file upload with multer before registerUser controller
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

export default router