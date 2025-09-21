import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path:"./env"  // we use env here because we have our env file in root directory through this we can access our env file and we do this becuse when first server start env reach to every where 
})

connectDB()