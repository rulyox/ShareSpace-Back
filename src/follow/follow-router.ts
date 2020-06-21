import express from 'express';
import * as followController from './follow-controller';

const router = express.Router();

// Get user's following list.
router.get('/ing/:access', followController.getFollowing);

// Get user's follower list.
router.get('/er/:access', followController.getFollower);

// Check if following.
router.get('/check/:follower/:following', followController.getCheck);

// Follow other user.
router.post('/', followController.post);

export default router;
