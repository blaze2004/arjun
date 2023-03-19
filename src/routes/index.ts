import express from 'express';
import messageRouter from './routes.message';

const router = express.Router();

router.use('/api/v1', messageRouter);

export default router
