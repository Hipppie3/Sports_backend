import express from 'express';
import standingController from '../controllers/standingController.js';

const router = express.Router();

router.post('/standings', standingController.createStanding);
router.get('/standings', standingController.getAllStandings);
router.get('/standings/:id', standingController.getStandingById);
router.put('/standings/:id', standingController.updateStanding);
router.delete('/standings/:id', standingController.deleteStanding);

export default router;
