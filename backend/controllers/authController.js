import { User } from "../models/User.js";
import generateToken from "../utils/token.js";

// Controller functions
const registerUser = async (req, res) => {
  const { username: name, email, password } = req.body;
  console.log("Registering user:", req.body); // Log incoming data

  try {
    const userExists = await User.findOne({ email });
    console.log("The email is uinque");
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("The email");
    const user = new User({ name, email, password });
    // Save user to database
    await user.save();
    console.log("The data is stored");
    if (user) {
      console.log("Unable to create the user");
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
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
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
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
};

export default controller;
