import express from 'express';
import leagueController from '../controllers/leagueController.js';

const router = express.Router();

// Create a new league
router.post('/leagues', leagueController.createLeague);

// Get all leagues
router.get('/leagues', leagueController.getLeagues);

// Get league by ID
router.get('/leagues/:id', leagueController.getLeagueById);

export default router;
