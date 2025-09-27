import mongoose,{Schema}  from "mongoose";
import mongooseaggregatePaginate from "mongoose-aggregate-paginate-v2"

const vedioSchema = new Schema({
    vedioFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    views:{
        type:Number,
        default:0
    },
    duration:{
        type:String,
        required:true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
})

vedioSchema.plugin(mongooseaggregatePaginate) // form now we can use aggregate queries method of mongoose

export const Vedio = mongoose.model("Vedio",vedioSchema)