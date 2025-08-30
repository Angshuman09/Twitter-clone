import express from 'express';
import { login, logout, signup } from '../controllers/auth.controllers.js';

const route = express.Router();

route.post('/signup',signup)

route.post('/login',login)

route.post('/logout', logout);

// route.get('/get',getData)


export default route;