import { Socket } from "socket.io";
import { roomStore } from "./roomStore";
import type { Player } from "../types/player";
import type { GameState } from "../types/room";

export class RoomManager {
  /**
   * Handle player joining a room
   */
  static handleJoinRoom(socket: Socket, roomId: string, playerName: string) {
    console.log(`[GAME] Player ${playerName} attempting to join room ${roomId}`);

    // Create/get room
    const room = roomStore.getOrCreateRoom(roomId);

    // Create player
    const player: Player = {
      id: socket.id,
      name: playerName,
      socketId: socket.id,
      status: "waiting",
      joinedAt: Date.now(),
    };

    // Add to room
    roomStore.addPlayer(roomId, player);

    // Join socket to room namespace
    socket.join(`room:${roomId}`);

    // Get updated players list
    const players = roomStore.getPlayers(roomId);
    const gameState = roomStore.getGameState(roomId);

    // Emit room update to all in room
    socket.to(`room:${roomId}`).emit("game:room_update", {
      roomId,
      players,
      gameState,
    });

    // Also emit to the joining player
    socket.emit("game:room_update", {
      roomId,
      players,
      gameState,
    });

    console.log(`[EMIT] game:room_update to room ${roomId}`, {
      playersCount: players.length,
    });
  }

  /**
   * Handle game start
   */
  static handleStartGame(socket: Socket, roomId: string) {
    console.log(`[GAME] Start game requested for room ${roomId}`);

    const room = roomStore.getRoom(roomId);
    if (!room) {
      console.error(`[ERROR] Room ${roomId} not found`);
      socket.emit("error", "Room not found");
      return;
    }

    const playerIds = Array.from(room.players.keys());

    if (playerIds.length < 2) {
      console.error(`[ERROR] Not enough players in room ${roomId}`);
      socket.emit("error", "Need at least 2 players to start");
      return;
    }

    // Initialize game state
    const gameState: GameState = {
      roomId,
      status: "playing",
      round: 1,
      phase: "deal",
      currentPlayer: playerIds[0]!,     // Non-null assertion (safe because we checked length)
      data: {},
    };

    roomStore.setGameState(roomId, gameState);
    roomStore.startGame(roomId);

    // Broadcast game state update to all in room
    const payload = { gameState };

    socket.to(`room:${roomId}`).emit("game:state_update", payload);
    socket.emit("game:state_update", payload);

    console.log(`[EMIT] game:state_update to room ${roomId}`, gameState);
  }

  /**
   * Handle player leaving room
   */
  static handleLeaveRoom(socket: Socket, roomId: string) {
    console.log(`[GAME] Player ${socket.id} leaving room ${roomId}`);

    roomStore.removePlayer(roomId, socket.id);
    socket.leave(`room:${roomId}`);

    // Notify remaining players
    const players = roomStore.getPlayers(roomId);
    if (players.length > 0) {
      socket.to(`room:${roomId}`).emit("game:room_update", {
        roomId,
        players,
        gameState: roomStore.getGameState(roomId),
      });

      console.log(`[EMIT] game:room_update to room ${roomId} (player left)`, {
        playersCount: players.length,
      });
    }
  }

  /**
   * Handle disconnection
   */
  static handleDisconnect(socket: Socket) {
    console.log(`[SOCKET] Disconnecting ${socket.id}`);

    const rooms = Array.from(socket.rooms);
    for (const socketRoom of rooms) {
      const roomId = socketRoom.replace("room:", "");
      if (roomId && roomId !== socket.id) {
        RoomManager.handleLeaveRoom(socket, roomId);
      }
    }
  }
}