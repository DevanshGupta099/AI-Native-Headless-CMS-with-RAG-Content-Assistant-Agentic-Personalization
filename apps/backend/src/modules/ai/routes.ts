import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.post('/search', controller.search);
router.post('/chat', controller.chat);

export default router;
