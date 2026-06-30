import { Router } from 'express';
import { getReviews, getReview, addReview, editReview, removeReview } from '../controllers/reviewController';

const router = Router();

router.get('/', getReviews);
router.get('/:id', getReview);
router.post('/', addReview);
router.put('/:id', editReview);
router.delete('/:id', removeReview);

export default router;
