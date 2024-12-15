// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import localIP from './config/ipConfig.js'; // Import the local IP address

const { requireAuth, checkUser } = authMiddleware;

dotenv.config();
connectDB();

const app = express();

// Set up CORS using the imported local IP
app.use(cors({
    origin: `http://${localIP}:5173`, // Use the imported local IP for CORS
    credentials: true
}));

app.options('*', cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `http://${localIP}:5173`); // Use the imported local IP for headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// app.get('/', (req, res) => {
//     res.send('Hello World!'); // This can be any response you want
// });

app.use(express.json());
app.use(cookieParser());
// Check for all requests
app.get('*', checkUser);

app.use(router);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));