import { Router } from "express"
import { registerUser,loginUser, logoutUser, generatenewToken, changePassword } from "../controllers/user.contoller.js";
import { upload } from "../middleweres/Multer.middleware.js";
import { verifyJWT } from "../middleweres/auth.middleware.js";


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

router.route("/login").post(loginUser)

// here just like we are doing jate jate user ki info lekejana login karne ke liye waise hi hum verifyJWT middleware use karenge for authentication
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/new-tokens").post(generatenewToken)
router.route("/changePassword").post(verifyJWT,changePassword)

export default router