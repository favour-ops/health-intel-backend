# 🏗 Architecture & Design Decisions

**How the system works and why we made these choices.**

This section is for developers and architects who need to understand the technical backbone.

---

## 📄 Documents in This Section

### [1. System Architecture Overview](./01-architecture-overview.md)

**What it covers:**
- High-level system design
- Component interactions
- Data flow
- Deployment model

**Best for:** Understanding the big picture

### [2. Tech Stack Reasoning](./02-tech-stack.md)

**What it covers:**
- Why Rust (not Node.js or Python)
- Why Axum (not Rocket or Actix)
- Why PostgreSQL (not MongoDB)
- Why WebSockets (not polling)
- Trade-offs for each choice

**Best for:** Understanding engineering decisions

### [3. Real-Time Strategy](./03-realtime-strategy.md)

**What it covers:**
- WebSocket architecture
- Broadcasting patterns
- Connection management
- Scaling real-time updates
- Fallbacks and reliability

**Best for:** Building real-time features

### [4. Authentication Design](./04-authentication.md)

**What it covers:**
- JWT-based authentication
- Token lifecycle
- Refresh token strategy
- Role-based access control (RBAC)
- Security considerations

**Best for:** Implementing auth features

### [5. Database Design Philosophy](./05-database-design.md)

**What it covers:**
- Schema design principles
- Normalization decisions
- Indexing strategy
- Migration approach
- Data integrity

**Best for:** Database work and schema changes

### [6. API Design Principles](./06-api-design.md)

**What it covers:**
- RESTful conventions
- Response structure
- Error handling
- Versioning strategy
- Documentation approach

**Best for:** Building new endpoints

### [7. Error Handling Strategy](./07-error-handling.md)

**What it covers:**
- Custom error types
- HTTP status mapping
- Error logging
- User-friendly messages

**Best for:** Adding error handling to new code

---

## ⚡ Quick Navigation

| Topic | File | When to Read |
|-------|------|--------------|
| How does it all fit together? | [Architecture Overview](./01-architecture-overview.md) | Project start |
| Why Rust/Axum/Postgres? | [Tech Stack](./02-tech-stack.md) | Questioning choices |
| How do real-time updates work? | [Real-Time Strategy](./03-realtime-strategy.md) | Building live features |
| How does authentication work? | [Authentication Design](./04-authentication.md) | Adding auth features |
| How should I design database tables? | [Database Design](./05-database-design.md) | Adding new entities |
| How should I design API endpoints? | [API Design](./06-api-design.md) | Adding new endpoints |
| How should I handle errors? | [Error Handling](./07-error-handling.md) | Error handling code |

---

## 🎯 Core Architecture Principles

Every design decision in Health Intel follows these principles:

### 1. **Real-Time First**
- Coordination requires immediacy
- All updates broadcast to all clients
- No polling, no delays

### 2. **Type Safety Over Runtime Checks**
- Rust catches bugs at compile time
- SQLx verifies queries at compile time
- Fewer surprises in production

### 3. **Audit Trail from Day One**
- Every change is logged
- Who did it, when, what changed
- Non-negotiable for government systems

### 4. **Explicit Over Implicit**
- Error handling explicit (Result types)
- Data flow visible
- No hidden allocations or side effects

### 5. **Separate Concerns**
- Routes handle HTTP
- Services handle business logic
- Repositories handle data
- No mixing of concerns

### 6. **Fail Safe, Not Silently**
- If something goes wrong, you know about it
- Structured logging everywhere
- Errors bubble up, never swallowed

---

## 🚀 Getting Started with Architecture

Read in order:

1. **[Architecture Overview](./01-architecture-overview.md)** - See the whole system
2. **[Tech Stack](./02-tech-stack.md)** - Understand why choices matter
3. Then reference specific docs as needed
