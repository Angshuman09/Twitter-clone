import mongoose, { model } from "mongoose";

const NotificationSchema = new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        requrired:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        requrired:true
    },
    type:{
        type:String,
        enum:["like","follow"],
        requrired:true
    },
    read:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});


export const Notification = mongoose.model('Notification', NotificationSchema);