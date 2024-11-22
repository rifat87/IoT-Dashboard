import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from './routes/authRoutes.js'


import authMiddleware from './middleware/authMiddleware.js';
const { requireAuth, checkUser } = authMiddleware

dotenv.config();
connectDB();

const app = express();

// app.use(cors({origin:"*", credentials:true}));
app.use(cors({
    origin: 'http://localhost:5173',
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // headers: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.options('*', cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Replace with your React app's URL
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.use(express.json());
app.use(cookieParser())
//check for all request
app.get('*', checkUser)

app.use(router)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
