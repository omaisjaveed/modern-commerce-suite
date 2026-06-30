import { Router } from 'express';
import { getPage, upsertPage } from '../controllers/pageController';

const router = Router();

router.get('/:slug', getPage);
router.post('/', upsertPage);

export default router;
