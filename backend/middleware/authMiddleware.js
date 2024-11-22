import jwt from "jsonwebtoken";
import { User } from "../models/User.js"; // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable for secret

// Middleware to check if the user is authorized
const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" }); // Token not found
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Decoded Token:", decodedToken);
    req.userId = decodedToken.id; // Attach user ID to the request
    next();
  });
};

// Middleware to check and attach the user to the request
const checkUser = async (req, res, next) => {
  const token = req.cookies?.jwt; // Retrieve token from cookies

  if (!token) {
    req.user = null; // No token, no user
    return next();
  }

  jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      req.user = null; // Invalid token, no user
      return next();
    }

    try {
      const user = await User.findById(decodedToken.id); // Look up the user by ID
      if (user) {
        req.user = user; // Attach user to the request
      } else {
        console.warn("User not found for ID:", decodedToken.id);
        req.user = null; // User not found
      }
    } catch (error) {
      console.error("Database Error:", error.message);
      req.user = null; // In case of DB error, no user
    }

    next(); // Proceed to the next middleware
  });
};

export default { requireAuth, checkUser };
