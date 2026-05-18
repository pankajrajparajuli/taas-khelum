import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Lobby from "./pages/Lobby/Lobby";
import Game from "./pages/Game/Game";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby/:roomId" element={<Lobby />} />
      <Route path="/game/:roomId" element={<Game />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;