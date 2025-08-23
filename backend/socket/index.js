
let io = null;

function initSocket(server, options = {}) {
  const { Server } = require('socket.io');
  io = new Server(server, options);

  io.on('connection', socket => {
    console.log('Socket connected:', socket.id);
    socket.on('auth', data => { socket.user = data?.userId || null; });
    socket.on('disconnect', () => console.log('Socket disconnected:', socket.id));
  });
}

function getIO() {
  if (!io) throw new Error('Socket not initialized');
  return io;
}

module.exports = { initSocket, getIO };

