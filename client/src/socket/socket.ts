import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("🟢 Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("🔴 Disconnected");
    });

    return this.socket;
  }

  getSocket() {
    if (!this.socket) return this.connect();
    return this.socket;
  }
}

export const socketService = new SocketService();