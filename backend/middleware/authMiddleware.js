import jwt from "jsonwebtoken";
import { Users } from "../models/User.js"; // Adjust the path as needed

 // Use environment variable for secret

// Middleware to check if the user is authorized

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt
  console.log("Hello")
  // chec json wev token exitst & is verified
  if(token){
      // we are going to use jwt.verify method to check the token
      jwt.verify(token, 'mynameisrifat', (err, decodedToken) => {
          if(err) { // if there is any error found then redirect the user to login page
              console.log(err.message)
              res.status(401).json({ error: 'Unauthorized' });
          }else{
              console.log(decodedToken);
              req.userId = decodedToken.id;
              next()
          }
      } )
  }
  else{
      res.status(401).json({ error: 'Unauthorized' });
  }
};


// Middleware to check and attach the user to the request
const checkUser = async (req, res, next) => {
  const token = req.cookies?.jwt; // Retrieve token from cookies

  if (!token) {
    req.user = null; // No token, no user
    return next();
  }

  jwt.verify(token, 'mynameisrifat', async (err, decodedToken) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      req.user = null; // Invalid token, no user
      return next();
    }

    try {
      const user = await Users.findById(decodedToken.id); // Look up the user by ID
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
