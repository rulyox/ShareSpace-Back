import express from 'express';
import { postController } from '../post';

const router = express.Router();

// Write new post.
router.post('/', postController.post);

// Delete post.
router.delete('/:access', postController.deletePost);

// Get post data.
router.get('/data/:access', postController.getData);

// Get post preview.
router.get('/preview/:access', postController.getPreview);

// Get feed.
router.get('/feed', postController.getFeed);

// Get post list by user.
router.get('/user/:access', postController.getUser);

// Get image file.
router.get('/image/:access/:image', postController.getImage);

// Get likes of post.
router.get('/like/:access', postController.getLike);

// Like post.
router.post('/like/:access', postController.postLike);

// Get comments of post.
router.get('/comment/:access', postController.getComment);

// Write comment.
router.post('/comment/:access', postController.postComment);

// Delete comment.
router.delete('/comment/:access', postController.deleteComment);

export default router;
