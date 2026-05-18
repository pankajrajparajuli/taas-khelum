import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { emitJoinRoom } from "../../socket/events";

export default function Home() {
  const navigate = useNavigate();
  const { setPlayerName, setRoomId } = useGameStore();
  const [playerName, setLocalPlayerName] = useState("");
  const [roomId, setLocalRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      alert("Please enter both name and room ID");
      return;
    }

    setIsLoading(true);
    setPlayerName(playerName);
    setRoomId(roomId);

    // Emit join event to socket
    emitJoinRoom(roomId, playerName);

    // Navigate to lobby
    setTimeout(() => {
      navigate(`/lobby/${roomId}`);
    }, 500);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setLocalRoomId(newRoomId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-black">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎴 Card Arena</h1>
          <p className="text-green-200">Sprint 0 - Join a Game</p>
        </div>

        <div className="space-y-4">
          {/* Player Name Input */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setLocalPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-white/20 border border-green-400 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-green-300 focus:bg-white/30"
            />
          </div>

          {/* Room ID Input */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Room ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setLocalRoomId(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter room code"
                className="flex-1 px-4 py-3 bg-white/20 border border-green-400 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-green-300 focus:bg-white/30 font-mono"
              />
              <button
                onClick={handleCreateRoom}
                className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition"
              >
                New
              </button>
            </div>
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinRoom}
            disabled={isLoading || !playerName.trim() || !roomId.trim()}
            className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition transform hover:scale-105"
          >
            {isLoading ? "Joining..." : "Join Game"}
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-black/30 rounded-lg">
          <p className="text-xs text-gray-400 font-mono">
            <span className="text-green-400">Server:</span> localhost:5001
          </p>
        </div>
      </div>
    </div>
  );
}