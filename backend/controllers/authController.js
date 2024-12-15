import { Users } from "../models/User.js";
import jwt from 'jsonwebtoken';
import localIP from '../config/ipConfig.js';


const maxAge = 3*24*60*60;

const createToken = (id) => {
  return jwt.sign({id}, 'mynameisrifat', {
    expiresIn: maxAge
  });
}


// Controller functions
const registerUser = async (req, res) => {
  const { username: name, email, password } = req.body;
  console.log("Registering user:", req.body); // Log incoming data

  try {
    const userExists = await Users.findOne({ email });
    console.log("The email is uinque");
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("The email");
    const users = new Users({ name, email, password });
    // Save user to database
    await users.save();
    console.log("The data is stored");
    const token = createToken(users.email);
    res.header('Access-Control-Allow-Origin', `http://${localIP}:5173`);
    res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
    if (users) {
      console.log("Unable to create the user");

      res.status(201).json({
        _id: users._id,
        name: users.name,
        email: users.email,
        writeApiKey: users.writeApiKey, // Include the API key in the response
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error details:", error);

    console.log("Getting error in catch")
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await Users.findOne({ email });
    if (users && (await users.matchPassword(password))) {
      const token = createToken(users.email);
      console.log("Generated Token:", token);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: 'lax',
      });
      console.log("Cooke is sent to frontend");
      const decodedToken = jwt.decode(token);
      console.log("Decoded Token:", decodedToken);
      res.status(200).json({
        _id: users._id,
        name: users.name,
        email: users.email,
        token, // Optional, for frontend use
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const getApiKey = async (req, res) => {
//   try {
//     // The user is already attached to the request object by the requireAuth middleware
//     const token = req.cookies.jwt;
//     console.log("The error is token: ", token);
//     if(!token){
//       console.log("Found error");
//       throw new Error('JWT token is missing');
//     }
//     // Decoded Token: { id: 're@gmail.com', iat: 1732385130, exp: 1732644330 }
//     const decodedToken = jwt.decode(token);
//     const userEmail = decodedToken.id;
//     console.log("the token email id: ", userEmail);

//     const user = await Users.findOne({ email: userEmail }); 
//     console.log("The user data from email: ", user);
//     // If the user is found, send the writeApiKey
//     console.log("The writeApiKey is: ", user.writeApiKey);
//     if (user) {
//       console.log("Hello AOI KEy");
//       res.status(200).json({ writeApiKey: user.writeApiKey });
//       console.log("Token data to email is found")
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getApiKey = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log("The error is token: ", token);

    // Check if the token is missing
    if (!token) {
      console.log("Found error: JWT token is missing");
      return res.status(401).json({ message: 'JWT token is missing' }); // Send 401 Unauthorized
    }

    // Decode the JWT token
    const decodedToken = jwt.decode(token);
    const userEmail = decodedToken.id;
    console.log("The token email id: ", userEmail);

    // Find user by email
    const user = await Users.findOne({ email: userEmail });
    
    // Log the user data for debugging
    console.log("The user data from email: ", user);

    // Check if the user exists
    if (user) {
      console.log("Hello API Key");
      console.log("The writeApiKey is: ", user.writeApiKey);
      console.log("Sending API key response...");
      return res.status(200).json({ writeApiKey: user.writeApiKey }); // Send 200 OK with API key
    } else {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" }); // Send 404 Not Found
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    
    // Only respond if headers have not been sent
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" }); // Send 500 Internal Server Error
    }
  }
};


export const getDashboard = (req, res) => {
  if (req.user) {
      return res.status(200).json({ message: 'User is authenticated', user: req.user });
  } else {
      return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
};


const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logout successful" });
};

// Export all functions in one object
const controller = {
  registerUser,
  loginUser,
  logoutUser,
  getApiKey,
  getDashboard,
};

export default controller;
