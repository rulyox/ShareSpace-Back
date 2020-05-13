import express from 'express';
import userRequest from './user-request';

const router = express.Router();

// Check login and create token.
router.post('/token', userRequest.postToken);

// Login using token.
router.get('/', userRequest.get);

// Sign up.
router.post('/', userRequest.post);

// Get user data.
router.get('/data/:access', userRequest.getData);

// Get profile image.
router.get('/image/:access', userRequest.getImage);

// Add profile image.
router.post('/image', userRequest.postImage);

export default router;
