import mongoose from "mongoose";

const SensorMetadataSchema = new mongoose.Schema({
  sensorId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  sensorName: { type: String, required: true },
  userEmail: { type: String, required: true },
  writeApiKey: { type: String, required: true },
});

export const SensorMetadata = mongoose.model("SensorMetadata", SensorMetadataSchema);
