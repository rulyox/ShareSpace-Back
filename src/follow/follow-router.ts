import express from 'express';
import followRequest from './follow-request';

const router = express.Router();

// Get user's following list.
router.get('/ing/:access', followRequest.getFollowing);

// Get user's follower list.
router.get('/er/:access', followRequest.getFollower);

// Check if following.
router.get('/check/:follower/:following', followRequest.getCheck);

// Follow other user.
router.post('/', followRequest.post);

export default router;
