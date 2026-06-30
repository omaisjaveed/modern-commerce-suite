import { Router } from 'express';
import { register, login, getUsers, removeUser } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.delete('/users/:id', removeUser);

export default router;
