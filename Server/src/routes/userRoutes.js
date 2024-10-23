import { Router } from 'express';
import { getProfile, login, logout, register } from '../controllers/userController';

const userRoutes = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/logout', logout);
userRoutes.get('/me', getProfile);

export default userRoutes;