import { Router } from 'express';
import * as controller from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.getProfile);

export default router;
