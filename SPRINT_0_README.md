# Sprint 0: Frontend Setup

## 🎯 Objective
Sprint 0 establishes the foundational frontend structure for a real-time multiplayer card game with socket.io integration, routing, and state management.

## ✅ What's Implemented

### 1. Socket Layer (`src/socket/socket.ts`)
- **Singleton pattern** ensures only one socket connection exists
- Auto-connects to `http://localhost:5001` (configurable via `VITE_SOCKET_URL`)
- Built-in reconnection logic with exponential backoff
- Comprehensive console logging for debugging (`[SOCKET]` prefix)

### 2. Socket Events Wrapper (`src/socket/events.ts`)
Provides typed, easy-to-use event handlers:

**Emit Events:**
- `emitJoinRoom(roomId, playerName)` - Join a game room
- `emitStartGame(roomId)` - Start the game
- `emitLeaveRoom(roomId)` - Leave the room

**Listen Events (return unsubscribe functions):**
- `onRoomUpdate(callback)` - Listen for player/room changes
- `onGameStateUpdate(callback)` - Listen for game state updates
- `onGameEnd(callback)` - Listen for game end event
- `onError(callback)` - Listen for errors

All events log to console with `[RECEIVE]` prefix for easy debugging.

### 3. State Store (`src/store/gameStore.ts`)
Simple, hook-based state management with:
- `roomId`, `playerName`, `players[]`, `gameState`, `lastEvent`, `isConnected`
- Setters for each state property
- `reset()` to clear all state

Usage:
```tsx
const { roomId, players, setRoomId } = useGameStore();
```

### 4. Routing
Routes configured in `src/App.tsx`:
- `/` → Home page
- `/lobby/:roomId` → Lobby (wait for players)
- `/game/:roomId` → Game page

### 5. Pages

#### Home (`/`)
- Input: Player name + Room ID
- Actions: Join existing room or generate new room code
- Emits socket event to join room
- Navigates to lobby

#### Lobby (`/lobby/:roomId`)
- Listens to `game:room_update` events
- Shows live player list
- "Start Game" button (min 2 players)
- Auto-navigates to game when it starts
- Leave button returns to home

#### Game (`/game/:roomId`)
- Listens to `game:state_update` events
- Displays current game state (round, phase, etc.)
- Shows list of active players
- **Debug Panel** (collapsible):
  - Connection status
  - Last event received
  - Raw game state JSON
  - Player count
  - Instructions for testing

### 6. Testing Features
- ✅ Console logs with prefixes: `[SOCKET]`, `[RECEIVE]`, `[EMIT]`, `[LOBBY]`, `[GAME]`
- ✅ Visible debug panel in Game page with game state JSON
- ✅ Designed for multi-tab testing (open 2 browser tabs, same room)

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Connect to Backend
Update `VITE_SOCKET_URL` if backend is on different port:
```bash
# In .env
VITE_SOCKET_URL=http://localhost:5001
```

## 📋 Expected Socket Events (from Backend)

The frontend expects these events from the server:

```typescript
// Room update
socket.on('game:room_update', {
  roomId: string;
  players: Array<{ id, name, status }>;
  gameState: { status, round, phase, ... } | null;
})

// Game state update
socket.on('game:state_update', {
  gameState: { roomId, status, round, phase, currentPlayer, ... };
  lastAction?: string;
})

// Game end
socket.on('game:end', {
  winner?: string;
  results?: any;
})

// Errors
socket.on('error', errorMessage: string)
```

## 🧪 Testing Workflow

1. **Start backend** on `http://localhost:5001`
2. **Start frontend** with `npm run dev`
3. **Open two browser tabs** at `http://localhost:5173`
4. **Tab 1:** Enter name "Player 1", room code "TEST123", click Join
5. **Tab 2:** Enter name "Player 2", room code "TEST123", click Join
6. **Verify:** Both tabs should show players in lobby
7. **Start Game:** Click "Start Game" button
8. **Check Debug Panel:** Game state should update in real-time
9. **Open Console:** Should see detailed socket event logs

## 📁 File Structure

```
src/
├── socket/
│   ├── socket.ts           # Singleton socket connection
│   └── events.ts           # Event wrappers with logging
├── store/
│   └── gameStore.ts        # State management hook
├── types/
│   ├── player.ts
│   ├── game.ts
│   └── index.ts            # Re-exports
├── config/
│   └── env.ts              # Environment configuration
├── pages/
│   ├── Home/
│   ├── Lobby/
│   ├── Game/
│   └── NotFound/
├── context/
│   ├── GameContext.tsx
│   └── SocketContext.tsx
├── App.tsx                 # Routes
└── main.tsx               # Entry point
```

## 🔍 Debug Tips

1. **Check Browser Console** - All socket events logged with prefixes
2. **Game Page Debug Panel** - Shows raw game state JSON in real-time
3. **Room State** - Displays live player list
4. **Network Tab** - Monitor WebSocket connection
5. **Test Multiple Tabs** - Verify real-time updates across clients

## ⚠️ Important Notes

- ✅ **No game logic on frontend** - All validation and game rules are server-side
- ✅ **Singleton socket** - Only one connection per app instance
- ✅ **Proper cleanup** - Event listeners unsubscribe on component unmount
- ✅ **TypeScript strict mode** - No `any` types
- ✅ **Zero new dependencies** - Uses only existing: React, React Router, Socket.io-client

## 🚧 Next Steps (Future Sprints)

1. **Sprint 1:** Implement actual game logic components (cards UI, etc.)
2. **Sprint 2:** Add game mechanics (betting, card play, scoring)
3. **Sprint 3:** Add animations and sound effects
4. **Sprint 4:** Polish and optimize performance

---

**Sprint 0 Goal:** ✅ Two clients can join same room, see live updates, with stable socket connection and visible debug information.
