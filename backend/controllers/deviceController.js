// backend/controllers/deviceController.js

let latestESP32Connection = null; // Store reference to most recent ESP32 WS client

// Called when frontend (React/Flutter) sends toggle request
export const toggleLED = (data, socket) => {
  const { state } = data;

  if (state !== "on" && state !== "off") {
    console.log("⚠️ Invalid LED state received:", state);
    return;
  }

  console.log(`🧠 LED Toggle Requested: ${state.toUpperCase()}`);

  // Emit to frontend listeners (status update)
  socket.emit("status", { message: `LED turned ${state}` });

  // Relay command to latest connected ESP32
  if (latestESP32Connection && latestESP32Connection.readyState === 1) {
    const msg = JSON.stringify({ led: state });
    latestESP32Connection.send(msg);
    console.log("📤 Sent to ESP32 via WebSocket:", msg);
  } else {
    console.warn("❌ No active ESP32 WebSocket client");
  }
};

// Called when ESP32 sends a message
export const handleESP32Message = (message, ws) => {
  latestESP32Connection = ws; // Update active ESP32 reference
  console.log("📡 ESP32 says:", message);

  try {
    const parsed = JSON.parse(message);

    if (parsed?.led) {
      console.log("💡 LED Status from ESP32:", parsed.led);

      // Optionally, emit status to all frontend clients via socket.io
      // This requires a global `io` or passing it via closure
      // io.emit('ledStatus', { state: parsed.led });
    }

    // You can handle sensor data here as well
    // if (parsed.sensor) { ... }

  } catch (err) {
    console.error("❌ Error parsing ESP32 message:", err.message);
  }
};
