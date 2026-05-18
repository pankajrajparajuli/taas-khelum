export interface JoinRoomPayload {
  roomId: string;
  playerName: string;
}

export interface StartGamePayload {
  roomId: string;
}

export interface RoomUpdatePayload {
  roomId: string;
  players: any[];
  gameState: any | null;
}

export interface GameStateUpdatePayload {
  gameState: any;
  lastAction?: string;
}
