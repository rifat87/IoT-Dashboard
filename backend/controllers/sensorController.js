import SensorData from "../models/SensorData.js";


const addSensorData = async (req, res) => {
  const { email, sensorName, value } = req.body;

  try {
    const newData = new SensorData({ email, sensorName, value });
    await newData.save();

    res.status(201).json({ message: 'Sensor data added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSensorData = async (req, res) => {
  try {
    const sensorData = await SensorData.find({ userId: req.user._id });
    res.status(200).json(sensorData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { addSensorData, getSensorData };
