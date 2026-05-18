export interface GameState {
  roomId: string;
  status: "waiting" | "playing" | "finished";
  currentPlayer?: string;
  round?: number;
  phase?: string;
  data?: Record<string, any>;
}
