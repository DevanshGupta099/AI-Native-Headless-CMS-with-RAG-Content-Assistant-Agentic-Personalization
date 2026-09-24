import { Router } from 'express';
import * as controller from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/segments', authenticate, controller.createSegment);
router.get('/segments', authenticate, controller.listSegments);
router.post('/variants', authenticate, controller.createVariant);
router.get('/deliver', controller.deliver);

export default router;
