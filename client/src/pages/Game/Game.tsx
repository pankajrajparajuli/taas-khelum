import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { onGameStateUpdate, onGameEnd } from "../../socket/events";

export default function Game() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { gameState, setGameState, setLastEvent, players, lastEvent } = useGameStore();
  const [isGameActive, setIsGameActive] = useState(true);
  const [debugExpanded, setDebugExpanded] = useState(true);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    console.log("[GAME] Mounted, listening for game state updates");

    // Subscribe to game state updates
    const unsubscribeState = onGameStateUpdate((data) => {
      console.log("[GAME] State update received:", data);
      setGameState(data.gameState);
      setLastEvent(`${new Date().toLocaleTimeString()} - State Update`);
    });

    // Subscribe to game end event
    const unsubscribeEnd = onGameEnd((data) => {
      console.log("[GAME] Game ended:", data);
      setLastEvent(`${new Date().toLocaleTimeString()} - Game Ended`);
      setIsGameActive(false);
    });

    return () => {
      console.log("[GAME] Unmounted, unsubscribing");
      unsubscribeState();
      unsubscribeEnd();
    };
  }, [roomId, navigate, setGameState, setLastEvent]);

  const handleBackToLobby = () => {
    navigate(`/lobby/${roomId}`);
  };

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-green-500/30 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🎮 Game</h1>
            <p className="text-green-300 text-sm">
              Room: <span className="font-mono font-bold text-yellow-400">{roomId}</span>
              {!isGameActive && <span className="ml-4 text-red-400">GAME ENDED</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBackToLobby}
              className="px-4 py-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400 text-white font-semibold rounded-lg transition"
            >
              Back to Lobby
            </button>
            <button
              onClick={handleLeave}
              className="px-4 py-2 bg-red-600/40 hover:bg-red-600/60 border border-red-400 text-white font-semibold rounded-lg transition"
            >
              Leave
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Canvas Area */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-b from-green-800/40 to-green-900/40 border border-green-500/30 rounded-xl p-8 h-96 flex flex-col items-center justify-center">
              {gameState ? (
                <div className="text-center">
                  <p className="text-6xl mb-4">🃏</p>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {gameState.status === "playing" ? "Game In Progress" : "Game Ready"}
                  </h2>
                  <p className="text-green-300">
                    Round {gameState.round ?? "-"} • Phase: {gameState.phase ?? "-"}
                  </p>
                  {gameState.currentPlayer && (
                    <p className="text-yellow-300 mt-2">
                      Current: {gameState.currentPlayer}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400">Waiting for game state...</p>
                </div>
              )}
            </div>

            {/* Players Info */}
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-green-500/20">
              <h3 className="text-lg font-bold text-white mb-3">Players in Game</h3>
              <div className="grid grid-cols-2 gap-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-green-600/20 border border-green-400/30 rounded-lg p-3"
                  >
                    <p className="text-white font-semibold text-sm">{player.name}</p>
                    <p className="text-xs text-green-300">{player.status || "playing"}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Debug Panel - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-black/40 border border-green-500/30 rounded-xl overflow-hidden sticky top-4">
              {/* Debug Header */}
              <div
                onClick={() => setDebugExpanded(!debugExpanded)}
                className="bg-black/60 p-4 cursor-pointer hover:bg-black/80 transition border-b border-green-500/20"
              >
                <h3 className="text-lg font-bold text-green-400 flex items-center justify-between">
                  🐛 Debug Panel
                  <span className="text-sm text-gray-400">
                    {debugExpanded ? "▼" : "▶"}
                  </span>
                </h3>
              </div>

              {/* Debug Content */}
              {debugExpanded && (
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {/* Connection Status */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <p className="text-white text-sm font-mono">Connected</p>
                    </div>
                  </div>

                  {/* Last Event */}
                  <div className="border-t border-green-500/20 pt-4">
                    <p className="text-xs text-gray-400 mb-2">Last Event</p>
                    <div className="bg-black/30 p-2 rounded text-xs text-yellow-300 font-mono break-words">
                      {lastEvent || "Waiting..."}
                    </div>
                  </div>

                  {/* Game State JSON */}
                  <div className="border-t border-green-500/20 pt-4">
                    <p className="text-xs text-gray-400 mb-2">Game State</p>
                    <div className="bg-black/50 p-2 rounded text-xs text-green-300 font-mono overflow-x-auto max-h-40 overflow-y-auto">
                      <pre>
                        {gameState
                          ? JSON.stringify(gameState, null, 2)
                          : "null"}
                      </pre>
                    </div>
                  </div>

                  {/* Players Count */}
                  <div className="border-t border-green-500/20 pt-4">
                    <p className="text-xs text-gray-400 mb-2">Players</p>
                    <p className="text-white text-sm font-mono">
                      {players.length} connected
                    </p>
                  </div>

                  {/* Console Log Note */}
                  <div className="border-t border-green-500/20 pt-4 text-xs text-gray-500">
                    📌 Check browser console for detailed socket events
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-4 bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-200">
                💡 <strong>Tip:</strong> Open another browser tab, join same room to test real-time
                updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}