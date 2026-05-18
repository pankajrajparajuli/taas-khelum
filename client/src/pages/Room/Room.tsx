import { useParams, useNavigate } from "react-router-dom";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const joinGame = () => {
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-2xl">Room ID: {roomId}</h2>

      <button
        onClick={joinGame}
        className="mt-4 px-5 py-2 bg-blue-500 rounded"
      >
        Join Game
      </button>
    </div>
  );
}