import { useState, useCallback } from "react";
import type { Player, GameState as GameStateType } from "../types";

interface GameStoreType {
  roomId: string | null;
  playerName: string | null;
  players: Player[];
  gameState: GameStateType | null;
  lastEvent: string;
  isConnected: boolean;
  setRoomId: (id: string | null) => void;
  setPlayerName: (name: string | null) => void;
  setPlayers: (p: Player[]) => void;
  setGameState: (s: GameStateType | null) => void;
  setLastEvent: (e: string) => void;
  setIsConnected: (connected: boolean) => void;
  reset: () => void;
}

export const useGameStore = (): GameStoreType => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [lastEvent, setLastEvent] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const reset = useCallback(() => {
    setRoomId(null);
    setPlayerName(null);
    setPlayers([]);
    setGameState(null);
    setLastEvent("");
    setIsConnected(false);
  }, []);

  return {
    roomId,
    playerName,
    players,
    gameState,
    lastEvent,
    isConnected,
    setRoomId,
    setPlayerName,
    setPlayers,
    setGameState,
    setLastEvent,
    setIsConnected,
    reset,
  };
};