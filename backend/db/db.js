import mongoose from 'mongoose';

export const db = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb connection successful");
        
    } catch (error) {
        console.error(`error connecting to mongodb : ${error.message}`);
        process.exit(1);
    }
}