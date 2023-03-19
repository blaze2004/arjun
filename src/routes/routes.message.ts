import express, { Response } from 'express';
import getMessage from '../actions/conversation/getMessage';
import validate from '../validator/validateResources';
import { messageReqSchema } from '../schema/user.schema';

const router = express.Router();

router.get('/', (_, res: Response) => {
  res.send('Arjun v1.0.0');
});

router.post('/chat', validate(messageReqSchema), getMessage);

export default router;
