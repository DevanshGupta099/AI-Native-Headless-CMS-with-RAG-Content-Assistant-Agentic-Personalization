import { Router } from 'express';
import * as controller from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/search', controller.search);
router.post('/search', controller.search);
router.post('/chat', controller.chat);
router.post('/agent/execute', authenticate, controller.executeAgent);
router.get('/agent/logs/:id', authenticate, controller.getAgentLogs);

export default router;
