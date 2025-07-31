#include <WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "No_Network";
const char* password = "rifat2001005";

const char* websocket_host = "10.114.232.105";  // Backend IP
const uint16_t websocket_port = 6000;

WebSocketsClient webSocket;

const int relayPin = 4; // We're using GPIO 4 to control IN4

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("❌ WebSocket Disconnected");
      break;

    case WStype_CONNECTED:
      Serial.println("✅ WebSocket Connected to server");
      webSocket.sendTXT("{\"message\":\"ESP32 connected\"}");
      break;

    case WStype_TEXT: {
      String msg = String((char*) payload);
      Serial.print("📨 Message from server: ");
      Serial.println(msg);

      if (msg.indexOf("on") != -1) {
        digitalWrite(relayPin, LOW); // Relay ON (Active LOW)
        Serial.println("🔌 Relay ON");
        webSocket.sendTXT("{\"event\":\"ledStatus\",\"state\":\"on\"}");
      }
      else if (msg.indexOf("off") != -1) {
        digitalWrite(relayPin, HIGH); // Relay OFF (Active LOW)
        Serial.println("🛑 Relay OFF");
        webSocket.sendTXT("{\"event\":\"ledStatus\",\"state\":\"off\"}");
      }
      break;
    }

    case WStype_ERROR:
      Serial.println("❗ WebSocket Error occurred");
      break;

    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH); // OFF by default (Active LOW relay)

  WiFi.begin(ssid, password);
  Serial.print("🔌 Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected!");
  Serial.print("📡 Local IP: ");
  Serial.println(WiFi.localIP());

  webSocket.begin(websocket_host, websocket_port, "/");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();
}
