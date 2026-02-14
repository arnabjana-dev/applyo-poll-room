import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    return this.socket;
  }

  joinPoll(pollId) {
    if (!this.socket?.connected) {
      this.connect();
    }

    if (this.socket && pollId) {
      this.socket.emit("join_poll", pollId);
    }
  }

  onPollUpdated(callback) {
    if (this.socket) {
      this.socket.off("poll_updated");
      this.socket.on("poll_updated", (data) => {
        callback(data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
