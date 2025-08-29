import express from 'express';
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv';
import { db } from './db/db.js';
dotenv.config();
const app = express();

const port = process.env.PORT || 4000; 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use('/api/auth',authRoutes);

app.listen(port,()=>{
    console.log(`server is running in the port ${port}`);
    db();
})