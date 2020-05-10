import express from 'express';
import userFunction from './user-function';

const router = express.Router();

// Check login and create token.
router.post('/token', userFunction.postToken);

// Login using token.
router.get('/', userFunction.get);

// Sign up.
router.post('/', userFunction.post);

// Get user data.
router.get('/data/:access', userFunction.getData);

// Get profile image.
router.get('/image/:access', userFunction.getImage);

// Add profile image.
router.post('/image', userFunction.postImage);

export default router;
