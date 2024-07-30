const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

const codeBlocks = [
  { title: 'Async Case', code: 'async function example() { /* your code */ }', solution: 'async function example() { return true; }' },
  { title: 'Callback Example', code: 'function callbackExample() { /* your code */ }', solution: 'function callbackExample() { return true; }' },
  { title: 'Promise Example', code: 'function promiseExample() { /* your code */ }', solution: 'function promiseExample() { return true; }' },
  { title: 'Event Loop', code: 'function eventLoopExample() { /* your code */ }', solution: 'function eventLoopExample() { return true; }' },
];

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/code-blocks', (req, res) => {
  res.json(codeBlocks.map(cb => ({ title: cb.title })));
});

app.get('/code-block/:title', (req, res) => {
  const codeBlock = codeBlocks.find(cb => cb.title === req.params.title);
  if (codeBlock) {
    res.json(codeBlock);
  } else {
    res.status(404).send('Code block not found');
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (room) => {
    socket.join(room);
  });

  socket.on('codeChange', (data) => {
    io.to(data.room).emit('codeChange', data.code);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
