export interface Player {
  id: string;
  name: string;
  isReady?: boolean;
  status?: "waiting" | "playing" | "finished";
}
