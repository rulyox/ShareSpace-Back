import express from 'express';
import postRequest from './post-request';

const router = express.Router();

// Write new post.
router.post('/', postRequest.post);

// Get post data.
router.get('/data/:access', postRequest.getData);

// Get post preview.
router.get('/preview/:access', postRequest.getPreview);

// Get feed.
router.get('/feed', postRequest.getFeed);

// Get post list by user.
router.get('/user/:access', postRequest.getUser);

// Get image file.
router.get('/image/:access/:image', postRequest.getImage);

export default router;
