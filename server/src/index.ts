import http from "http";
import app from "./app";
import { initSocket } from "./socket";

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  🎴 Card Game Server                                     ║
║  Running on port ${PORT}                            ║
║  Socket.IO ready for connections                        ║
║  Frontend: http://localhost:5173                        ║
╚══════════════════════════════════════════════════════════╝
  `);
});