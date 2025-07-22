import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../styles/ControlDevice.css";

// Dynamically determine base URL
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : `http://${window.location.hostname}:5000`;

const ControlDevice = () => {
  const [ledState, setLedState] = useState("off");
  const [connected, setConnected] = useState(false);
  const [lastUpdatedBy, setLastUpdatedBy] = useState("You");

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(baseURL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔗 Connected to WebSocket server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
      setConnected(false);
    });

    socket.on("ledStatus", (data) => {
      const { state } = data;
      console.log("📡 LED status update received:", state);
      setLedState(state);
      setLastUpdatedBy("ESP32");
    });

    socket.on("status", (data) => {
      console.log("✅ Server ACK:", data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("ledStatus");
      socket.off("status");
      // Don't call disconnect unless you're done with app
    };
  }, []);

  const toggleLED = (state) => {
    if (socketRef.current && connected) {
      socketRef.current.emit("led", { state });
      setLedState(state);
      setLastUpdatedBy("You");
    } else {
      console.warn("⚠️ Socket not connected. Cannot send LED toggle.");
    }
  };

  return (
    <div className="control-device">
      <h2>🧠 Device Control Panel</h2>
      <p>
        Status:{" "}
        <strong>{connected ? "Connected ✅" : "Disconnected ❌"}</strong>
      </p>
      <div className="buttons">
        <button onClick={() => toggleLED("on")} className="on-btn">
          Turn ON 🔆
        </button>
        <button onClick={() => toggleLED("off")} className="off-btn">
          Turn OFF 🌙
        </button>
      </div>
      <p>
        LED is currently <strong>{ledState.toUpperCase()}</strong> <br />
        <em>(Last updated by: {lastUpdatedBy})</em>
      </p>
    </div>
  );
};

export default ControlDevice;
