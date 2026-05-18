import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 7);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-green-900 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">🎴 Card Game Arena</h1>

        <button
          onClick={createRoom}
          className="px-6 py-3 bg-yellow-500 text-black rounded-xl"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}