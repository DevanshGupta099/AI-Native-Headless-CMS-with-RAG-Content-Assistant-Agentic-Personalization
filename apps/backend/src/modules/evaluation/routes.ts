import { Router } from 'express';
import * as controller from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/run', authenticate, controller.runEval);
router.get('/results', authenticate, controller.getResults);
router.get('/summary', authenticate, controller.getSummary);

export default router;
