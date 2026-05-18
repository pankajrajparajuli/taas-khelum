import { socketService } from "./socket";

export const emitJoinRoom = (roomId: string, playerName: string) => {
  const socket = socketService.getSocket();
  socket.emit("game:join_room", { roomId, playerName });
};

export const emitStartGame = (roomId: string) => {
  const socket = socketService.getSocket();
  socket.emit("game:start", { roomId });
};

export const onRoomUpdate = (cb: (data: any) => void) => {
  const socket = socketService.getSocket();
  socket.on("game:room_update", cb);
};

export const onGameState = (cb: (data: any) => void) => {
  const socket = socketService.getSocket();
  socket.on("game:state_update", cb);
};