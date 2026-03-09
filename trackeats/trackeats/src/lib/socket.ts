import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const rawSocketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER;
    const socketServerUrl = rawSocketServerUrl
      ? rawSocketServerUrl.replace(/^"|"$/g, "")
      : "http://localhost:4000";

    console.log("Connecting to socket server:", socketServerUrl);

    socket = io(socketServerUrl, {
      transports: ["polling", "websocket"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      withCredentials: false,
      upgrade: true,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  }
  return socket;
};
