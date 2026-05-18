import { io, Socket } from "socket.io-client";
import { ENV } from "../config/env";

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(ENV.SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("[SOCKET] ✅ Connected:", socketInstance?.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("[SOCKET] ❌ Disconnected");
    });

    socketInstance.on("error", (error: Error | string) => {
      console.error("[SOCKET] ⚠️ Error:", error);
    });
  }

  return socketInstance;
};

export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    console.log("[SOCKET] Socket disconnected and cleared");
  }
};