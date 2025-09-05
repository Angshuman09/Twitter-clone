import { User } from "../models/user.model.js";
import { Post } from "../models/Post.model.js";
import { Notification } from "../models/notifications.model.js";
import {v2 as cloudinary} from 'cloudinary';
export const createPost = async (req,res)=>{
    try {
        const {text, img} = req.body;
    
        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error: "user is not found"});
    
        if(!text && !img){
            return res.status(400).json({error: "post can't be empty"});
        }

        let imgData = null;
        if(img){
            const imgResponse = await cloudinary.uploader.upload(img);
            imgData ={
                url: imgResponse.secure_url,
                public_id: imgResponse.public_id
            }
        }

        const newPost = new Post({
            user:userId,
            text,
            img: imgData
        })

        await newPost.save();

        return res.status(200).json(newPost);
    } catch (error) {
        console.log("error in createPost controller: ", error);
        res.status(500).json({error: `error in createPost controller: ${error}`})
    }
}


export const deletePost = async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({error: "post not found"});

        if(post.user.toString() !== req.user._id.toString()) return res.status(401).json({error:"authorization denied"});

        if(post.img?.public_id){
           await cloudinary.uploader.destroy(post.img.public_id);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "post deleted successfully"});
        
    } catch (error) {
        console.log("error in deletePost controller: ", error);
        res.status(500).json({error: `error in deletePost controller: ${error}`})
    }
}

export const commentOnPost = async (req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const {text} = req.body;
        if(!user) return res.status(404).json({error: "User not found"});
        if(!text) return res.status(401).json({error: "Text is required"});
    
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({error: "Post not found"});
    
        const commentPost = {
            text,
            user: userId
        }
    
        post.comments.push(commentPost);
        await post.save();
    
        return res.status(200).json(post);
    } catch (error) {
        console.log("error in commentOnPost controller: ", error);
        res.status(500).json({error: `error in commentOnPost controller: ${error}`})
    }
}

export const likeUnlikePost = async (req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json("User not found");

        const postId = req.params.id;
        const post = Post.findById(postId);

        if(!post) return res.status(404).json({error: "Post not found"});

        const islike = post.likes.includes(userId);

        if(islike){
            await Post.updateOne({_id:postId}, {$pull:{likes:userId}})
            await User.updateOne({_id: userId},{$pull:{likedPosts:postId}});

            await post.save();

            const updatedPost = await Post.findById(postId);
            const updatedLikes = updatedPost.likes;

            res.status(200).json(updatedLikes);      
        }else{
            post.likes.push(userId);
            user.likedPosts.push(postId);

            await post.save();
            await user.save();

           const notification = new Notification({
            from: userId,
            to: post.user,
            type: "like"
            })

            await notification.save();

            const updatedLikes = post.likes;

            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        console.log("error in likeUnlikePost controller: ", error);
        res.status(500).json({error: `error in likeUnlikePost controller: ${error}`})
    }
}