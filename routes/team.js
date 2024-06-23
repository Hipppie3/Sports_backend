import express from 'express';
import teamController from '../controllers/teamController.js';
import upload from '../utils/upload.js'; // Import the upload middleware

const router = express.Router();

router.post('/teams', upload.single('image'), teamController.createTeam);
router.get('/teams', teamController.getAllTeams);
router.get('/teams/:id', teamController.getTeamById);
router.put('/teams/:id', upload.single('image'), teamController.updateTeam);
router.delete('/teams/:id', teamController.deleteTeam);

export default router;
