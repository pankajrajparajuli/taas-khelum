export interface Player {
  id: string;
  name: string;
  socketId: string;
  status: "waiting" | "playing" | "finished";
  joinedAt: number;
}

export type PlayerPublic = Omit<Player, "socketId">;
