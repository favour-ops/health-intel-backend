# System Architecture Overview

## Big Picture

Health Intel consists of three main layers:

### Layer 1: Backend API (Rust + Axum)
- Handles all business logic
- Manages real-time updates
- Enforces authentication
- Maintains audit trail
- Connects to database

### Layer 2: Database (PostgreSQL)
- Stores hospital data
- Stores capacity data
- Stores incident reports
- Stores audit logs
- Enforces data integrity

### Layer 3: Frontend (Next.js, planned)
- Hospital admin dashboard
- Capacity update forms
- Live incident feed
- Audit log viewer
- Real-time updates via WebSocket

---

## Data Flow (Hospital Updates Capacity)

### What Happens When Hospital Admin Updates Capacity

```
1. Hospital Admin opens dashboard
2. Updates beds from "5" to "2"
3. Clicks "Save"

Frontend → Backend:
   POST /api/v1/hospitals/{id}/capacity
   Body: { "available_beds": 2 }

Backend:
   ✓ Authenticate (JWT)
   ✓ Validate input
   ✓ Update database
   ✓ Log change (audit trail)
   ✓ Broadcast via WebSocket

Database:
   ✓ Store new value
   ✓ Timestamp the change
   ✓ Record who made it

WebSocket Broadcast:
   → All connected clients receive update
   → Dashboard refreshes instantly
   → Observer sees change immediately
```

---

## Component Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Frontend                          │
│           (Next.js Dashboard)                       │
│  ┌──────────────────────────────────────────────┐   │
│  │ Hospital Admin │ Live Dashboard │ Incidents  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                       ↕ (HTTP + WebSocket)
┌─────────────────────────────────────────────────────┐
│              Backend (Rust + Axum)                  │
│  ┌──────────────────────────────────────────────┐   │
│  │ Routes │ Handlers │ Services │ Repositories  │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ✓ Authentication (JWT)                            │
│  ✓ WebSocket Server                                │
│  ✓ Business Logic                                  │
│  ✓ Audit Logging                                   │
│  ✓ Error Handling                                  │
└─────────────────────────────────────────────────────┘
                       ↕ (SQL)
┌─────────────────────────────────────────────────────┐
│          Database (PostgreSQL)                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Hospitals │ Capacity │ Incidents │ Audit Logs  │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Request Lifecycle

Every HTTP request follows this path:

```
Request arrives at Router
         ↓
Route matches handler
         ↓
Extract path/query/body
         ↓
Authenticate (JWT middleware)
         ↓
Authorization check (RBAC)
         ↓
Validate input data
         ↓
Call repository (database)
         ↓
Log change (audit trail)
         ↓
Format response (ApiResponse)
         ↓
Broadcast via WebSocket (if applicable)
         ↓
Send response to client
```

---

## WebSocket Connection Flow

### Connection Establishment

```
1. Client connects to WebSocket /ws
   → Backend checks JWT in URL
   → Authenticates user
   → Adds to broadcast group

2. Client receives confirmation
   → "Connected"
   → Subscription set up

3. When ANY hospital updates capacity:
   → Backend publishes to broadcast channel
   → ALL connected clients receive update
   → Frontend updates dashboard instantly
```

### Data Broadcast Pattern

```
Hospital A updates capacity
         ↓
Backend receives update
         ↓
Store in database
         ↓
Log change
         ↓
Send to broadcast channel
         ↓
┌──────────────────────────────────────────────────┐
│ Broadcast to:                                    │
│ - Hospital A admin (sees their update)           │
│ - Hospital B admin (sees competitor update)      │
│ - Observer (sees system-wide update)             │
│ - Dashboard (updates in real-time)                │
└──────────────────────────────────────────────────┘
```

---

## State Management

### What Lives Where

**Frontend State:**
- UI state (open modals, selected hospital)
- Temporary form data
- Loading states

**Backend State:**
- Database (source of truth)
- WebSocket connections (who's connected)
- JWT tokens (session info)

**Database State:**
- All persistent data
- Audit trail
- No business logic

**Never in State:**
- Secrets
- Sensitive auth info
- Passwords

---

## Deployment Model (MVP)

### Single Server Deployment

```
┌────────────────────────────────────┐
│  Server (Rust + Frontend)           │
│  ┌──────────────────────────────┐   │
│  │ Backend (Axum)                   │
│  │ + WebSocket Server            │   │
│  ├──────────────────────────────┤   │
│  │ Frontend (Next.js static)     │   │
│  ├──────────────────────────────┤   │
│  │ PostgreSQL Database           │   │
│  └──────────────────────────────┘   │
└────────────────────────────────────┘
```

### Future Scaling (Not MVP)

```
┌─────────────────┐
│ Load Balancer   │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌─────────┐
│Backend 1│ │Backend 2│
└─────────┘ └─────────┘
    └────┬────┘
         ↓
  ┌──────────────┐
  │ PostgreSQL   │
  └──────────────┘
```

But that's not MVP. Start simple.

---

## Key Characteristics

### Real-Time
- WebSocket eliminates polling delays
- Updates broadcast within milliseconds
- No manual refresh needed

### Audit Trail
- Every change logged with timestamp + user
- Immutable record of who did what
- Compliance-ready

### Type Safe
- Rust prevents null pointer errors
- SQLx verifies queries at compile time
- Bad data never reaches database

### Modular
- Routes (HTTP concerns)
- Handlers (request processing)
- Services (business logic)
- Repositories (data access)
- Can be separated into services later

---

## Next Steps

Read [Tech Stack Reasoning](./02-tech-stack.md) to understand why each choice was made.
