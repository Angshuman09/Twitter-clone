import express from 'express';
import { getUser } from '../middleware/getUser.middleware.js';
import { getUserProfile, followUnfollowUser, getSuggestedUsers } from '../controllers/user.cotrollers.js';
const router = express.Router();

router.get('/profile/:username',getUser, getUserProfile);
router.post('/follow/:id',getUser, followUnfollowUser);
router.get('/suggested',getUser, getSuggestedUsers);
export default router;