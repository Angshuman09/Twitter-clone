import express from 'express';
import { getUser } from '../middleware/getUser.middleware.js';
import { getUserProfile, followUnfollowUser } from '../controllers/user.cotrollers.js';
const router = express.Router();

router.get('/profile/:username',getUser, getUserProfile);
router.post('/follow/:id',getUser, followUnfollowUser);
export default router;