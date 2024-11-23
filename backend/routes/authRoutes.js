import { Router } from "express";
import controller from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getSensorData } from "../controllers/sensorController.js";

const { requireAuth, checkUser } = authMiddleware;

const router = Router();

// Define routes with controller methods
router.post("/register", controller.registerUser); // User registration
router.post("/login", controller.loginUser); // User login
router.get("/logout", controller.logoutUser); // User logout
router.get('/profile', controller.getApiKey);
router.get("/data", getSensorData);

// Example protected routes
router.get("/profile", requireAuth, (req, res) => {
  res.json({ message: "This is a protected profile route." });
});

export default router;
