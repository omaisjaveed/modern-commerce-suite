import { Router } from 'express';
import { getFAQs, addFAQ, editFAQ, removeFAQ } from '../controllers/faqController';

const router = Router();

router.get('/', getFAQs);
router.post('/', addFAQ);
router.put('/:id', editFAQ);
router.delete('/:id', removeFAQ);

export default router;
