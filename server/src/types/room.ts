export interface GameState {
  roomId: string;
  status: "waiting" | "playing" | "finished";
  round?: number;
  phase?: string;
  currentPlayer?: string;
  data?: Record<string, any>;
}

export interface Room {
  id: string;
  players: PlayerPublic[];
  gameState: GameState | null;
  started: boolean;
  createdAt: number;
}

import type { PlayerPublic } from "./player";
