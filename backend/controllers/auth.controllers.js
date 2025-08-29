import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
export const signup = async (req,res)=>{
    try {
        const {username, email, password, fullName} =req.body;
    
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({success:false, message:"Not a valid email"});
        }
    
        const existedUsername = await User.findOne({username});
        if(existedUsername){
            return res.status(400).json({success:false, message:"username already exist"});
        }

        if(password<6){
            return res.status(400).json({success:false, message:"password must need atleast 6 characters long"});
        }
    
        const salt = await bcrypt.genSalt(10);
    
        const hashPassword =await bcrypt.hash(password,salt);
    
        const newUser = new User({
            username:username,
            email:email,
            fullName:fullName,
            password:hashPassword
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);
          await newUser.save();

          return res.status(200).json({
            username:newUser.username,
            fullName:newUser.fullName,
            email:newUser.email,
            followers:newUser.followers,
            following:newUser.following,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg
          })
        }else{
            return res.status(400).json({success:false, message:"Invalid user data"});
        }
    } catch (error) {
        console.log("error in signup:",error.message);
        res.status(500).json({success:false, message:"error in signup"});
    }
}

export const login = async (req,res)=>{
    res.json({message:"login done"});
}

export const logout= async (req,res)=>{
    res.json({message:"logout done"});
}