import { Notification } from "../models/notifications.model.js";
export const getNotification = async (req, res)=>{
    try {
        const userId = req.user._id;
        const notification = await Notification.find({to:userId}).populate(
            {
                path:"from",
                select:"username profileImg"
            }
        )

        Notification.updateMany({to:userId},{read:true});

        return res.status(200).json(notification);
    } catch (error) {
        console.log(`error in getNotification controller: ${error}`);
        res.status(500).json({error:`error in getNotification controller: ${error}`});
    }
}

export const deleteNotification = async (req, res)=>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});
        return res.status(200).json({message:"Notification deleted successfully"});
    } catch (error) {
        console.log(`error in deleteNotification controller: ${error}`);
        res.status(500).json({error:`error in deleteNotification controller: ${error}`});
    }
}