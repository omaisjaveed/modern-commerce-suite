import { Router } from 'express';
import { placeOrder, getOrders, getOrder, updateOrder, createPaymentIntent } from '../controllers/orderController';

const router = Router();

router.post('/', placeOrder);
router.post('/create-payment-intent', createPaymentIntent);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);

export default router;
