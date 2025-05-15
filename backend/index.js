const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const FRONTEND_URL = "https://chat-website-frontend.vercel.app/chatroom/*" || 'http://localhost:5173';
const server = http.createServer(app);

app.use(cors({
  origin: FRONTEND_URL,  // Frontend URL
  methods: ['GET', 'POST'],
}));

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // Allow frontend
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('A new user connected');

  // Join the chat room
  socket.on('join-room', (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId); // Join the room with the specified roomId
  });

  // Listen for sending a message and broadcast to the room
  socket.on('send-message', (data) => {
    console.log(`Message sent to room ${data.roomId}: ${data.message}`);
    io.to(data.roomId).emit('receive-message', data.message); // Broadcast to room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});