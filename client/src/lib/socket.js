// import { io } from 'socket.io-client';

// export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// export const socket = io(API_URL, {
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

import { io } from 'socket.io-client';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(API_URL, {
  transports: ['websocket'],   // 🔥 IMPORTANT
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
