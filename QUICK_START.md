# 🚀 Quick Start Guide

**Get oriented in Health Intel in 10 minutes.**

---

## What Is Health Intel?

A **national health intelligence platform** that shows hospital capacity in real-time so:
- Citizens can find the right hospital fast
- Hospitals can plan operations efficiently
- Government can see health system status and respond early

---

## Why Does It Matter?

**Problem:** People die because no one knows where capacity actually exists.

**Solution:** Real-time visibility. When someone needs emergency care, the system shows: "Hospital B has beds 2km away."

**Impact:** Faster response = better outcomes = lives saved.

---

## How It Works (In 30 Seconds)

```
Hospital Admin:
  1. Logs in
  2. Updates: "We have 5 beds available"
  3. System broadcasts update

Citizens/Observers:
  4. See dashboard update instantly
  5. Know where capacity exists

Government:
  6. Sees national health map
  7. Can respond early to crises
```

---

## The Three Parties (and What They Get)

| Party | Gets | Reason |
|-------|------|--------|
| **Citizens** | Know where to go in emergencies | Speed = survival |
| **Hospitals** | Operational intelligence | Efficiency = money |
| **Government** | Real-time visibility + data | Control = policy |

All three benefit → System works.

---

## Current Status

| Component | Status | Read This |
|-----------|--------|-----------|
| Vision | ✅ Locked | [Vision](./docs/01-vision-and-strategy/) |
| MVP Plan | ✅ Defined | [MVP Definition](./docs/02-mvp-definition/) |
| Backend | 🔨 In Progress | [README.md](./README.md) |
| Database | ✅ Complete | [Migrations](./migrations/) |
| Frontend | 📋 Planned | [Architecture](./docs/03-architecture/) |

---

## Documentation Structure

```
docs/
├── 01-vision-and-strategy/     ← "Why are we doing this?"
├── 02-mvp-definition/          ← "What are we building?"
├── 03-architecture/            ← "How does it work?"
├── 04-development-logs/        ← "What did we build today?"
├── 05-challenges-and-solutions/← "What went wrong and why?"
└── 06-data-models/            ← "What's the data structure?"
```

**New to project?** Start with [Vision & Strategy](./docs/01-vision-and-strategy/).

---

## Core Concepts

### Hospital Capacity
The real-time status of hospital resources:
- Available beds
- ICU status
- Oxygen levels
- Emergency ward status

**Why it matters:** Citizens need to know what's actually available.

### Real-Time Updates
When something changes, everyone sees it instantly (via WebSocket).

**Why it matters:** In emergencies, delays kill people.

### Three-Party Alignment
The system only works if all three parties (citizens, hospitals, government) benefit.

**Why it matters:** Adoption fails if any party doesn't win.

### Anomaly Detection
AI flags unusual patterns (bed shortage, patient surge, etc.).

**Why it matters:** Early warning system prevents crises.

---

## Development Phases

### Phase 1: MVP (3 months)
- Hospital capacity tracking
- Real-time dashboard
- Incident reporting
- Rule-based anomaly detection

### Phase 2: Scale (3 months)
- Multi-city expansion
- Advanced features
- ML-based forecasting

### Phase 3: Adoption (6 months)
- Government integration
- Citizen app
- National rollout

### Phase 4: Intelligence (Year 2+)
- Deep AI insights
- Network optimization
- Advanced analytics

---

## Architecture (Simplified)

```
┌─────────────────────────────────────┐
│ Frontend (Next.js)                  │
│ Hospital dashboard + Observer view  │
└──────────────┬──────────────────────┘
               │ (HTTP + WebSocket)
┌──────────────▼──────────────────────┐
│ Backend (Rust + Axum)               │
│ API, auth, real-time, business logic│
└──────────────┬──────────────────────┘
               │ (SQL)
┌──────────────▼──────────────────────┐
│ Database (PostgreSQL)               │
│ Hospitals, capacity, incidents, logs│
└─────────────────────────────────────┘
```

---

## Getting Started (For Developers)

1. **Clone repo**
   ```bash
   git clone <repo>
   cd health-intel-backend
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL connection
   ```

3. **Run migrations**
   ```bash
   sqlx migrate run
   ```

4. **Start backend**
   ```bash
   cargo run
   ```

5. **Access API**
   - REST: `http://localhost:3000/api/v1`
   - Docs: `http://localhost:3000/swagger-ui`

---

## Key Files to Know

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview & API reference |
| [Cargo.toml](./Cargo.toml) | Dependencies |
| [src/main.rs](./src/main.rs) | Application entry point |
| [src/routes/](./src/routes/) | HTTP handlers |
| [src/models/](./src/models/) | Data structures |
| [src/db/](./src/db/) | Database access |
| [docs/](./docs/) | Documentation (you are here!) |
| [migrations/](./migrations/) | Database schema |

---

## Common Tasks

### Add a New API Endpoint
1. Define request/response models in `src/models/`
2. Add handler in `src/routes/`
3. Register route in `src/routes/router.rs`
4. Add repository query in `src/db/`

### Fix a Bug
1. Check [Challenges & Solutions](./docs/05-challenges-and-solutions/)
2. Write a test that reproduces it
3. Fix the code
4. Update docs if it's a known issue

### Track Progress
1. Check [Development Logs](./docs/04-development-logs/)
2. Add your work to logs (template provided)

### Deploy
1. Build release binary: `cargo build --release`
2. Follow deployment guide (planned)

---

## Key Principles

### 1. Real-Time First
Updates must broadcast instantly (WebSockets, not polling).

### 2. Type Safe
Let Rust and SQLx catch bugs before runtime.

### 3. Audit Trail
Every change logged — government requirement.

### 4. Explicit Errors
No silent failures. Errors bubble up and are logged.

### 5. Modular Design
Each layer has one job (routes, handlers, services, repos).

---

## Next Steps

Choose your path:

**Product/Strategy:**
→ Read [Vision & Strategy](./docs/01-vision-and-strategy/)

**Architecture:**
→ Read [Architecture Overview](./docs/03-architecture/01-architecture-overview.md)

**Implementation:**
→ Read [MVP Definition](./docs/02-mvp-definition/)

**Development:**
→ Check [Development Logs](./docs/04-development-logs/)

**Challenges:**
→ Read [Challenges & Solutions](./docs/05-challenges-and-solutions/)

---

## Questions?

Most questions are answered in docs. Try searching before asking.

If something is unclear in the docs, that's a bug in the docs — fix it!

---

**Last Updated:** January 2025  
**Status:** 🚀 Active Development



The Correct Login Command
Use this command to log in. It matches exactly what is in your .env file:

Bash

psql -h localhost -U health_admin -d health_intel_mvp
When asked for the password: Type: strongpassword (and press Enter).

Once you are in (you see health_intel_mvp=>)