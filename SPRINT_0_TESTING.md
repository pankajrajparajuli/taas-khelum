# Sprint 0 - Integration Testing & Checklist

## ✅ Pre-Flight Checklist

### Backend Setup
- [ ] Node.js 18+ installed
- [ ] Server dependencies installed: `npm install` in `/server`
- [ ] TypeScript compiles: `npm run build`
- [ ] No type errors: `npx tsc --noEmit`

### Frontend Setup
- [ ] Frontend dependencies installed: `npm install` in `/client`
- [ ] TypeScript compiles: `npm run build`
- [ ] No type errors: `npx tsc --noEmit`
- [ ] Frontend configured to connect to `http://localhost:5001`

## 🚀 Startup Sequence

### Terminal 1: Start Backend
```bash
cd server
npm run dev
```

Expected output:
```
╔══════════════════════════════════════════════════════════╗
║  🎴 Card Game Server                                     ║
║  Running on port 5001                            ║
║  Socket.IO ready for connections                        ║
║  Frontend: http://localhost:5173                        ║
╚══════════════════════════════════════════════════════════╝
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```

Expected output:
```
  VITE v8.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## 🧪 Test Scenario 1: Single Player Join

### Test Steps
1. Open `http://localhost:5173` in browser
2. Enter name: "TestPlayer"
3. Enter room: "TEST001"
4. Click "Join Game"

### Expected Behavior
- ✅ Home page disappears
- ✅ Navigates to `/lobby/TEST001`
- ✅ Lobby shows "1" in "Players (1)"
- ✅ Displays player "TestPlayer" in the list
- ✅ "Start Game" button is DISABLED (gray)

### Server Console Should Show
```
[SOCKET] ✅ User connected: abc123xyz
[RECEIVE] game:join from abc123xyz { roomId: 'TEST001', playerName: 'TestPlayer' }
[ROOM] Created room: TEST001
[ROOM] Player joined: TestPlayer (abc123xyz) in room TEST001. Total: 1
[EMIT] game:room_update to room TEST001 { playersCount: 1 }
```

### Browser Console Should Show
```
[SOCKET] ✅ Connected: abc123xyz
[RECEIVE] Room update: { roomId: 'TEST001', players: [...], gameState: null }
```

---

## 🧪 Test Scenario 2: Multi-Player Join (Critical)

### Setup
- Keep Tab 1 open in lobby (from Test Scenario 1)
- Open Tab 2 at `http://localhost:5173`

### Test Steps (Tab 2)
1. Enter name: "TestPlayer2"
2. Enter room: "TEST001" (SAME as Tab 1)
3. Click "Join Game"

### Expected Behavior

**Tab 2:**
- ✅ Navigates to `/lobby/TEST001`
- ✅ Shows "Players (2)"
- ✅ Shows both "TestPlayer" and "TestPlayer2"

**Tab 1 (should auto-update):**
- ✅ Still shows `/lobby/TEST001`
- ✅ Shows "Players (2)" (was 1, now 2)
- ✅ Shows both players
- ✅ "Start Game" button is NOW ENABLED (yellow)

### Server Console Should Show
```
[SOCKET] ✅ User connected: def456ghi
[RECEIVE] game:join from def456ghi { roomId: 'TEST001', playerName: 'TestPlayer2' }
[ROOM] Player joined: TestPlayer2 (def456ghi) in room TEST001. Total: 2
[EMIT] game:room_update to room TEST001 { playersCount: 2 }
```

### Browser Consoles Should Show
```
Tab 1: [RECEIVE] Room update: { roomId: 'TEST001', players: [...2 players...] }
Tab 2: [RECEIVE] Room update: { roomId: 'TEST001', players: [...2 players...] }
```

---

## 🎮 Test Scenario 3: Start Game (Most Critical)

### Prerequisite
- Both Tab 1 and Tab 2 in same lobby with 2 players

### Test Steps (Click Tab 1)
1. Click "Start Game" button

### Expected Behavior

**Tab 1:**
- ✅ "Starting..." text appears briefly
- ✅ Navigates to `/game/TEST001`
- ✅ Shows game page with game state
- ✅ Debug panel shows game state JSON
- ✅ Shows "Round 1 • Phase: deal"

**Tab 2 (should auto-navigate):**
- ✅ Automatically navigates to `/game/TEST001`
- ✅ Shows same game state as Tab 1
- ✅ Both show identical game state

### Server Console Should Show
```
[RECEIVE] game:start from abc123xyz { roomId: 'TEST001' }
[GAME] Start game requested for room TEST001
[ROOM] Updated game state in room TEST001
[ROOM] Game started in room TEST001
[EMIT] game:state_update to room TEST001 { gameState: {...} }
```

### Browser Consoles Should Show
```
Tab 1: [RECEIVE] Game state update: { gameState: { status: 'playing', round: 1, ... } }
Tab 2: [RECEIVE] Game state update: { gameState: { status: 'playing', round: 1, ... } }
```

### Debug Panel Check
- Last Event: Should show timestamp like "14:25:30 - State Update"
- Game State JSON: Should show
  ```json
  {
    "roomId": "TEST001",
    "status": "playing",
    "round": 1,
    "phase": "deal",
    "currentPlayer": "abc123xyz"
  }
  ```

---

## 🧪 Test Scenario 4: Player Disconnect

### Prerequisite
- Both players in game page

### Test Steps
1. Close Tab 2 (or click "Leave" button)

### Expected Behavior

**Tab 1:**
- ✅ Page may show loading or empty state
- ✅ Or shows updated player count (if back-navigation happens)

**Tab 2:**
- ✅ Connection closes

### Server Console Should Show
```
[SOCKET] ❌ User disconnected: def456ghi
[SOCKET] Disconnecting def456ghi
[GAME] Player [ID] leaving room TEST001
[ROOM] Player left: TestPlayer2 (def456ghi) from room TEST001. Total: 1
[EMIT] game:room_update to room TEST001 (player left) { playersCount: 1 }
```

---

## 📋 Detailed Verification Checklist

### Connection Health
- [ ] Backend logs show socket connection (✅)
- [ ] Frontend logs show socket connection (✅)
- [ ] CORS warnings in console? NO
- [ ] WebSocket connection in Network tab? YES (green)

### Room Management
- [ ] Room created when first player joins? YES
- [ ] Room deleted when last player leaves? YES
- [ ] Multiple rooms can exist simultaneously? (create TEST002 in separate tab)
- [ ] Duplicate names allowed? YES
- [ ] Same player in multiple rooms? YES

### Event Broadcasting
- [ ] game:room_update sent to ALL players when joining? YES
- [ ] game:room_update sent to ALL players when leaving? YES
- [ ] game:state_update sent to ALL players when starting? YES
- [ ] No duplicate events? Check console for duplicates
- [ ] Events have correct payload structure? Check debug panel

### Game State
- [ ] Game state is null before start? YES
- [ ] Game state has status='playing' after start? YES
- [ ] Game state has round=1 after start? YES
- [ ] Game state has phase='deal' after start? YES
- [ ] Game state persists on broadcast? YES (same in all clients)

### UI Behavior
- [ ] Home page has input fields? YES
- [ ] Lobby shows 0 players initially? YES
- [ ] Lobby updates live? YES (wait 2 seconds, no refresh)
- [ ] Start button disabled with <2 players? YES
- [ ] Start button enabled with 2+ players? YES
- [ ] Game page shows debug panel? YES
- [ ] Debug panel can be collapsed? YES

### Data Validation
- [ ] Player name required? (submit blank - should show error)
- [ ] Room code required? (submit blank - should show error)
- [ ] Start game with 1 player? (should emit error)
- [ ] Error messages appear in console? YES

---

## 🔍 Debug Commands

### Check Socket ID in Console (Browser)
```javascript
// In browser console on any page
socket.id  // Should output something like "abc123xyz"
```

### Check Room State (Server Console)
Already logged automatically, but you can add:
```typescript
// In any handler
const room = roomStore.getPublicRoom(roomId);
console.log('Room state:', room);
```

### Monitor All Socket Events
```javascript
// In browser console
const socket = io('http://localhost:5001');
socket.onAny((event, data) => {
  console.log(`[ALL EVENTS] ${event}:`, data);
});
```

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot connect to localhost:5001"
**Fix:**
1. Ensure backend is running: `npm run dev` in `/server`
2. Check `client/src/config/env.ts` has `VITE_SOCKET_URL: "http://localhost:5001"`
3. Check if port 5001 is already in use: `lsof -i :5001`

### Issue: Frontend connects but no room events
**Fix:**
1. Check browser console for `[RECEIVE]` logs
2. Check server console for `[EMIT]` logs
3. Restart both frontend and backend
4. Clear browser cache: Cmd+Shift+Delete

### Issue: Two tabs don't see each other
**Fix:**
1. Verify both use SAME room code (case-sensitive!)
2. Check server console shows both socket IDs
3. Wait 2 seconds for Socket.IO reconnection
4. Check Network tab: are there 2 WebSocket connections?

### Issue: Start Game button disabled with 2+ players
**Fix:**
1. Fully reload page (Cmd+R)
2. Rejoin room
3. Check server console logs for game:start event

### Issue: Duplicate event listeners
**Fix:**
1. Clear browser cache
2. Restart frontend: `npm run dev`
3. Check for double socket initialization in `useEffect`

---

## 📊 Performance Checklist

- [ ] No lag when joining room (<100ms)
- [ ] Room updates visible <500ms after joining
- [ ] Game start updates visible <500ms after clicking
- [ ] No console warnings or errors
- [ ] Memory usage stable (check Task Manager)
- [ ] CPU usage low at idle (<5%)

---

## ✅ Final Sign-Off

When ALL tests pass, Sprint 0 is complete:

- [ ] Test Scenario 1: Single player ✅
- [ ] Test Scenario 2: Multi-player ✅
- [ ] Test Scenario 3: Start Game ✅
- [ ] Test Scenario 4: Disconnect ✅
- [ ] All verification checks ✅
- [ ] No console errors ✅
- [ ] Performance acceptable ✅

---

## 📸 Screenshots to Capture

For documentation, capture:
1. Home page with inputs
2. Lobby with 1 player
3. Lobby with 2 players + enabled Start button
4. Game page with debug panel
5. Browser console with [SOCKET] logs
6. Server console with [ROOM] logs

---

**Sprint 0 Testing Ready!**
