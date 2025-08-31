import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const getUser = async (req, res, next)=>{
    try {
        const token = req.cookies.token;
    
        if(!token){
            return res.status(400).json({success:false, message:"Token not found"});
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded){
            return res.status(400).json({success:false, message:"Invalid token"})
        }
    
        const user = await User.findById(decoded.userId).select("-password");
    
        if(!user){
            return res.status(400).json({success:false, message:"user not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("error in getUser middleware:",error.message);
        res.status(500).json({success:false, message:`error in getUser middleware:${error.message}`});
    }
}