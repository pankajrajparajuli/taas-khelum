import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { onRoomUpdate, emitStartGame } from "../../socket/events";

export default function Lobby() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { players, setPlayers, setGameState } = useGameStore();
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!roomId) {
      navigate("/");
      return;
    }

    console.log("[LOBBY] Mounted, listening for room updates");

    // Subscribe to room updates
    const unsubscribe = onRoomUpdate((data) => {
      setPlayers(data.players);
      if (data.gameState) {
        setGameState(data.gameState);
        // Auto-navigate to game when it starts
        if (data.gameState.status === "playing") {
          navigate(`/game/${roomId}`);
        }
      }
    });

    return () => {
      console.log("[LOBBY] Unmounted, unsubscribing");
      unsubscribe();
    };
  }, [roomId, navigate, setPlayers, setGameState]);

  const handleStartGame = () => {
    if (!roomId) return;
    setIsStarting(true);
    console.log("[LOBBY] Starting game...");
    emitStartGame(roomId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-green-500/30 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">🎴 Lobby</h1>
          <p className="text-green-300">
            Room: <span className="font-mono font-bold text-yellow-400">{roomId}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Players Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-green-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            👥 Players ({players.length})
          </h2>

          {players.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-300">Waiting for players to join...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-gradient-to-r from-green-600/30 to-green-700/30 border border-green-400/50 rounded-lg p-4"
                >
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-sm text-green-200">
                    ID: <span className="font-mono">{player.id.slice(0, 8)}</span>
                  </p>
                  <p className="text-xs text-yellow-300 mt-2">
                    Status: {player.status || "waiting"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleStartGame}
            disabled={isStarting || players.length < 2}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition transform hover:scale-105"
          >
            {isStarting ? "Starting..." : "Start Game"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-red-600/40 hover:bg-red-600/60 border border-red-400 text-white font-semibold rounded-lg transition"
          >
            Leave
          </button>
        </div>

        {/* Debug Info */}
        <div className="bg-black/30 rounded-lg p-4 border border-green-500/20">
          <p className="text-xs text-gray-400 font-mono space-y-1">
            <div>
              <span className="text-green-400">Room ID:</span> {roomId}
            </div>
            <div>
              <span className="text-green-400">Players Connected:</span> {players.length}
            </div>
            <div>
              <span className="text-green-400">Minimum to start:</span> 2
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}