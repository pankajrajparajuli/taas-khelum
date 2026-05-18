// This file is kept for backward compatibility
// All socket event handlers are now in events.ts

export { emitJoinRoom, emitStartGame, emitLeaveRoom, onRoomUpdate, onGameStateUpdate as onGameState, onError, onGameEnd } from "./events";
