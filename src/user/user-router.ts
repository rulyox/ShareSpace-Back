import express from 'express';
import userLogic from './user-logic';

const router = express.Router();

// Check login and create token.
router.post('/token', userLogic.postToken);

// Login using token.
router.get('/', userLogic.get);

// Sign up.
router.post('/', userLogic.post);

// Get user data.
router.get('/data/:id', userLogic.getData);

// Get profile image.
router.get('/image/:id', userLogic.getImage);

// Add profile image.
router.post('/image', userLogic.postImage);

export default router;
