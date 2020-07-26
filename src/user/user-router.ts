import express from 'express';
import { userController } from '../user';

const router = express.Router();

// Check login and create token.
router.post('/token', userController.postToken);

// Login using token.
router.get('/', userController.get);

// Sign up.
router.post('/', userController.post);

// Change user data.
router.put('/', userController.put);

// Get user data.
router.get('/data/:access', userController.getData);

// Get profile image.
router.get('/image/:access', userController.getImage);

// Add profile image.
router.post('/image', userController.postImage);

// Search user.
router.get('/search/:query', userController.getSearch);

export default router;
