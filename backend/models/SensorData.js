import mongoose from "mongoose";

// Base schema for sensor data
const sensorDataSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  value: { type: Number, required: true },
});

export const createSensorDataSchema = (collectionName) => {
  // Check if model already exists to avoid OverwriteModelError
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }

  return mongoose.model(collectionName, sensorDataSchema, collectionName);
};
