import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: any) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
    connectTimeout: 10000,
  });

  io.on("connection", (socket) => {
    socket.on("join_poll", (pollId: string) => {
      if (pollId) {
        socket.join(pollId);
        // console.log(`Socket ${socket.id} joined poll: ${pollId}`);
      }
    });

    socket.on("disconnect", (reason) => {
      // console.log(`Socket ${socket.id} disconnected: ${reason}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
