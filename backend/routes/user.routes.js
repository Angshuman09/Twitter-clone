import express from 'express';
import { getUser } from '../middleware/getUser.middleware.js';
import { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } from '../controllers/user.cotrollers.js';
const router = express.Router();

router.get('/profile/:username',getUser, getUserProfile);
router.post('/follow/:id',getUser, followUnfollowUser);
router.get('/suggested',getUser, getSuggestedUsers);
router.post('/update', getUser, updateUser);
export default router;