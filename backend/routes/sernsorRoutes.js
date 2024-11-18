import express from "express";
import { addSensorData, getSensorData } from "../controllers/sensorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getSensorData).post(protect, addSensorData);

export default router;
