import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js";

dotenv.config({
    path:"./env"  // we use env here because we have our env file in root directory through this we can access our env file and we do this becuse when first server start env reach to every where 
})

connectDB()
.then (()=>{ // abhi tak sirf db connect ho rha hai abhi server start nhi hua to app se listen karke server start karenge db connect hone k bad

    app.on('error',(err)=>{  // phele error ke liye listen karenge
        console.log(`Error in server after connect db : ${err}`)
        throw err;
    })

    app.listen(process.env.port || 8000,()=>{ // yha per se express start hoga db ki connection ke bad
        console.log(`server is running on port ${process.env.port}`);
        
    }) 
})
.catch((err)=>{
    console.log("DB connection failed",err)
})