import express from 'express';
import userRouter from './user/user-router';
import postRouter from './post/post-router';

const router = express.Router();

router.use('/user', userRouter);
router.use('/post', postRouter);

export default router;
