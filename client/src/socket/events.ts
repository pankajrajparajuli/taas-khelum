import { getSocket } from "./socket";
import type { Player, GameState } from "../types";

// ============================================================================
// EMIT EVENTS
// ============================================================================

export const emitJoinRoom = (roomId: string, playerName: string): void => {
  const socket = getSocket();
  console.log(`[EMIT] Joining room: ${roomId} as ${playerName}`);
  socket.emit("game:join", { roomId, playerName });
};

export const emitStartGame = (roomId: string): void => {
  const socket = getSocket();
  console.log(`[EMIT] Starting game in room: ${roomId}`);
  socket.emit("game:start", { roomId });
};

export const emitLeaveRoom = (roomId: string): void => {
  const socket = getSocket();
  console.log(`[EMIT] Leaving room: ${roomId}`);
  socket.emit("game:leave", { roomId });
};

// ============================================================================
// LISTEN EVENTS
// ============================================================================

type RoomUpdateCallback = (data: {
  roomId: string;
  players: Player[];
  gameState: GameState | null;
}) => void;

type GameStateCallback = (data: {
  gameState: GameState;
  lastAction?: string;
}) => void;

type ErrorCallback = (error: string) => void;

export const onRoomUpdate = (callback: RoomUpdateCallback): (() => void) => {
  const socket = getSocket();
  const handler = (data: any) => {
    console.log("[RECEIVE] Room update:", data);
    callback(data);
  };
  socket.on("game:room_update", handler);

  // Return unsubscribe function
  return () => {
    socket.off("game:room_update", handler);
  };
};

export const onGameStateUpdate = (
  callback: GameStateCallback
): (() => void) => {
  const socket = getSocket();
  const handler = (data: any) => {
    console.log("[RECEIVE] Game state update:", data);
    callback(data);
  };
  socket.on("game:state_update", handler);

  // Return unsubscribe function
  return () => {
    socket.off("game:state_update", handler);
  };
};

export const onError = (callback: ErrorCallback): (() => void) => {
  const socket = getSocket();
  const handler = (error: string) => {
    console.error("[RECEIVE] Error:", error);
    callback(error);
  };
  socket.on("error", handler);

  // Return unsubscribe function
  return () => {
    socket.off("error", handler);
  };
};

export const onGameEnd = (callback: (data: any) => void): (() => void) => {
  const socket = getSocket();
  const handler = (data: any) => {
    console.log("[RECEIVE] Game ended:", data);
    callback(data);
  };
  socket.on("game:end", handler);

  // Return unsubscribe function
  return () => {
    socket.off("game:end", handler);
  };
};
