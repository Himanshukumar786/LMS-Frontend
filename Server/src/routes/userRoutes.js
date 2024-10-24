import { Router } from 'express';
import { getProfile, login, logout, register } from '../controllers/userController.js';
import isLoggedIn from '../middlewares/authMiddleware.js';

const userRoutes = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/logout', logout);
userRoutes.get('/me', isLoggedIn, getProfile);

export default userRoutes;