# 🏥 Health Intel Platform - Backend

## 📌 Project Overview

**Health Intel** is a scalable hospital and health-information management platform designed to unify hospital operations, patient records, and clinical workflows into a single, secure system.

The long-term vision is to build a **modular, API-first healthcare intelligence platform** that can:

- Serve hospitals, clinics, and healthcare networks
- Support future analytics, AI-driven insights, and interoperability
- Scale cleanly as features and teams grow

This repository contains the **Rust-based backend API** with a PostgreSQL database. The frontend is planned for a future phase.

---

## 🎯 Goals of the Project

### Primary Goals (Current Phase)

✅ **Completed:**
- Centralize hospital data with a robust API
- Provide consistent, standardized API response structure
- Implement comprehensive error handling and structured logging
- Build a foundation that scales as the system grows
- Create modular code architecture for clean separation of concerns

### Long-Term Goals

- Multi-hospital support with resource scoping
- Role-based access control (Admin, Doctor, Nurse, Staff)
- Audit logs and complete traceability
- AI-powered health insights and analytics
- Integration with external hospital systems
- Patient records and appointment management
- Staff and resource management

---

## 🧱 Architecture Overview

### Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Language** | Rust | Modern, safe, performant |
| **Web Framework** | Axum 0.7 | Type-safe, modular routing |
| **Async Runtime** | Tokio 1.36 | Full features (multi-threaded, macros, networking) |
| **Database** | PostgreSQL 13+ | SQL with sqlx compile-time verification |
| **Database ORM** | SQLx 0.7 | Compile-time checked SQL queries |
| **Serialization** | Serde 1.0 | JSON (de)serialization |
| **Validation** | Validator 0.19 | Request payload validation |
| **API Documentation** | Utoipa + Swagger UI | OpenAPI 3.0 auto-generation |
| **Logging** | Tracing 0.1 | Structured, observability-ready logging |
| **Error Handling** | Custom AppError | Centralized, HTTP-aware error mapping |

### Architecture Style

**Modular Monolith** - Cleanly separated concerns that can be extracted into microservices later:

- 🛣️ **Routes** - HTTP endpoint definitions and routing
- 🎯 **Models** - Data structures and API response schemas
- 🗄️ **Database** - Repository pattern for data access
- ⚙️ **Config** - Environment and settings management
- 🚨 **Errors** - Centralized error handling
- 🪵 **Middleware** - Cross-cutting concerns (CORS, logging, auth)

### Design Principles

1. **API-First** - API contracts defined early, consistent across endpoints
2. **Explicit Error Handling** - No panics, all errors gracefully handled
3. **Structured Logging** - Observability built in, ready for log aggregation
4. **Clear Separation of Concerns** - Each module has a single responsibility
5. **Compile-Time Safety** - SQLx queries verified at compile-time
6. **Type Safety** - Rust's type system prevents whole classes of bugs

---

## 📂 Project Structure

```
health-intel-backend/
├── src/
│   ├── main.rs                    # Application entry point
│   ├── lib.rs                     # Library exports, setup_app helper
│   │
│   ├── routes/                    # HTTP endpoint handlers & routing
│   │   ├── mod.rs                 # Module definitions
│   │   ├── router.rs              # Central router setup with Swagger
│   │   ├── state.rs               # Shared application state
│   │   ├── health.rs              # GET /health endpoint
│   │   └── hospitals.rs           # Hospital CRUD endpoints
│   │
│   ├── models/                    # Data structures & API schemas
│   │   ├── mod.rs                 # Module definitions
│   │   ├── hospital.rs            # Hospital entity & CreateHospitalRequest
│   │   ├── api_response.rs        # Generic ApiResponse wrapper (all responses)
│   │   ├── hospital_response.rs   # HospitalsResponse schema
│   │   └── single_hospital_response.rs  # SingleHospitalResponse schema
│   │
│   ├── db/                        # Database layer
│   │   ├── mod.rs                 # Module definitions
│   │   ├── pool.rs                # PostgreSQL connection pool setup
│   │   └── hospital_repo.rs       # Hospital data access (queries)
│   │
│   ├── config/                    # Configuration management
│   │   ├── mod.rs                 # Module definitions
│   │   └── settings.rs            # Settings struct (env vars)
│   │
│   ├── errors/                    # Centralized error handling
│   │   ├── mod.rs                 # Module definitions
│   │   ├── app.rs                 # AppError enum & HTTP mapping
│   │   └── db.rs                  # Database error conversion to AppError
│   │
│   ├── middleware/                # Cross-cutting concerns
│   │   └── mod.rs                 # Placeholder for future middleware
│   │
│   ├── ws/                        # WebSocket (future implementation)
│   │   └── mod.rs                 # Placeholder
│   │
│   └── docs.rs                    # OpenAPI documentation & Swagger config
│
├── migrations/                    # Database migrations (SQL)
│   ├── 002_create_hospitals.sql   # Hospital table schema
│   ├── 003_seed_hospitals.sql     # Sample hospital data
│   └── 004_unique_hospital_name.sql  # Unique constraint on name
│
├── tests/                         # Integration tests
│   ├── hospitals.rs               # Hospital endpoint tests
│   └── create_hospital.rs         # Hospital creation tests
│
├── Cargo.toml                     # Rust dependencies & metadata
├── Cargo.lock                     # Locked dependency versions
├── .env                           # Environment variables (development)
└── .gitignore                     # Git ignore rules
```

---

## 📦 API Response Standard

All API responses follow a **unified structure** for consistency and predictability:

### Success Response

```json
{
  "status": "success",
  "data": {
    // Endpoint-specific data
  },
  "meta": {
    "message": null,
    "count": null
  }
}
```

### Error Response

```json
{
  "status": "error",
  "data": null,
  "meta": {
    "message": "Human-readable error message",
    "count": null
  }
}
```

### Response Structure Definition

**File:** [src/models/api_response.rs](src/models/api_response.rs)

```rust
pub struct ApiResponse<T> {
    pub status: String,
    pub data: Option<T>,
    pub meta: Meta,
}

pub struct Meta {
    pub count: Option<u32>,
    pub message: Option<String>,
}
```

### Why This Matters

✅ Predictable frontend integration - exact same shape everywhere  
✅ Easier error handling in clients  
✅ Cleaner API documentation  
✅ Simplified testing and debugging  

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000
```

### Interactive Docs

- **Swagger UI:** `http://localhost:3000/swagger-ui`
- **OpenAPI Spec:** `http://localhost:3000/api-docs/openapi.json`

### Health Check

**GET** `/api/v1/health`

Check system and database connection status.

**Response (200 OK):**
```json
{
  "status": "ok",
  "service": "health-intel-backend",
  "database": "connected",
  "timestamp": 1674567890
}
```

---

### 🏥 Hospitals Endpoints

#### List All Hospitals

**GET** `/api/v1/hospitals`

Retrieve all hospitals in the system.

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "hospitals": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Central Hospital",
        "hospital_type": "PUBLIC",
        "state": "Lagos",
        "city": "Lagos",
        "is_active": true,
        "created_at": "2025-01-15T10:30:00Z"
      }
    ]
  },
  "meta": {
    "message": null,
    "count": null
  }
}
```

---

#### Get Hospital by ID

**GET** `/api/v1/hospitals/{id}`

Retrieve a specific hospital by UUID.

**Path Parameters:**
- `id` (UUID) - Hospital UUID

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "hospital": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Central Hospital",
      "hospital_type": "PUBLIC",
      "state": "Lagos",
      "city": "Lagos",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00Z"
    }
  },
  "meta": {
    "message": null,
    "count": null
  }
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "data": null,
  "meta": {
    "message": "Resource not found",
    "count": null
  }
}
```

---

#### Create Hospital

**POST** `/api/v1/hospitals`

Create a new hospital record.

**Request Body:**
```json
{
  "name": "Central Hospital",
  "hospital_type": "PUBLIC",
  "state": "Lagos",
  "city": "Lagos"
}
```

**Validation Rules:**
- `name`: minimum 3 characters (required)
- `hospital_type`: must be "PUBLIC" or "PRIVATE" (required)
- `state`: minimum 1 character (required)
- `city`: minimum 1 character (required)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "hospital": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Central Hospital",
      "hospital_type": "PUBLIC",
      "state": "Lagos",
      "city": "Lagos",
      "is_active": true,
      "created_at": "2025-01-15T10:30:00Z"
    }
  },
  "meta": {
    "message": null,
    "count": null
  }
}
```

**Response (400 Bad Request):**
```json
{
  "status": "error",
  "data": null,
  "meta": {
    "message": "Validation error details",
    "count": null
  }
}
```

**Response (409 Conflict):**
```json
{
  "status": "error",
  "data": null,
  "meta": {
    "message": "This record already exists.",
    "count": null
  }
}
```

---

## ❌ Error Handling Strategy

### Centralized Error System

All errors are handled through a custom error type:

**File:** [src/errors/app.rs](src/errors/app.rs)

```rust
pub enum AppError {
    NotFound,                    // 404
    Database(String),            // 500
    Conflict(String),            // 409 (unique constraint violations)
    BadRequest(String),          // 400 (validation errors)
    Unauthorized,                // 401
    Forbidden,                   // 403
    Internal,                    // 500
}
```

### Error Flow

1. **Database errors** (sqlx::Error) are caught in [src/errors/db.rs](src/errors/db.rs)
2. **Specific PostgreSQL errors** are mapped:
   - `23505` (Unique Violation) → `Conflict`
   - `23514` (Check Violation) → `BadRequest`
3. **All errors** implement `IntoResponse` for automatic HTTP responses
4. **Logging** is emitted with error context for observability

### Why Errors Live in `src/errors/`

✅ Prevents error logic from scattered throughout codebase  
✅ Single place to adjust error messages or status codes  
✅ Easier to add logging, metrics, or error tracking  
✅ Scales as the app grows  

---

## 🪵 Logging & Observability

### Logging Framework

**Crate:** `tracing` 0.1 + `tracing-subscriber`

### Log Levels

```rust
RUST_LOG=debug           # Verbose debugging
RUST_LOG=info            # General information (default)
RUST_LOG=warn            # Warnings and errors only
RUST_LOG=error           # Errors only
```

### Default Filter

```
health_intel_backend=debug,tower_http=debug
```

This logs:
- Application events (setup, request lifecycle)
- HTTP request/response details (via tower-http)
- Error context (in `AppError::IntoResponse`)

### Structured Logging in AppError

When an error occurs, it's logged with context:

```rust
error!(
    error_code = "DATABASE_ERROR",
    http_status = 500,
    message = "...",
    "request failed"
);
```

### Future Observability

The logging infrastructure is ready for:
- 📊 Centralized log aggregation (ELK, Datadog)
- 📈 Metrics collection
- 🔍 Distributed tracing
- 💾 Long-term log retention

---

## 🧪 Testing

### Test Files

**Location:** [tests/](tests/)

- [tests/hospitals.rs](tests/hospitals.rs) - Hospital endpoint tests
- [tests/create_hospital.rs](tests/create_hospital.rs) - Hospital creation tests

### Running Tests

```bash
cargo test
```

### Test Coverage

- ✅ List all hospitals
- ✅ Get hospital by ID (existing & non-existing)
- ✅ Create hospital (valid data)
- ✅ Validation error handling
- ✅ Duplicate hospital handling (409 Conflict)

---

## 🗄️ Database

### Database Choice

**PostgreSQL 13+** for:
- ACID transactions
- JSON support (future)
- UUID native type
- Rich ecosystem
- Industry-standard for healthcare systems

### Migrations

**Location:** [migrations/](migrations/)

**Files:**
1. `002_create_hospitals.sql` - Hospital table schema
2. `003_seed_hospitals.sql` - Sample data
3. `004_unique_hospital_name.sql` - Unique constraint

### Hospital Table Schema

```sql
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    hospital_type TEXT NOT NULL CHECK (hospital_type IN ('PUBLIC', 'PRIVATE')),
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_hospitals_name ON hospitals(name);
```

### SQLx Compile-Time Verification

**File:** [src/db/hospital_repo.rs](src/db/hospital_repo.rs)

Queries are verified at compile-time:

```rust
let hospitals = sqlx::query_as!(
    Hospital,
    r#"
    SELECT id, name, hospital_type, state, city, is_active, created_at
    FROM hospitals
    ORDER BY created_at DESC
    "#
)
.fetch_all(pool)
.await?;
```

If the query is invalid or columns don't match, **compilation fails** before deployment. ✅

---

## ⚙️ Configuration & Setup

### Environment Variables

**File:** [.env](.env)

```env
DATABASE_URL=postgresql://health_admin:strongpassword@localhost:5432/health_intel_mvp
JWT_SECRET=dev_secret_change_later
# Optional (defaults provided):
# HOST=127.0.0.1
# PORT=3000
```

### Settings Struct

**File:** [src/config/settings.rs](src/config/settings.rs)

```rust
pub struct Settings {
    pub database_url: String,
    pub jwt_secret: String,
    pub host: String,           // default: 127.0.0.1
    pub port: u16,              // default: 3000
}
```

Loaded via `envy` crate from environment.

---

## 🚀 Getting Started

### Prerequisites

- **Rust** 1.70+ ([Install](https://rustup.rs/))
- **Cargo** (comes with Rust)
- **PostgreSQL** 13+ ([Install](https://www.postgresql.org/download/))
- **Git** (for cloning)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd health-intel-backend
```

### Step 2: Set Up Environment

Copy and configure `.env`:

```bash
cp .env.example .env  # (if provided, or create from template)
```

Update `.env` with your PostgreSQL connection:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/health_intel_mvp
JWT_SECRET=your_secret_key_here
HOST=127.0.0.1
PORT=3000
```

### Step 3: Install Dependencies

```bash
cargo build
```

This downloads and compiles all dependencies.

### Step 4: Run Database Migrations

```bash
# If using sqlx-cli
sqlx migrate run --database-url $DATABASE_URL

# Or use your migration tool of choice
# Migrations are in: migrations/
```

### Step 5: Start Server

```bash
cargo run
```

**Output:**
```
🚀 Server running on http://127.0.0.1:3000
```

### Step 6: Test the API

**Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Swagger UI:**
Open browser: `http://localhost:3000/swagger-ui`

---

## 🧬 Data Models

### Hospital Entity

**Location:** [src/models/hospital.rs](src/models/hospital.rs)

```rust
pub struct Hospital {
    pub id: Uuid,
    pub name: String,
    pub hospital_type: String,        // PUBLIC or PRIVATE
    pub state: String,
    pub city: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

pub struct CreateHospitalRequest {
    pub name: String,                 // min 3 chars
    pub hospital_type: String,        // PUBLIC or PRIVATE
    pub state: String,
    pub city: String,
}
```

### Future Data Models (Planned)

- **Doctor** - Medical professionals
- **Patient** - Patient demographics
- **Visit** - Hospital visits/admissions
- **Staff** - Hospital employees
- **Department** - Hospital departments
- **Equipment** - Medical equipment inventory

---

## ✅ Current Implementation Status

### Completed ✓

- ✅ Axum web server setup
- ✅ PostgreSQL integration with sqlx
- ✅ Hospital CRUD endpoints (List, Get, Create)
- ✅ Unified API response structure
- ✅ Centralized error handling (AppError)
- ✅ Input validation (validator crate)
- ✅ Structured logging (tracing)
- ✅ OpenAPI/Swagger documentation
- ✅ Database connection pooling
- ✅ Environment configuration (envy)
- ✅ HTTP health check endpoint
- ✅ Integration tests for hospital endpoints

### In Progress 🔨

- 🔨 Authentication (JWT) - prepared in dependencies
- 🔨 More hospital operations (Update, Delete)
- 🔨 Pagination & filtering for list endpoints

### Planned 📋

- 📋 Doctor management endpoints
- 📋 Patient records management
- 📋 Staff management
- 📋 Hospital visits/appointments
- 📋 Role-based access control (RBAC)
- 📋 Audit logging
- 📋 File upload for medical records
- 📋 Real-time notifications (WebSocket)
- 📋 Analytics & reporting
- 📋 Frontend (React/Next.js)
- 📋 API rate limiting
- 📋 Request caching

---

## 🧩 Code Organization Principles

### 1. **Thin Routes**

Routes handle HTTP concerns only:

```rust
// ✅ Good
pub async fn get_hospitals(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<HospitalsResponse>>, AppError> {
    let hospitals = fetch_all_hospitals(&state.db).await?;
    Ok(Json(ApiResponse::success(HospitalsResponse { hospitals }, None)))
}
```

### 2. **Business Logic in Repository/Services**

Data access and business rules in separate layer:

```rust
// In db/hospital_repo.rs
pub async fn fetch_all_hospitals(pool: &PgPool) -> Result<Vec<Hospital>, sqlx::Error> {
    sqlx::query_as!(Hospital, "SELECT * FROM hospitals ORDER BY created_at DESC")
        .fetch_all(pool)
        .await
}
```

### 3. **Always Use ApiResponse**

Never return raw data or errors:

```rust
// ✅ Good
Ok(Json(ApiResponse::success(data, None)))

// ❌ Bad
Ok(Json(data))
```

### 4. **Explicit Error Handling**

No panics or unwraps in production code:

```rust
// ✅ Good
let hospital = hospital.ok_or(AppError::NotFound)?;

// ❌ Bad
let hospital = hospital.unwrap();
```

---

## 🚢 Deployment

### Building for Production

```bash
cargo build --release
```

Binary location: `target/release/health-intel-backend`

### Environment for Production

```env
DATABASE_URL=postgresql://prod_user:strong_password@prod-db.example.com:5432/health_intel
JWT_SECRET=random_secret_key_min_32_chars
HOST=0.0.0.0
PORT=3000
RUST_LOG=info
```

### Containerization (Planned)

A Dockerfile will be provided for Docker deployment.

---

## 📡 API Documentation

### Swagger UI

Interactive API documentation with "Try it Out" functionality:

```
http://localhost:3000/swagger-ui
```

### OpenAPI Spec

Raw OpenAPI 3.0 specification:

```
http://localhost:3000/api-docs/openapi.json
```

### API Doc Generation

**File:** [src/docs.rs](src/docs.rs)

Uses `utoipa` to auto-generate docs from code:

```rust
#[derive(OpenApi)]
#[openapi(
    paths(hospitals::get_hospitals, hospitals::create_hospital_handler),
    components(schemas(...)),
    tags((name = "Hospitals", description = "Manage hospital records"))
)]
pub struct ApiDoc;
```

Docs stay in sync with code automatically.

---

## 🔒 Security (Planned)

### Current State

- ✅ Input validation
- ✅ SQL injection prevention (via sqlx)
- ✅ Type-safe code (Rust)

### Roadmap

- 🔲 JWT authentication middleware
- 🔲 Role-based access control (RBAC)
- 🔲 Rate limiting
- 🔲 CORS configuration
- 🔲 HTTPS/TLS
- 🔲 Request signing
- 🔲 Audit trail for sensitive operations
- 🔲 Data encryption at rest

---

## 📊 Performance Characteristics

### Current Optimizations

- ✅ **Connection Pooling** - Max 10 concurrent DB connections
- ✅ **Async/Await** - Non-blocking I/O with Tokio
- ✅ **Compile-Time Verification** - SQLx catches bugs early
- ✅ **Type-Safe Serialization** - Serde with derive macros
- ✅ **Minimal Allocations** - Rust's ownership model

### Future Optimizations

- 📋 Response caching layer
- 📋 Database query caching
- 📋 Batch operation endpoints
- 📋 Pagination for large result sets
- 📋 Indexing strategy on frequently queried fields

---

## 🤝 Contributing

### Code Style

- Follow Rust naming conventions (snake_case for functions/variables)
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting

### Before Submitting Changes

```bash
# Format code
cargo fmt

# Run linter
cargo clippy -- -D warnings

# Run tests
cargo test

# Check compilation
cargo check
```

### Adding New Endpoints

1. Define request/response models in `src/models/`
2. Add handler in `src/routes/`
3. Add route to `src/routes/router.rs`
4. Add database access in `src/db/`
5. Add error handling if needed in `src/errors/`
6. Add tests in `tests/`
7. Update OpenAPI docs in `src/docs.rs`

---

## 📚 Project Roadmap

### Q1 2025 (Current)

- ✅ Core hospital management
- 🔲 Hospital update/delete endpoints
- 🔲 Pagination for hospital list

### Q2 2025

- 📋 Patient records management
- 📋 Doctor management
- 📋 JWT authentication
- 📋 Role-based access control

### Q3 2025

- 📋 Visit/appointment scheduling
- 📋 Audit logging
- 📋 Advanced search & filtering

### Q4 2025 & Beyond

- 📋 AI-driven insights
- 📋 Analytics dashboard
- 📋 Frontend application
- 📋 Third-party integrations

---

## 📞 Support & Resources

### Documentation

- [Axum Guide](https://github.com/tokio-rs/axum)
- [SQLx Documentation](https://github.com/launchbadge/sqlx)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Tokio Tutorial](https://tokio.rs/tokio/tutorial)

### Community

- Rust Discord: discord.gg/rust-lang
- Stack Overflow: Tag `rust`

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🙏 Acknowledgments

Built with:
- [Rust](https://www.rust-lang.org/) - Language
- [Axum](https://github.com/tokio-rs/axum) - Web framework
- [Tokio](https://tokio.rs/) - Async runtime
- [PostgreSQL](https://www.postgresql.org/) - Database
- [SQLx](https://github.com/launchbadge/sqlx) - SQL toolkit

---

## 📚 Documentation Hub

This project includes comprehensive documentation:

- **[Quick Start](./QUICK_START.md)** - 10-minute orientation
- **[Vision & Strategy](./docs/01-vision-and-strategy/)** - Why this project matters
- **[MVP Definition](./docs/02-mvp-definition/)** - What we're building
- **[Architecture](./docs/03-architecture/)** - How it works
- **[Development Logs](./docs/04-development-logs/)** - Progress & journey
- **[Challenges & Solutions](./docs/05-challenges-and-solutions/)** - Bugs & learnings
- **[Data Models](./docs/06-data-models/)** - Database design

**New to the project?** Start with [QUICK_START.md](./QUICK_START.md)

---

**Last Updated:** January 2025  
**Version:** 0.1.0  
**Status:** 🚀 Active Development

---

## Quick Commands Reference

```bash
# Development
cargo run                          # Start server
cargo build                        # Build project
cargo test                         # Run tests
cargo fmt                          # Format code
cargo clippy                       # Lint code

# Database
sqlx migrate run                   # Run migrations
sqlx database create               # Create database

# Documentation
cargo doc --open                   # View generated docs

# Optimization
cargo build --release              # Production build
cargo tree                         # Check dependencies

# Debugging
RUST_LOG=debug cargo run           # Run with debug logging
cargo expand                       # View macro expansions
```
