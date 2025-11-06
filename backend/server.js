// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  console.log("got http get req")
  res.send('OTP Relay Server is running. Connect via WebSocket.');
});

wss.on('connection', (ws) => {
  console.log('✅ [Server] A client connected.');

  ws.on('message', (message) => {
    const messageString = message.toString();
    
    // --- MODIFIED BLOCK ---
    // We now expect JSON messages
    try {
      const parsedMessage = JSON.parse(messageString);
      
      // Log the type of message we received
      if (parsedMessage.type) {
        console.log(`📩 [Server] Received message type: ${parsedMessage.type}`);
      } else {
        console.log(`📩 [Server] Received: ${messageString}`);
      }
      
      // Broadcast the original JSON string to all other clients
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(messageString); // Forward the exact JSON string
          console.log(`📤 [Server] Forwarded message to a client.`);
        }
      });
      
    } catch (e) {
      console.error(`[Server] Failed to parse message or broadcast: ${e.message}`);
    }
    // --- END MODIFIED BLOCK ---
  });

  ws.on('close', () => {
    console.log('❌ [Server] A client disconnected.');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});