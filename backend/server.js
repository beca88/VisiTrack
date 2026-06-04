const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { WebSocketServer } = require('ws');

// 1. Setup WebSocket Server on port 8080
// This is the "radio station" your React app listens to.
const wss = new WebSocketServer({ port: 8080 });

console.log("-----------------------------------------");
console.log("🚀 WebSocket Server: ws://localhost:8080");
console.log("-----------------------------------------");

// Maintain an active list of connected browser tabs
let activeSockets = [];

// 2. Setup Serial Port 
// IMPORTANT: Ensure 'COM7' matches your Arduino IDE port.
const port = new SerialPort({
    path: 'COM7',
    baudRate: 9600
});

// The parser looks for a new line to know when one message ends.
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// 3. Handle WebSocket Connections (React Dashboard)
wss.on('connection', (ws) => {
    console.log("✅ Dashboard Connected: Browser is now listening for events.");
    
    // Add the newly connected browser socket to our tracking list
    activeSockets.push(ws);

    ws.on('close', () => {
        console.log("❌ Dashboard Disconnected: Browser window closed.");
       
        activeSockets = activeSockets.filter(socket => socket !== ws);
    });
});

// 4. Listen for Arduino Data
parser.on('data', (data) => {
    // Clean the incoming string (removes \r, \n, and extra spaces)
    const message = data.trim();

    // Check if the message matches exactly
    if (message === "1") {
        console.log("🎯 Byte Code '1' Verified: Visitor Entry Detected.");

        // Loop through and safely send the message to every open browser tab 
        activeSockets.forEach(socket => {
            // Check if the network socket state is explicitly OPEN (1) before writing
            if (socket.readyState === 1) {
                socket.send("INC_COUNT");
            }
        });
    } else {
        console.warn(`⚠️ Unrecognized Data: Received "${message}" from Arduino. Expected "1". Ignoring.`);
    }
});

// Error handling to prevent the server from crashing
port.on('error', (err) => {
    console.error('⚠️ Serial Port Error: ', err.message);
    console.log("TIP: Make sure the Arduino IDE Serial Monitor is CLOSED.");
});

port.on('open', () => {
    console.log("🔌 Serial Port Open: Successfully connected to Arduino on COM7.");
});