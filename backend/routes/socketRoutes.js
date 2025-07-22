// routes/socketRoutes.js
import { toggleLED } from "../controllers/deviceController.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🚀 New FRONTEND ------ > client connected:", socket.id);

    // Handle LED toggle from frontend
    socket.on("led", (data) => {
      console.log("📥 LED Toggle from Frontend----> :", data);
      toggleLED(data, socket, io);
    });

    socket.on("disconnect", () => {
      console.log("❌ Fontend --> Client disconnected:", socket.id);
    });
  });
};

export default socketHandler;
