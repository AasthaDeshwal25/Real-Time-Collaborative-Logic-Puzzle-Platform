# Collaborative Logic Puzzle Platform

A real-time collaborative web application where multiple users can create and solve custom 4x4 logic puzzles together.

## Features

- **Real-time Collaboration**: Multiple users can work on the same puzzle simultaneously
- **Custom Puzzle Creation**: Create your own 4x4 logic puzzles with custom rules
- **Optimistic UI**: Immediate feedback with proper rollback on conflicts
- **WebSocket Integration**: Real-time synchronization using STOMP over WebSocket
- **Concurrency Handling**: Robust server-side validation and race condition prevention

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3+
- JPA/Hibernate
- WebSocket (STOMP)
- H2 Database (in-memory)

### Frontend
- React 18+ (Hooks)
- Redux Toolkit
- STOMP.js over WebSocket
- Plain CSS

## Quick Start

1. **Prerequisites**
   - Java 17+
   - Maven 3.6+
   - Node.js 16+
   - npm

2. **Setup**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Run Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Run Frontend**
   ```bash
   cd frontend
   npm start
   ```

## Architecture

### Real-time Synchronization
- Uses WebSocket with STOMP protocol for real-time communication
- Optimistic UI updates with server confirmation
- Automatic rollback on conflicts or timeouts
- Pessimistic locking on server side to prevent race conditions

### Concurrency Handling
- Database-level pessimistic locking for puzzle updates
- Application-level ReentrantReadWriteLock for additional safety
- Version-based optimistic locking as fallback
- Atomic operations for grid state changes

### WebSocket Flow
1. Client makes move → Optimistic UI update
2. Move sent to server via WebSocket
3. Server validates and applies move with locking
4. Server broadcasts confirmed move to all clients
5. Clients update state and clear optimistic moves

## API Endpoints

### REST API
- `GET /api/puzzles` - Get all puzzles
- `GET /api/puzzles/{id}` - Get specific puzzle
- `POST /api/puzzles` - Create new puzzle

### WebSocket
- `/ws` - WebSocket endpoint
- `/app/puzzle/move` - Send move
- `/topic/puzzle/{id}/moves` - Receive moves
- `/topic/puzzle/{id}/solved` - Receive solve events

## Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Key Implementation Details

### Race Condition Prevention
- Pessimistic database locking on puzzle updates
- Application-level locking with ReentrantReadWriteLock
- Atomic grid state modifications
- Server-side move validation

### Optimistic UI
- Immediate visual feedback on user actions
- Temporary move storage with unique IDs
- Automatic rollback after 5-second timeout
- Confirmation-based state reconciliation

### WebSocket Reconnection
- Automatic reconnection with exponential backoff
- Connection state management in Redux
- Graceful handling of network interruptions
- Maximum retry attempts with fallback

## Project Structure

```
PuzzlePlatform/
├── backend/
│   ├── src/main/java/com/puzzle/platform/
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data access layer
│   │   ├── service/        # Business logic
│   │   ├── controller/     # REST and WebSocket controllers
│   │   └── config/         # Configuration classes
│   └── src/test/           # Unit tests
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store and slices
│   │   └── hooks/          # Custom React hooks
│   └── public/             # Static assets
└── setup.sh               # Setup script
```
