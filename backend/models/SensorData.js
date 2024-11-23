import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sensorName: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);
export default SensorData;
