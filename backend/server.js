// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import localIP from "./config/ipConfig.js";

import http from "http"; // Native server
import { Server } from "socket.io";
import socketHandler from "./routes/socketRoutes.js"; // For frontend socket
import startEspSocketServer from "./ws/espSocketServer.js"; // For ESP32 native WS



dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Use raw HTTP server
const io = new Server(server, {
  cors: {
    origin: `http://${localIP}:5173`,
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: `http://${localIP}:5173`,
  credentials: true,
}));
app.options('*', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://${localIP}:5173`);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
  console.log("Ping is sent");
});

// JWT check
const { checkUser } = authMiddleware;
app.get('*', checkUser);

// Routes
app.use(router);

// Start WebSocket handlers
socketHandler(io);              // React/Flutter clients
startEspSocketServer();  // ESP32 native clients

// Server listen
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://${localIP}:${PORT}`);
});