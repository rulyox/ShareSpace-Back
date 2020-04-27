import express from 'express';
import userLogic from './user-logic';

const router = express.Router();

router.post('/token', userLogic.postToken);
router.get('/', userLogic.get);
router.post('/', userLogic.post);
router.get('/image/:id', userLogic.getImage);
router.post('/image', userLogic.postImage);
router.get('/data/:id', userLogic.getData);

export default router;
