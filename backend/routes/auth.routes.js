import express from 'express';
import { getData, login, logout, signup } from '../controllers/auth.controllers.js';
import { getUser } from '../middleware/getUser.middleware.js';
const route = express.Router();

route.post('/signup',signup)

route.post('/login',login)

route.post('/logout', logout);

route.get('/getData', getUser, getData );

// route.get('/get',getData)


export default route;