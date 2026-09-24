import { Router } from 'express';
import * as controller from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/', authenticate, controller.create);
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, controller.update);
router.post('/:id/publish', authenticate, controller.publish);
router.get('/:id/versions', authenticate, controller.getVersions);
router.delete('/:id', authenticate, controller.archive);

export default router;
