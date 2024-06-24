// routes/player.js

import express from 'express';
import playerController from '../controllers/playerController.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/players', playerController.getAllPlayers);
router.get('/players/:id', playerController.getPlayerById);
router.post('/players', upload.single('image'), playerController.createPlayer);
router.put('/players/:id', upload.single('image'), playerController.updatePlayer);
router.delete('/players/:id', playerController.deletePlayer);
router.get('/players/team/:team_id', playerController.getPlayersByTeamId);

export default router;
