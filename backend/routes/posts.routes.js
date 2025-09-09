import express from 'express';
import { commentOnPost, createPost, deletePost, getALlPosts, getFollowingPosts, getLikedPosts, getUserPosts, likeUnlikePost } from '../controllers/posts.controllers.js';
import { getUser } from '../middleware/getUser.middleware.js';

const router = express.Router();


router.post('/create', getUser, createPost);
router.delete('/:id',getUser, deletePost);
router.post('/comment/:id',getUser,commentOnPost);
router.post('/like/:id',getUser, likeUnlikePost);
router.get("/likes/:id",getUser, getLikedPosts);
router.get('/following',getUser, getFollowingPosts);
router.get('/user/:username', getUserPosts);
router.get('/all',getUser, getALlPosts);

export default router;