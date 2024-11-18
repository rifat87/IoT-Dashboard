import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sensorName: { type: String, required: true },
  data: { type: [Number], default: [] },
  timestamps: { type: [Date], default: [] },
});

export default mongoose.model("SensorData", sensorDataSchema);
