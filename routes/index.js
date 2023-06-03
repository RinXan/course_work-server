import { Router } from 'express';

import authRouter from './authRouter.js';
import postRouter from './postRouter.js';
import uploadRouter from './uploadRouter.js'
import channelRouter from './channelRouter.js'
import userRouter from './userRouter.js'

const router = Router();

router.use('/auth', authRouter);
router.use('/posts', postRouter);
router.use('/channel', channelRouter);
router.use('/user', userRouter);
router.use('/upload', uploadRouter);

export default router;
