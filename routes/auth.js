import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/checkAuth', authController.checkAuth);

export default router;
