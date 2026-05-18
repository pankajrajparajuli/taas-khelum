import { createContext, useContext, useState } from "react";

type GameContextType = {
  roomId: string | null;
  setRoomId: (id: string | null) => void;
};

const GameContext = createContext<GameContextType>({
  roomId: null,
  setRoomId: () => {},
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [roomId, setRoomId] = useState<string | null>(null);

  return (
    <GameContext.Provider value={{ roomId, setRoomId }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);