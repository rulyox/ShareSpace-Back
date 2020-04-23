import express from 'express';
import postLogic from './post-logic';

const router = express.Router();

router.post('/', postLogic.post);
router.get('/user/:id', postLogic.getUser);
router.get('/data/:id', postLogic.getData);
router.get('/image/:post/:image', postLogic.getImage);
router.get('/feed', postLogic.getFeed);

export default router;
