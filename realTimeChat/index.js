// Import necessary modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
// Create an HTTP server using the Express app
const server = http.createServer(app);
// Attach Socket.IO to the HTTP server
const io = new Server(server);

// Define the port, using environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`); // Log connection with ID

    // Listen for 'chat message' events from this specific client
    socket.on('chat message', (msg) => {
        console.log(`message from ${socket.id}: ${msg}`);
        // Emit an object containing the message and the sender's ID
        io.emit('chat message', { id: socket.id, message: msg });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server and listen on the specified port
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
