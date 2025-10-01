import { asynchandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadImagetoCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asynchandler(async (req, res) => {
   
    // getting data from frontend with req.body
    const { fullName, userName, email, password } = req.body

    // validation of data It returns a boolean (true or false) test if any element matches condition ,
    // map returns a new array with the results
    if ([fullName, userName, email, password].some((filed) => filed?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }

    // check if user already exists :username,email 
    //$or (MongoDB / Mongoose operator) ,|| (JavaScript logical OR operator)
    //Look at documents in the User collection.
    //Return one where either the userName matches OR the email matches.
    const existedUser = await User.findOne({ $or: [{ userName }, { email }] })
    // const existedUser=User.findOne({userName} && {email}) wil not work

    if (existedUser) {
        throw new ApiError(409, "user already exists")
    }

    // take cover imag and avtar upload on cloudinary 
    // here we use multer as a middleware to upload a file middleware here add more filds in req like here we have req.files
    const avatarlocalpath = req.files?.avatar[0]?.path // this is not in cloud this is now in our local we say to multer to save the file in our public avatar is name of our file to take it written in upload files in in user.router


    // here cover image is optional that why this code
    let coverImagelocalpath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagelocalpath = req.files?.coverImage[0]?.path
    }

    // normal check if not then throw error
    if (!avatarlocalpath) {
        throw new ApiError(400, 'avatar img required')
    }

    // upload on cloudinary
    const avatarImg = await uploadImagetoCloudinary(avatarlocalpath)
    const coverImage = await uploadImagetoCloudinary(coverImagelocalpath)

    // await uploadImagetoCloudinary(coverImagelocalpath)
    // console.log('avatar img',avatarImg);

    if (!avatarImg) throw new ApiError(400, 'avatarImg required')

    // created object and send to DB
    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
        avatar: avatarImg.url,
        coverImage: coverImage?.url || '',
    })

    // check user is created in db and checking data from DB then we take response in that we dont want to send this pass and token we can directly undefine in user but from DB is better in select means all select in parameter we have to which we dont want
    const userCreated = await User.findById(user._id).select('-password -refreshToken')

    if (!userCreated) throw new ApiError(500, ' something wrong while registering')

    //returning the response we have already created a response class for statndadized response we can only send one response per request
    return res.status(201).json(
        new ApiResponse(200, userCreated, 'successfully registerd')
    )

})

export { registerUser }


// steps to take register a user
//1. get user data from frontend
//2. validation of data
//3. check if user already exists :username,email
//4. take cover imag and avtar upload on cloudinary
//5. it give a url take it
//6.create user object -> data send to db
//7.check user is created or not
//8.send data to frontend to show dont give then refresh token and password