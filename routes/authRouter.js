import { Router } from 'express';
import { register, login, getme } from '../controllers/UserController.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { registerValidation, loginValidation } from '../validations.js';

const router = Router();

// Register user
router.post('/register', registerValidation, register);

// Login
router.post('/login', loginValidation, login);

// Check auth user
router.get('/me', checkAuth, getme);


export default router;