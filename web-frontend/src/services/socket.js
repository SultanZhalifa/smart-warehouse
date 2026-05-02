import { io } from 'socket.io-client';

// URL backend Python lo
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Kita kontrol manual lewat Context biar gak boros RAM
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});