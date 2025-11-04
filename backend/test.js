// test-otp-sender.js
// A simple script that connects to your WebSocket server and sends a mock OTP message
// --- THIS SCRIPT IS CORRECTED TO MATCH YOUR APP'S EXPECTED DATA ---

const WebSocket = require('ws');

// 🔧 Change this to your WebSocket server URL
const WS_SERVER_URL = "ws://localhost:3000"; // or ws://192.168.x.x:3000 for LAN testing

// --- 🆔 Mock Meeting and OTP data (must match app's interface) ---
const meetingId = "mock-meeting-id-12345";
const meetingTitle = "test_script";
const meetingUrl = `https://iiitb.codetantra.com/secure/tla/mi.jsp?s=m&m=${meetingId}`;
const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Must be a 6-digit STRING

console.log(`🔄 Connecting to ${WS_SERVER_URL}...`);

const ws = new WebSocket(WS_SERVER_URL);

ws.on('open', () => {
  console.log("✅ Connected to WebSocket server!");

  // Construct the message *exactly* as the app expects
  const message = {
    type: "OTP_SUBMIT", // <-- Must be "OTP_SUBMIT"
    otp: otpCode,
    meetingTitle: meetingTitle,
    meetingId: meetingId,
    meetingUrl: meetingUrl
  };

  // Send the OTP as JSON
  ws.send(JSON.stringify(message));
  console.log("📤 Sent message:", message);

  // Close connection after a short delay
  setTimeout(() => {
    console.log("🔚 Closing test connection...");
    ws.close();
  }, 1000);
});

ws.on('message', (msg) => {
  console.log("📩 Received message from server:", msg.toString());
});

ws.on('close', () => {
  console.log("❌ Connection closed.");
});

ws.on('error', (err) => {
  console.error("⚠️ WebSocket error:", err.message);
});