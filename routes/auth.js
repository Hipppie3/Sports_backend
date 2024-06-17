// routes/auth.js

import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/register', authController.registerUser);

router.post('/login', passport.authenticate('local'), authController.loginUser);

router.get('/logout', authController.logoutUser);

router.get('/check-auth', authController.checkAuth);

export default router;
