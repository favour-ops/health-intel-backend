# Health Intel - Technical Journey & Challenges

## 1. Swagger UI & Generic Types (Rust)
**The Challenge:**
After creating a generic `ApiResponse<T>` wrapper for our JSON responses, Swagger UI crashed with a `Could not resolve pointer` error. It couldn't understand the generic type `T` in the schema.

**The Fix:**
We used the `inline(...)` macro in our `utoipa` attributes. This forces the documentation generator to define the schema right inside the endpoint definition rather than trying to create a shared reference for a generic type.

## 2. Leaflet & Server-Side Rendering (Next.js)
**The Challenge:**
When trying to load the Map, the app crashed with `ReferenceError: window is not defined`. This happened because Next.js tries to render pages on the server first, but the Leaflet map library relies on the browser's `window` object (which doesn't exist on the server).

**The Fix:**
We used Next.js Dynamic Imports to disable Server-Side Rendering (SSR) specifically for the Map component.
```typescript
const Map = dynamic(() => import("../components/Map"), { ssr: false });
3. The "Map Container Reused" Crash
The Challenge: The map would crash with Error: Map container is already initialized. This is caused by React's Strict Mode, which mounts components twice in development to check for bugs. Leaflet tries to initialize the map twice on the same DOM element, causing a collision.

The Fix: We disabled Strict Mode in next.config.ts:

TypeScript

const nextConfig: NextConfig = {
  reactStrictMode: false,
};
4. Linux File Watcher Limit
The Challenge: The Next.js server crashed immediately on startup with OS file watch limit reached. This is a common Linux issue where the OS limits how many files a program can monitor for changes.

The Fix: We increased the system limit using the terminal:

Bash

sudo sysctl fs.inotify.max_user_watches=524288
5. CORS (Connecting Frontend to Backend)
The Challenge: The frontend (port 3001) could not fetch data from the backend (port 3000) due to browser security rules (Cross-Origin Resource Sharing).

The Fix: We added the tower-http crate to the Rust backend and configured the router to permit requests from the frontend.

Rust

let cors = CorsLayer::new().allow_origin(Any).allow_methods([Method::GET, Method::POST]);
6. Data Mismatch (Missing Markers)
The Challenge: The map was working, but no markers appeared, even though the data was fetching correctly.

Cause: The database returned columns named latitude / longitude.

Frontend Expectation: The mock data used lat / lng.

The Fix: We updated the Map component to handle both naming conventions gracefully:

TypeScript

const lat = hospital.latitude || hospital.lat;
const lng = hospital.longitude || hospital.lng;
7. PostgreSQL Authentication & Connection
The Challenge: We couldn't log in to the database CLI using the default postgres user, getting FATAL: password authentication failed.

The Fix: We checked the .env file and realized the app was configured to use a specific user (health_admin) and database (health_intel_mvp). Logging in with these correct credentials allowed us to run the SQL updates.

8. Implementing Authentication (JWT & Bcrypt)
The Challenge: When implementing the login endpoint, we kept receiving 401 Unauthorized even though we were sure the user existed.

Issue 1: We initially created the admin user in the wrong database (health_intel instead of health_intel_mvp).

Issue 2: When we fixed the database, the password hash was corrupted because the shell interpreted the $ characters in the bcrypt hash as variables.

The Fix:

We verified the correct database (health_intel_mvp).

We generated a valid bcrypt hash using Python to ensure no shell corruption.

We updated the user record directly via SQL to guarantee the hash was correct.

We successfully connected the Next.js login form to the Rust backend, storing the JWT in localStorage.

9. Git Commands to Push
Run these in your terminal (make sure you are in the root folder):

Bash

git add .
git commit -m "feat: implement full authentication flow and update docs"
git push origin main

---

### **2. Update `README.md`**

I have added the **Default Credentials** section and updated the status of Authentication to "Completed".

**Replace the content of `README.md` with this:**

```markdown
# 🏥 Health Intel Platform - Backend

## 📌 Project Overview

**Health Intel** is a scalable hospital and health-information management platform designed to unify hospital operations, patient records, and clinical workflows into a single, secure system.

The long-term vision is to build a **modular, API-first healthcare intelligence platform** that can:

- Serve hospitals, clinics, and healthcare networks
- Support future analytics, AI-driven insights, and interoperability
- Scale cleanly as features and teams grow

This repository contains the **Rust-based backend API** with a PostgreSQL database.

---

## 🔐 Default Admin Credentials

To access the dashboard and test protected endpoints, use the following credentials:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@health.gov.ng` | `password123` |

---

## 🎯 Goals of the Project

### Primary Goals (Current Phase)

✅ **Completed:**
- Centralize hospital data with a robust API
- Provide consistent, standardized API response structure
- Implement comprehensive error handling and structured logging
- **Secure Authentication System (JWT + Bcrypt)**
- **Real-time Occupancy Tracking**
- **Interactive Dashboard with Map**

### Long-Term Goals

- Multi-hospital support with resource scoping
- Role-based access control (Admin, Doctor, Nurse, Staff)
- Audit logs and complete traceability
- AI-powered health insights and analytics
- Integration with external hospital systems

---

## 🧱 Architecture Overview

### Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Language** | Rust | Modern, safe, performant |
| **Web Framework** | Axum 0.7 | Type-safe, modular routing |
| **Async Runtime** | Tokio 1.36 | Full features (multi-threaded, macros, networking) |
| **Database** | PostgreSQL 13+ | SQL with sqlx compile-time verification |
| **Authentication** | JWT + Bcrypt | Stateless, secure token-based auth |
| **Serialization** | Serde 1.0 | JSON (de)serialization |
| **API Documentation** | Utoipa + Swagger UI | OpenAPI 3.0 auto-generation |
| **Logging** | Tracing 0.1 | Structured, observability-ready logging |

---

## 🚀 Getting Started

### Prerequisites

- **Rust** 1.70+ ([Install](https://rustup.rs/))
- **PostgreSQL** 13+ ([Install](https://www.postgresql.org/download/))
- **Node.js** (for Frontend)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd health-intel-backend
Step 2: Set Up Environment
Copy and configure .env:

Bash

cp .env.example .env
Update .env with your PostgreSQL connection:

Code snippet

DATABASE_URL=postgresql://user:password@localhost:5432/health_intel_mvp
JWT_SECRET=your_secret_key_here
HOST=127.0.0.1
PORT=3000
Step 3: Install Dependencies & Run Migrations
Bash

cargo build
sqlx migrate run --database-url $DATABASE_URL
Step 4: Seed Admin User
(If you haven't already, create the admin user manually in your database)

SQL

INSERT INTO admins (email, password_hash) 
VALUES ('admin@health.gov.ng', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4h/XQ9.Q.O');
Step 5: Start Server
Bash

cargo run
Output:

🚀 Server running on [http://127.0.0.1:3000](http://127.0.0.1:3000)
✅ Current Implementation Status
Completed ✓
✅ Axum web server setup

✅ PostgreSQL integration with sqlx

✅ Hospital CRUD endpoints (List, Get, Create)

✅ Authentication System (Login, JWT Generation)

✅ Unified API response structure

✅ Centralized error handling (AppError)

✅ Input validation

✅ OpenAPI/Swagger documentation

✅ HTTP health check endpoint

In Progress 🔨
🔨 Role-based access control (RBAC) middleware

🔨 Pagination & filtering for list endpoints

Planned 📋
📋 Doctor management endpoints

📋 Patient records management

📋 Real-time notifications (WebSocket)

📋 Analytics & reporting

📡 API Documentation
Swagger UI
Interactive API documentation with "Try it Out" functionality:

http://localhost:3000/swagger-ui
OpenAPI Spec
Raw OpenAPI 3.0 specification:

http://localhost:3000/api-docs/openapi.json
🤝 Contributing
Code Style
Follow Rust naming conventions (snake_case for functions/variables)

Use cargo fmt for formatting

Use cargo clippy for linting

Last Updated: February 2026

Version: 0.2.0 (Auth Enabled)

Status: 🚀 Active Development