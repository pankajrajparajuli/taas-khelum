import { create } from "zustand";

type GameState = {
  roomId: string | null;
  playerName: string;
  players: any[];
  gameState: any;
  lastEvent: string;
  setRoomId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setPlayers: (p: any[]) => void;
  setGameState: (s: any) => void;
  setLastEvent: (e: string) => void;
};

export const useGameStore = create<GameState>((set) => ({
  roomId: null,
  playerName: "",
  players: [],
  gameState: null,
  lastEvent: "",

  setRoomId: (id) => set({ roomId: id }),
  setPlayerName: (name) => set({ playerName: name }),
  setPlayers: (p) => set({ players: p }),
  setGameState: (s) => set({ gameState: s }),
  setLastEvent: (e) => set({ lastEvent: e }),
}));