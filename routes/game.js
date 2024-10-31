import express from 'express';
import gameController from '../controllers/gameController.js';
import upload from '../utils/upload.js'; // Make sure to import your upload middleware

const router = express.Router();

router.post('/games', upload.none(), gameController.createGame);
router.get('/games', gameController.getAllGames);
router.get('/games/:id', gameController.getGameById);
router.put('/games/:id', upload.none(), gameController.updateGame);
router.delete('/games/:id', gameController.deleteGame);
router.get('/standings', gameController.getDynamicStandings);

export default router;
