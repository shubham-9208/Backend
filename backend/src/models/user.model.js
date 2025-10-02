import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const userShcema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    refreshToken: {
        type: String,
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: 'Vedio'
    }
}, {
    timestamps: true
})

// hash password before saving user
userShcema.pre('save', async function (next) { // pre is a mongoose middleware that runs before saving the document "save" is the event name ita can be save,update,delete etc its a mongoose method
    if (!this.isModified('password')) return next() // this is for if only password is modified then only run isModified is used to check if the field is modified or not it is a mongoose method 
    this.password = await bcrypt.hash(this.password, 10) // 10 is the salt rounds 
    next()
})

// method to compare password
userShcema.methods.isPasswordCorrect= async function (password) { // here we are creating a method to compare password this is an instance method this we created by using methods and inject in userSchema
    return await bcrypt.compare(password, this.password)
}

// method to generate access token
userShcema.methods.generateAccessToken= function(){
    return jwt.sign( // sign is a method of jwt to generate token sign takes 3 arguments payload,secret,expiry in object form
        { // payload is the data we want to store in the token
            _id:this._id,// this came from monogo
            userName:this.userName,
            email:this.email,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userShcema.methods.generateRefressToken=function(){
    return jwt.sign(
        {
            _id:this._id,// this came from monogo
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userShcema)