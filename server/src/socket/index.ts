import { Server, Socket } from "socket.io";
import http from "http";
import { RoomManager } from "../rooms/roomManager";
import type {
  JoinRoomPayload,
  StartGamePayload,
} from "../types/socket";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000", "*"],
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log("[SOCKET] ✅ User connected:", socket.id);

    // ========================================================================
    // GAME EVENTS
    // ========================================================================

    /**
     * Handle: game:join_room { roomId, playerName }
     */
    socket.on("game:join", (payload: JoinRoomPayload) => {
      console.log(`[RECEIVE] game:join from ${socket.id}`, payload);
      RoomManager.handleJoinRoom(socket, payload.roomId, payload.playerName);
    });

    // Backward compatibility
    socket.on("game:join_room", (payload: JoinRoomPayload) => {
      console.log(`[RECEIVE] game:join_room from ${socket.id}`, payload);
      RoomManager.handleJoinRoom(socket, payload.roomId, payload.playerName);
    });

    /**
     * Handle: game:start { roomId }
     */
    socket.on("game:start", (payload: StartGamePayload) => {
      console.log(`[RECEIVE] game:start from ${socket.id}`, payload);
      RoomManager.handleStartGame(socket, payload.roomId);
    });

    /**
     * Handle: game:leave { roomId }
     */
    socket.on("game:leave", (payload: { roomId: string }) => {
      console.log(`[RECEIVE] game:leave from ${socket.id}`, payload);
      RoomManager.handleLeaveRoom(socket, payload.roomId);
    });

    // ========================================================================
    // CONNECTION EVENTS
    // ========================================================================

    socket.on("disconnect", () => {
      console.log("[SOCKET] ❌ User disconnected:", socket.id);
      RoomManager.handleDisconnect(socket);
    });

    socket.on("error", (error) => {
      console.error("[SOCKET] ⚠️ Socket error:", error);
    });
  });

  console.log("[SOCKET] Socket.IO initialized with CORS");
};

export const getIO = () => io;
