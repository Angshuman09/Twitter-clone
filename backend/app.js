import express from 'express';
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import dotenv from 'dotenv';
import { db } from './db/db.js';
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(cookieParser());

const port = process.env.PORT || 4000; 
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/api/auth',authRoutes);
app.use('/api/user', userRoutes);

app.listen(port,()=>{
    console.log(`server is running in the port ${port}`);
    db();
})