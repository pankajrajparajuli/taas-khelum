import express from "express";
import cors from "cors";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.json({
    message: "Card Game API 🎴",
    status: "running",
    socketUrl: `http://localhost:${process.env.PORT || 5001}`,
  });
});

/**
 * Debug endpoint to check active rooms
 */
app.get("/debug/rooms", (req, res) => {
  // This can be implemented later for debugging
  res.json({ message: "Room debug endpoint - not yet implemented" });
});

export default app;