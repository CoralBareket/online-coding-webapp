const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const codeRoutes = require('./routes/codeBlockRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/code-blocks', codeRoutes);

const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (room) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = { users: [] };
    }

    rooms[room].users.push(socket.id);
    console.log(`User ${socket.id} joined room ${room}`);
    console.log(`Current users in room ${room}:`, rooms[room].users);

    if (rooms[room].users.length === 1) {
      io.to(socket.id).emit('assignMentor', true);
      console.log(`User ${socket.id} is assigned as a mentor in room ${room}`);
    } else {
      io.to(socket.id).emit('assignMentor', false);
      console.log(`User ${socket.id} is not a mentor in room ${room}`);
    }
  });

  socket.on('codeChange', (data) => {
    io.to(data.room).emit('codeChange', data.code);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    for (const room in rooms) {
      const userIndex = rooms[room].users.indexOf(socket.id);
      if (userIndex !== -1) {
        rooms[room].users.splice(userIndex, 1);
        console.log(`User ${socket.id} left room ${room}`);
        console.log(`Current users in room ${room}:`, rooms[room].users);

        // Reassign mentor if the mentor disconnects
        if (userIndex === 0 && rooms[room].users.length > 0) {
          const newMentorId = rooms[room].users[0];
          io.to(newMentorId).emit('assignMentor', true);
          console.log(`User ${newMentorId} is reassigned as a mentor in room ${room}`);
        }
      }

      // Clean up the room if it's empty
      if (rooms[room].users.length === 0) {
        delete rooms[room];
        console.log(`Room ${room} is now empty and removed`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
