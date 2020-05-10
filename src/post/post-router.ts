import express from 'express';
import postFunction from './post-function';

const router = express.Router();

// Write new post.
router.post('/', postFunction.post);

// Get post data.
router.get('/data/:access', postFunction.getData);

// Get post preview.
router.get('/preview/:access', postFunction.getPreview);

// Get feed.
router.get('/feed', postFunction.getFeed);

// Get post list by user.
router.get('/user/:access', postFunction.getUser);

// Get image file.
router.get('/image/:access/:image', postFunction.getImage);

export default router;
