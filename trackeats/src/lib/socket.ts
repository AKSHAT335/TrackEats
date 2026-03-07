import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const rawSocketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER;
    const socketServerUrl = rawSocketServerUrl
      ? rawSocketServerUrl.replace(/^"|"$/g, "")
      : "http://localhost:4000";

    socket = io(socketServerUrl, {
      transports: ["websocket", "polling"],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      withCredentials: false,
    });
  }
  return socket;
};
