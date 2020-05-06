import express from 'express';
import postLogic from './post-logic';

const router = express.Router();

// Write new post.
router.post('/', postLogic.post);

// Get post data.
router.get('/data/:access', postLogic.getData);

// Get feed.
router.get('/feed', postLogic.getFeed);

// Get post list by user.
router.get('/user/:access', postLogic.getUser);

// Get image file.
router.get('/image/:access/:image', postLogic.getImage);

export default router;
