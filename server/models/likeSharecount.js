import mongoose from "mongoose";

const likesharecountSchema = mongoose.Schema({
    public_id:{
        type:String,
        unique:true
    },
    likeCount:{
        type:Number,
        default:0
    },
    shareCount:{
        type:Number,
        default:0
    }
},
{ timestamps: true })

const Counts = mongoose.model('Counts',likesharecountSchema);
export default Counts;