# Sprint 0 Backend Documentation

## 🎯 Overview

Sprint 0 backend provides a real-time multiplayer game server with socket.io for managing rooms, players, and game state. This is a stateless, in-memory implementation suitable for development and testing.

## 🏗️ Architecture

### Directory Structure

```
server/src/
├── index.ts                    # Server entry point
├── app.ts                      # Express app setup
├── types/
│   ├── player.ts              # Player type definitions
│   ├── room.ts                # Room and GameState types
│   └── socket.ts              # Socket event payloads
├── rooms/
│   ├── roomStore.ts           # In-memory room storage
│   └── roomManager.ts         # Room event handlers
└── socket/
    └── index.ts               # Socket.IO initialization & event listeners
```

## 📡 Socket Events

### Client → Server (Emits)

#### `game:join` / `game:join_room`
Join a game room
```typescript
socket.emit('game:join', {
  roomId: string;
  playerName: string;
});
```

#### `game:start`
Start the game (requires 2+ players)
```typescript
socket.emit('game:start', {
  roomId: string;
});
```

#### `game:leave`
Leave a room
```typescript
socket.emit('game:leave', {
  roomId: string;
});
```

### Server → Client (Broadcasts)

#### `game:room_update`
Sent when a player joins/leaves a room
```typescript
{
  roomId: string;
  players: Array<{
    id: string;
    name: string;
    status: "waiting" | "playing" | "finished";
    joinedAt: number;
  }>;
  gameState: GameState | null;
}
```

#### `game:state_update`
Sent when game state changes (e.g., game starts)
```typescript
{
  gameState: {
    roomId: string;
    status: "waiting" | "playing" | "finished";
    round?: number;
    phase?: string;
    currentPlayer?: string;
    data?: Record<string, any>;
  };
  lastAction?: string;
}
```

#### `error`
Sent on error (e.g., room not found, not enough players)
```typescript
socket.emit('error', errorMessage: string);
```

## 💾 Room Storage (In-Memory)

The `RoomStore` class manages all active rooms using a Map-based structure:

```
roomId → {
  id: string;
  players: Map<socketId, Player>;
  gameState: GameState | null;
  started: boolean;
  createdAt: number;
}
```

### Key Methods

- `createRoom(roomId)` - Create a new room
- `getOrCreateRoom(roomId)` - Get or create a room
- `addPlayer(roomId, player)` - Add player to room
- `removePlayer(roomId, socketId)` - Remove player from room
- `getPlayers(roomId)` - Get all players (public format)
- `setGameState(roomId, gameState)` - Update game state
- `startGame(roomId)` - Mark game as started

**Auto-cleanup:** Rooms are automatically deleted when the last player leaves.

## 🎮 Game Flow

### Step 1: Player Joins Room
```
Client: emit('game:join', { roomId: 'ABC123', playerName: 'Alice' })
  ↓
Server: Adds player to room
Server: Broadcasts game:room_update to all in room
  ↓
Client: Receives { players: [Alice], gameState: null }
```

### Step 2: Second Player Joins
```
Client 2: emit('game:join', { roomId: 'ABC123', playerName: 'Bob' })
  ↓
Server: Adds player to room
Server: Broadcasts game:room_update to all in room
  ↓
All Clients: Receive { players: [Alice, Bob], gameState: null }
```

### Step 3: Start Game
```
Client 1: emit('game:start', { roomId: 'ABC123' })
  ↓
Server: Validates 2+ players exist
Server: Creates GameState with status='playing'
Server: Broadcasts game:state_update to all in room
  ↓
All Clients: Receive { gameState: { status: 'playing', round: 1, ... } }
```

## 🔍 Logging

All socket events and room changes are logged with prefixes:

- `[SOCKET]` - Connection/disconnection events
- `[RECEIVE]` - Incoming socket events
- `[EMIT]` - Outgoing broadcasts
- `[ROOM]` - Room state changes
- `[GAME]` - Game logic events
- `[ERROR]` - Errors

Example output:
```
[SOCKET] ✅ User connected: abc123def
[RECEIVE] game:join from abc123def { roomId: 'TEST', playerName: 'Alice' }
[ROOM] Created room: TEST
[ROOM] Player joined: Alice (abc123def) in room TEST. Total: 1
[EMIT] game:room_update to room TEST { playersCount: 1 }
```

## 🚀 Getting Started

### Start Server
```bash
cd server
npm install
npm run dev
```

Server will start on `http://localhost:5001` with Socket.IO ready.

### Connect Frontend
Frontend automatically connects to `http://localhost:5001` (configured in `client/src/config/env.ts`).

Change via environment variable:
```bash
VITE_SOCKET_URL=http://localhost:5000 npm run dev
```

## 🧪 Manual Testing

### Using Socket.IO Admin UI (Optional)

1. Install: `npm install @socket.io/admin-ui`
2. Add to server initialization
3. Access: `http://localhost:5001/admin`

### Using Browser Console

```javascript
// Connect to socket
const socket = io('http://localhost:5001');

// Join room
socket.emit('game:join', { 
  roomId: 'TEST123', 
  playerName: 'TestPlayer' 
});

// Listen for updates
socket.on('game:room_update', (data) => {
  console.log('Room update:', data);
});

// Start game
socket.emit('game:start', { roomId: 'TEST123' });
```

## 📊 Multi-Client Testing

1. **Tab 1:** Go to `http://localhost:5173`
2. **Tab 2:** Go to `http://localhost:5173`
3. **Tab 1:** Enter name "Player 1", room "ABC", click Join
4. **Tab 2:** Enter name "Player 2", room "ABC", click Join
5. **Verify:** Both tabs show updated player list
6. **Tab 1:** Click "Start Game"
7. **Verify:** Both tabs navigate to game page with state update

## 🔒 CORS Configuration

CORS is enabled for development at:
- `http://localhost:5173` (Vite frontend)
- `http://localhost:3000` (alternative)
- `*` (wildcard for development)

For production, restrict to specific origins:
```typescript
cors: {
  origin: ['https://yourdomain.com'],
  methods: ['GET', 'POST'],
}
```

## 📝 Type Definitions

### Player
```typescript
interface Player {
  id: string;              // Same as socketId for now
  name: string;           // Player's display name
  socketId: string;       // Socket.IO socket ID
  status: "waiting" | "playing" | "finished";
  joinedAt: number;       // Timestamp
}
```

### Room
```typescript
interface Room {
  id: string;
  players: PlayerPublic[];  // Public player data
  gameState: GameState | null;
  started: boolean;
  createdAt: number;
}
```

### GameState
```typescript
interface GameState {
  roomId: string;
  status: "waiting" | "playing" | "finished";
  round?: number;
  phase?: string;
  currentPlayer?: string;
  data?: Record<string, any>;
}
```

## 🚧 Limitations (Sprint 0)

- ✅ In-memory storage (no database)
- ✅ No player authentication
- ✅ No game logic (backend only manages state)
- ✅ No persistence on server restart
- ✅ No private messaging
- ✅ No spectator mode

## 🔄 Future Improvements (Sprint 1+)

- [ ] Add actual game logic handlers
- [ ] Persist game history to database
- [ ] Add player authentication/accounts
- [ ] Implement game rules validation
- [ ] Add chat system
- [ ] Add spectator support
- [ ] Add reconnection handling
- [ ] Add match statistics

## 🐛 Debugging

### Enable verbose logging
```bash
DEBUG=* npm run dev
```

### Check active rooms (via endpoint - not yet implemented)
```bash
curl http://localhost:5001/debug/rooms
```

### Monitor socket connections
```javascript
io.of("/").sockets.forEach((socket) => {
  console.log(socket.id);
});
```

## 📦 Dependencies Used

- `express` - Web framework
- `cors` - CORS middleware
- `socket.io` - Real-time communication
- `typescript` - Type safety
- `ts-node-dev` - Dev server with hot reload

No database, authentication, or game-specific libraries in Sprint 0.

---

**Sprint 0 Status:** ✅ Complete and Ready for Integration
