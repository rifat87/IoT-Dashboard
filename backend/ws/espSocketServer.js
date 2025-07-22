// backend/ws/espSocketServer.js
import WebSocket, { WebSocketServer } from 'ws';
import { handleESP32Message } from '../controllers/deviceController.js';

const espSocketClients = new Set(); // Store connected ESP32 devices

const startEspSocketServer = () => {
  const wss = new WebSocketServer({ port: 6000 }); // 🔥 Own port, no path needed

  wss.on('connection', (ws) => {
    console.log('🔌 ESP32 connected via RAW WebSocket');
    espSocketClients.add(ws);

    ws.on('message', (message) => {
      try {
        const str = message.toString('utf8'); // Force UTF-8 parsing
        console.log('📨 Message from ESP32:', str);
        handleESP32Message(str, ws);
      } catch (err) {
        console.error("❌ Failed to decode message from ESP32:", err);
      }
    });

    ws.on('close', () => {
      console.log('❌ ESP32 disconnected');
      espSocketClients.delete(ws);
    });

    ws.on('error', (err) => {
      console.error('❌ WebSocket error from ESP32:', err.message);
    });
  });

  // Broadcast method (can be used by backend to send messages to ESP32s)
  wss.broadcast = (data) => {
    const msg = JSON.stringify(data);
    espSocketClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  };

  console.log('✅ ESP32 WebSocket server running on port 6000');
};

export default startEspSocketServer;
