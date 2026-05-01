# AGENTS.md - Instructions for Coding Agents

## Development Approach

### Test-Driven Development (TDD)
All implementation from Phase 2 (Frontend + Game Loop) onward MUST follow TDD:

**Red-Green-Refactor Cycle:**
1. Write a failing test that defines the desired functionality
2. Run the test to confirm it fails (Red)
3. Write minimal code to make the test pass (Green)
4. Refactor code while keeping tests green
5. Commit only when all tests pass

**Testing Requirements by Layer:**

| Layer | Testing Framework | Test Type |
|--------|-------------------|-----------|
| Backend Services | Jest + Supertest | Unit + Integration |
| Backend API Routes | Jest + Supertest | Integration |
| Frontend Components | Jest + React Native Testing Library | Component |
| Frontend Screens | Jest + React Native Testing Library | Navigation/Interaction |

**Test File Conventions:**
- Backend: `src/__tests__/*.test.js` or colocate `*.test.js` with source
- Frontend: `__tests__/*.test.js` or colocate with components
- Naming: `[filename].test.js`

**Running Tests:**
```bash
# Backend tests
cd backend && npm test

# Frontend tests (once Expo project created)
cd frontend && npm test
```

**Commit Policy:**
- ALL tests must pass before committing
- Run `npm test` before every commit
- If unsure about test command, ask user and document here

---

## Linting & Type Checking

**Backend:**
```bash
cd backend && npm run lint    # ESLint (once configured)
```

**Frontend:**
```bash
cd frontend && npm run lint   # ESLint
cd frontend && npm run typecheck  # TypeScript (if using TS)
```

---

## Build Commands

**Backend:**
```bash
cd backend && npm run dev     # Development with nodemon
cd backend && npm start      # Production
cd backend && npm run migrate  # Run DB migrations
```

**Frontend (Expo):**
```bash
cd frontend && npm start     # Start Expo dev server
cd frontend && npm run web   # Run in browser
cd frontend && eas build     # Build for native (later)
```

---

## Project Structure

```
someday/
├── backend/           # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── config/   # Database, environment config
│   │   ├── controllers/  # Route handlers
│   │   ├── services/    # Business logic
│   │   ├── sockets/     # Socket.io event handlers
│   │   ├── routes/      # Express routes
│   │   ├── middleware/  # Auth, validation
│   │   ├── __tests__/  # Backend tests
│   │   └── db/
│   │       └── migrations/
│   └── package.json
├── frontend/          # Expo + React Native Web (Phase 2)
├── docs/
│   └── game-design.md
└── AGENTS.md          # This file
```

---

## Database

**Local Development:**
```bash
createdb someday_game
psql someday_game < backend/src/db/migrations/001_initial_schema.sql
```

**Run Migrations:**
```bash
cd backend && npm run migrate
```

---

## Notes

- PostgreSQL required for local development
- Socket.io for real-time turn notifications
- JWT tokens for authentication (7-day expiry)
- World seed is deterministic (simplex-noise)
- 24h auto-skip cron runs hourly to check for timed-out turns
