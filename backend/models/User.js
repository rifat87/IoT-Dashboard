import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  writeApiKey: { type: String, unique: true }, // Field to store Write API Key
});

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate Write API Key before saving
userSchema.pre("save", function (next) {
  if (!this.writeApiKey) {
    this.writeApiKey = crypto.randomBytes(16).toString("hex"); // Generate a 32-character hex key
  }
  next();
});

// Match passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const Users = mongoose.model("Users", userSchema);
