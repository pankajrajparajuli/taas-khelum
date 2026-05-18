import { useParams } from "react-router-dom";

export default function Game() {
  const { roomId } = useParams();

  return (
    <div className="h-screen bg-green-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl">Game Room: {roomId}</h1>

      <p className="mt-4">🎴 Game Engine will attach here (Phaser/Canvas)</p>
    </div>
  );
}