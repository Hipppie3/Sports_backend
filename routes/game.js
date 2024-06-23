import express from 'express';
import gameController from '../controllers/gameController.js';

const router = express.Router();

router.post('/games', gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:id', gameController.getGameById);
router.put('/games/:id', gameController.updateGame);
router.delete('/games/:id', gameController.deleteGame);

export default router;
