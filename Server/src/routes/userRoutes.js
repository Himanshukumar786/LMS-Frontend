import { Router } from 'express';
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword } from '../controllers/userController.js';
import isLoggedIn from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const userRoutes = Router();

userRoutes.post('/register', upload.single("avatar"), register);
userRoutes.post('/login', login);
userRoutes.get('/logout', logout);
userRoutes.get('/me', isLoggedIn, getProfile);
userRoutes.post('/reset', forgotPassword);
userRoutes.post('/reset/:resetToken', resetPassword);
userRoutes.post('/change-password', isLoggedIn, changePassword);

export default userRoutes;