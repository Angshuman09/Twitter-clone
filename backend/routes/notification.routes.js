import express from 'express';
import {getUser} from '../middleware/getUser.middleware.js'
import { deleteNotification, getNotification } from '../controllers/notification.controllers.js';
const router = express.Router();

router.get('/', getUser, getNotification);
router.delete('/', getUser, deleteNotification);


export default router;