import express from 'express';
import { addSensorData } from '../controllers/sensorController.js';

const router = express.Router();

// Route to receive data from ESP32
router.post('/write', addSensorData);

export default router;
