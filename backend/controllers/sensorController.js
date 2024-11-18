import SensorData from "../models/SensorData.js";

const addSensorData = async (req, res) => {
  const { sensorName, data, timestamp } = req.body;

  try {
    const sensorData = await SensorData.findOneAndUpdate(
      { userId: req.user._id, sensorName },
      {
        $push: { data, timestamps: timestamp },
      },
      { upsert: true, new: true }
    );

    res.status(200).json(sensorData);
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
