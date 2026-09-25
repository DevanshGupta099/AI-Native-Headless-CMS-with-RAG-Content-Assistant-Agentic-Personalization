import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.post('/run', controller.runEval);
router.get('/results', controller.getResults);
router.get('/history', controller.getResults);
router.get('/summary', controller.getSummary);

export default router;
