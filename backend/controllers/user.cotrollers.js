import { User } from "../models/user.model.js";
import { Notification } from "../models/notifications.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from 'cloudinary';


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
        const currUser = await User.findById(req.user._id.toString());
    
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
            res.status(200).json({success: true, message: "user unfollowed successfully"});
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

export const getSuggestedUsers = async (req, res)=>{
    try {
        const userId = req.user._id.toString();

        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match:{
                    _id: {
                        $ne: userId,
                    }
                },
            },
            {$sample: { size: 10}},

            // {
            //     $project:{
            //         password:0
            //     }
            // }
        ]);

        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers =filteredUsers.slice(0, 4);


        //if we write project than we don't need to write this code.
        suggestedUsers.forEach((user)=> (user.password = null));

        res.status(200).json(suggestedUsers);
        
    } catch (error) {
        console.log("error in suggesting users: ", error.message);
        res.status(500).json({error: error.message});
    }
}


export const updateUser = async (req, res)=>{
    const {username, email, fullName, currentPassword, newPassword, bio, link} = req.body;

    const {profilePic, coverImg} = req.body;

    const userId = req.user._id.toString();

    try {
        let user = await User.findById(userId);
        if(!user) return res.status(404).json({error: "user is not found"});

        
        if(currentPassword && newPassword){
            const isMatched = await bcrypt.compare(currentPassword, user.password);
            
            if(!isMatched) return res.status(400).json({error: "current password is not matched"});

            if(newPassword.length<6) return res.status(400).json({error: "password must be atleast of 6 characters"});
            
            const salt = await bcrypt.genSalt(10);
            
            user.password = await bcrypt.hash(newPassword, salt);
        }
        
        else if(currentPassword ||  newPassword) return res.status(404).json({error:"current password or new password is requried"});

    if(profilePic){
        if(user.profileImg?.public_id){
            await cloudinary.uploader.destroy(user.profileImg.public_id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile"
        })

        user.profileImg = {
            url: uploadedResponse.secure_url,
            public_id: uploadedResponse.public_id
        }
    }

    if(coverImg){
        if(user.coverImg?.public_id){
            await cloudinary.uploader.destroy(user.coverImg.public_id);
        }

        const uploadedResponse = await cloudinary.uploader.upload(coverImg,{
            folder: "cover"
        })

        user.coverImg={
            url: uploadedResponse.secure_url,
            public_id: uploadedResponse.public_id
        }
    }

    if(email){
         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Not a valid email."});
        }
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();

    res.status(200).json({user: user});
    } catch (error) {
        console.log("Error in updateUser: ",error);

        res.status(500).json({error: `Error in updateUser: ${error}`})
    }
}