import type { Player, PlayerPublic } from "../types/player";
import type { Room, GameState } from "../types/room";

interface InternalRoom {
  id: string;
  players: Map<string, Player>; // socketId -> Player
  gameState: GameState | null;
  started: boolean;
  createdAt: number;
}

class RoomStore {
  private rooms: Map<string, InternalRoom> = new Map();

  /**
   * Create a new room
   */
  createRoom(roomId: string): InternalRoom {
    const room: InternalRoom = {
      id: roomId,
      players: new Map(),
      gameState: null,
      started: false,
      createdAt: Date.now(),
    };
    this.rooms.set(roomId, room);
    console.log(`[ROOM] Created room: ${roomId}`);
    return room;
  }

  /**
   * Get or create a room
   */
  getOrCreateRoom(roomId: string): InternalRoom {
    if (!this.rooms.has(roomId)) {
      return this.createRoom(roomId);
    }
    return this.rooms.get(roomId)!;
  }

  /**
   * Get a room
   */
  getRoom(roomId: string): InternalRoom | null {
    return this.rooms.get(roomId) || null;
  }

  /**
   * Add player to room
   */
  addPlayer(roomId: string, player: Player): void {
    const room = this.getOrCreateRoom(roomId);
    room.players.set(player.socketId, player);
    console.log(
      `[ROOM] Player joined: ${player.name} (${player.socketId}) in room ${roomId}. Total: ${room.players.size}`
    );
  }

  /**
   * Remove player from room
   */
  removePlayer(roomId: string, socketId: string): boolean {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const player = room.players.get(socketId);
    if (player) {
      room.players.delete(socketId);
      console.log(
        `[ROOM] Player left: ${player.name} (${socketId}) from room ${roomId}. Total: ${room.players.size}`
      );

      // Delete room if empty
      if (room.players.size === 0) {
        this.rooms.delete(roomId);
        console.log(`[ROOM] Deleted empty room: ${roomId}`);
      }

      return true;
    }
    return false;
  }

  /**
   * Get all players in a room (public format)
   */
  getPlayers(roomId: string): PlayerPublic[] {
    const room = this.getRoom(roomId);
    if (!room) return [];

    return Array.from(room.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      joinedAt: p.joinedAt,
    }));
  }

  /**
   * Get player by socket ID
   */
  getPlayer(roomId: string, socketId: string): Player | null {
    const room = this.getRoom(roomId);
    if (!room) return null;
    return room.players.get(socketId) || null;
  }

  /**
   * Update game state
   */
  setGameState(roomId: string, gameState: GameState): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.gameState = gameState;
      console.log(`[ROOM] Updated game state in room ${roomId}`);
    }
  }

  /**
   * Get game state
   */
  getGameState(roomId: string): GameState | null {
    const room = this.getRoom(roomId);
    return room?.gameState || null;
  }

  /**
   * Mark room as started
   */
  startGame(roomId: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.started = true;
      console.log(`[ROOM] Game started in room ${roomId}`);
    }
  }

  /**
   * Check if room exists
   */
  roomExists(roomId: string): boolean {
    return this.rooms.has(roomId);
  }

  /**
   * Get room state for export (for debugging)
   */
  getPublicRoom(roomId: string): Room | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    return {
      id: room.id,
      players: this.getPlayers(roomId),
      gameState: room.gameState,
      started: room.started,
      createdAt: room.createdAt,
    };
  }
}

export const roomStore = new RoomStore();
