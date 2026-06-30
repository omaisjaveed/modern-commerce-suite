import { Router } from 'express';
import { 
  getProductReviews, 
  addProductReview, 
  fetchAllReviewsAdmin, 
  updateReviewStatusAdmin, 
  removeProductReview 
} from '../controllers/productReviewController';

const router = Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.post('/', addProductReview);

// Admin routes
router.get('/admin/all', fetchAllReviewsAdmin);
router.put('/admin/:id/status', updateReviewStatusAdmin);
router.delete('/admin/:id', removeProductReview);

export default router;
