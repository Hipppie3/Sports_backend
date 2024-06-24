import express from 'express';
import basketballStatsController from '../controllers/basketballStatsController.js';

const router = express.Router();

router.get('/stats/:player_id', basketballStatsController.getStatsByPlayerId);
router.get('/stats/game/:game_id', basketballStatsController.getStatsByGameId); // Ensure this is correct
router.post('/stats', basketballStatsController.createStats);
router.put('/stats/:id', basketballStatsController.updateStats);
router.delete('/stats/:id', basketballStatsController.deleteStats);

export default router;
