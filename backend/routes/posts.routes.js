import express from 'express';
import { commentOnPost, createPost, deletePost, likeUnlikePost } from '../controllers/posts.controllers.js';
import { getUser } from '../middleware/getUser.middleware.js';

const router = express.Router();


router.post('/create', getUser, createPost);
router.delete('/:id',getUser, deletePost);
router.post('/comment/:id',commentOnPost);
router.post('/like/:id', likeUnlikePost);


export default router;