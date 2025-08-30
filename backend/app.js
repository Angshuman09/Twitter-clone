import express from 'express';
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv';
import { db } from './db/db.js';
import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
dotenv.config();
const app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

const port = process.env.PORT || 4000; 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())


app.use('/api/auth',authRoutes);

app.listen(port,()=>{
    console.log(`server is running in the port ${port}`);
    db();
})