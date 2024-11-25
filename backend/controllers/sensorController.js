import { SensorMetadata } from "../models/SensorMetadata.js";
import { createSensorDataSchema } from "../models/SensorData.js";
import { Users } from "../models/User.js"; // Access the Users model
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

export const addSensor = async (req, res) => {
  try {

    const { sensorName } = req.body;

    if (!sensorName) {
      return res.status(400).json({ error: "Sensor name is required." });
    }

    const token = req.cookies.jwt;
    console.log("The error is token: ", token);
    if(!token){
      console.log("Found error");
      throw new Error('JWT token is missing');
    }
    // Decoded Token: { id: 're@gmail.com', iat: 1732385130, exp: 1732644330 }
    const decodedToken = jwt.decode(token);
    const userEmail = decodedToken.id;
    console.log("the token email id: ", userEmail);

    // Fetch the user's writeApiKey
    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const writeApiKey = user.writeApiKey;

    // Generate a unique sensorId
    const sensorId = new mongoose.Types.ObjectId();

    // Check if a sensor with the same name already exists
    const existingSensor = await SensorMetadata.findOne({
      userEmail,
      sensorName,
    });

    if (existingSensor) {
      return res
        .status(409)
        .json({ error: "A sensor with this name already exists." });
    }

    // Save sensor metadata
    const newSensorMetadata = new SensorMetadata({
      sensorId,
      sensorName,
      userEmail,
      writeApiKey,
    });

    await newSensorMetadata.save();

    // Dynamically create a collection for this sensor
    const sensorDataCollectionName = `${userEmail}_${sensorName.replace(
      /\s+/g,
      "_"
    )}`;
    createSensorDataSchema(sensorDataCollectionName);

    return res.status(201).json({
      message: "Sensor added successfully.",
      sensorId,
    });
  } catch (error) {
    console.error("Error in addSensor:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


const storeSensorData = async (req, res) => {
  try {
    const { writeApiKey, sensorName, value } = req.body;

    if (!writeApiKey || !sensorName || value == null) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Validate the writeApiKey and get sensor metadata
    const sensorMetadata = await SensorMetadata.findOne({ writeApiKey, sensorName });
    if (!sensorMetadata) {
      return res.status(404).json({ error: "Invalid API key or sensor name." });
    }

    const { userEmail } = sensorMetadata;

    // Create the dynamic collection name
    const sensorDataCollectionName = `${userEmail}_${sensorName.replace(/\s+/g, "_")}`;

    // Use the dynamic schema to interact with the sensor data collection
    const SensorData = createSensorDataSchema(sensorDataCollectionName);

    // Insert the new data into the collection
    const newSensorData = new SensorData({
      timestamp: new Date(),
      value,
    });

    await newSensorData.save();

    return res.status(201).json({ message: "Sensor data stored successfully." });
  } catch (error) {
    console.error("Error in storeSensorData:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


const readSensorData = async (req, res) => {
  try {
    console.log("Hello world");
    const { sensorName } = req.body;

    console.log("The sensor name is : ", sensorName);
    if (!sensorName) {
      return res.status(400).json({ error: "Sensor name is required" });
    }

    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decodedToken = jwt.decode(token);
    const userEmail = decodedToken.id;
    console.log("The user email from read: ", userEmail);

    const sensorMetadata = await SensorMetadata.findOne({
      userEmail: userEmail,
      sensorName: sensorName,
    });
    if (!sensorMetadata) {
      return res.status(404).json({ error: "Sensor not found" });
    }

    const sensorDataModel = createSensorDataSchema(`${userEmail}_${sensorName}`);

    // Fetch the most recent data (e.g., last 50 entries)
    const sensorData = await sensorDataModel
      .find()
      .sort({ timestamp: -1 }) // Sort by latest timestamp
      .limit(50);

    res.status(200).json(sensorData.reverse()); // Reverse to display oldest-to-newest
  } catch (error) {
    console.log("The error isn readData");
    console.error("Error in readSensorData:", error);
    res.status(500).json({ error: "Failed to fetch sensor data" });
  }
};


const sensorController = {
  addSensor, 
  storeSensorData,
  readSensorData,
};

export default sensorController;
