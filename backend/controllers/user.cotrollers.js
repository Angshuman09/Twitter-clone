import { User } from "../models/user.model";

export const getUserProfile = async (req, res)=>{
    try {
        const {username} = req.params;
    
        const user = await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({success:false, message:"user not found"});
        }
    
        res.status(201).json(user);
    
        
    } catch (error) {
        console.log(`error in user controller : ${error}`);
        res.status(500).json({success:false, message:`error in user controller : ${error}`})
    }
}

export const followUnfollowUser = async (req, res)=>{
    const {id} = req.params;

    try {
        const userToModify = await User.findById(id);
        const currUser = await User.findById(req.user._id);
    
        if(id === req.user._id.toString()){
            return res.status(400).json({success:false, message: "you can't follow/unfollow same user"});
        }
    
        if(!userToModify || !currUser){
             return res.status(400).json({success:false, message: "user not found"});
        }
    
        const isFollowing = currUser.following.includes(id);

        if(isFollowing){
            //unfollow the user
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}});
        }else{
            //follow the user
            await User.findByIdAndUpdate(id, {$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});

            const notification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type:"follow"
            })

            await notification.save();
            res.status(200).json({success:true, message:"user followed successfully"});
        }
        
    } catch (error) {
        console.log(`error in user controller : ${error}`);
        res.status(500).json({success:false, message:`error in user controller : ${error}`})
    }
}