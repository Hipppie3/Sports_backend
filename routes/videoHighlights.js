import express from 'express';
import videoHighlightsController from '../controllers/videoHighlightsController.js';

const router = express.Router();

router.post('/', videoHighlightsController.addVideoHighlight);
router.get('/player/:playerId', videoHighlightsController.getVideoHighlightsByPlayerId);
router.put('/:id', videoHighlightsController.updateVideoHighlight);
router.delete('/:id', videoHighlightsController.deleteVideoHighlight);

export default router;
