import { io } from 'socket.io-client';

let socket = null;

export function initSocket() {
  if (socket) return socket;
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
  socket = io(url, { transports: ['websocket', 'polling'] });
  return socket;
}
export const getSocket = () => socket;
export function stopSocket() { if (socket) socket.disconnect(); socket = null; }