import { io } from 'socket.io-client';

/**
 * SOCKET SERVICE
 * Centralized socket connection to the AI Backend.
 * Change the URL here if you move the backend to a different IP or Port.
 */
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false, // We will connect manually when needed
});