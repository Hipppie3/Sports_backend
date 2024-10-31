import express from 'express';
import scheduleController from '../controllers/scheduleController.js';  // Ensure this is correct

const router = express.Router();

router.post('/schedules', scheduleController.createSchedule); // Route for creating a schedule
router.get('/schedules', scheduleController.getSchedules);    // Route for fetching all schedules
router.get('/schedules/:id', scheduleController.getScheduleById); // Route for fetching a specific schedule by ID

export default router;
