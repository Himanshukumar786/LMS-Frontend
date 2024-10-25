import { Router } from 'express';
import { getProfile, login, logout, register } from '../controllers/userController.js';
import isLoggedIn from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const userRoutes = Router();

userRoutes.post('/register', upload.single("avatar"), register);
userRoutes.post('/login', login);
userRoutes.get('/logout', logout);
userRoutes.get('/me', isLoggedIn, getProfile);

export default userRoutes;