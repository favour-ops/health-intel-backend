# Core Modules (Detailed)

## What Are We Actually Building in MVP?

This breaks down the MVP into 4 core modules. Each module is independent but they work together.

---

## MODULE 1: Authentication & Access 🔐

**Purpose:** Secure access, role-based permissions.

### Features

**User Management**
- Email + password signup
- Email + password login
- Logout
- Token refresh

**JWT Tokens**
- Access token (short-lived, 15 minutes)
- Refresh token (long-lived, 7 days)
- Refresh endpoint to get new access token

**Roles**
- Hospital Admin (can update capacity, report incidents)
- System Observer (read-only, can see everything)

**Session Management**
- Track who's logged in
- Invalidate tokens on logout
- Prevent token reuse

### Not in Scope (MVP)
- ❌ Social login
- ❌ Multi-factor authentication
- ❌ Password reset email
- ❌ User role assignment UI (manual for MVP)

### Tech

```rust
// JWT token structure
pub struct Claims {
    pub sub: String,        // user ID
    pub role: String,       // "admin" or "observer"
    pub hospital_id: String,// hospital they manage
    pub exp: i64,          // expiration timestamp
}
```

---

## MODULE 2: Hospital & Capacity Management 🏥

**Purpose:** Core functionality — track hospital capacity in real-time.

### Features

**Hospital Profile** (created once, rarely updated)
- Hospital name
- Location (latitude, longitude)
- Type (Public / Private)
- Contact phone
- Contact email
- Created date

**Real-Time Capacity** (updated constantly, broadcast live)
- Total beds
- Available beds
- ICU beds
- Emergency ward status (Open / Limited / Closed)
- Oxygen availability (Full / Low / None)
- Last updated timestamp

### Hospital Admin Can:
- View their own hospital
- Update capacity (takes 10 seconds)
- See other hospitals (read-only)
- See current system state

### System Observer Can:
- View all hospitals
- See all capacity data
- No edits

### Data Model

```rust
pub struct Hospital {
    pub id: Uuid,
    pub name: String,           // unique
    pub hospital_type: String,  // "PUBLIC" or "PRIVATE"
    pub lat: f64,
    pub lon: f64,
    pub state: String,
    pub city: String,
    pub phone: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
}

pub struct Capacity {
    pub hospital_id: Uuid,
    pub total_beds: i32,
    pub available_beds: i32,
    pub icu_beds: i32,
    pub emergency_status: String, // "OPEN", "LIMITED", "CLOSED"
    pub oxygen_level: String,     // "FULL", "LOW", "NONE"
    pub updated_at: DateTime<Utc>,
    pub updated_by: Uuid,         // user who updated it
}
```

### API Endpoints

```
GET  /api/v1/hospitals              → List all
POST /api/v1/hospitals              → Create (admin only)
GET  /api/v1/hospitals/{id}         → Get one
PATCH /api/v1/hospitals/{id}        → Update (admin only)
PATCH /api/v1/hospitals/{id}/capacity → Update capacity (admin only)
```

### Why This Module First?
- Hospitals feel this pain daily
- Data they already know
- Easy to measure impact
- Foundation for everything else

---

## MODULE 3: Incident Reporting 🚨

**Purpose:** Report problems and emergencies in real-time.

### Features

**Incident Creation**
- Hospital admin reports incident
- Select incident type
- Add severity level
- Short description
- Timestamp (auto)

**Incident Types**
- Accident / mass casualty
- Equipment shortage
- Staff shortage
- Outbreak suspicion
- Utility failure (power, water)
- Other

**Severity Levels**
- Low (informational)
- Medium (needs attention)
- High (critical)

**Incident Lifecycle**
- Create → Open
- Manually resolve → Resolved
- System stores history

### Hospital Admin Can:
- Create incident
- Mark as resolved
- See their own incidents
- See other hospitals' incidents (context)

### Observer Can:
- See all incidents
- No edits

### Data Model

```rust
pub struct Incident {
    pub id: Uuid,
    pub hospital_id: Uuid,
    pub incident_type: String,     // "ACCIDENT", "SHORTAGE", etc
    pub severity: String,          // "LOW", "MEDIUM", "HIGH"
    pub description: String,
    pub status: String,            // "OPEN" or "RESOLVED"
    pub created_at: DateTime<Utc>,
    pub created_by: Uuid,
    pub resolved_at: Option<DateTime<Utc>>,
}
```

### API Endpoints

```
POST /api/v1/incidents              → Create
GET  /api/v1/incidents              → List all
GET  /api/v1/hospitals/{id}/incidents → Hospital's incidents
PATCH /api/v1/incidents/{id}        → Update (resolve)
```

### Why This Module?
- Real-world proof
- Shows coordination potential
- Feeds into anomaly detection
- Hospitals want this

---

## MODULE 4: Live Dashboard & Real-Time Updates 📊

**Purpose:** See everything that's happening, right now.

### Dashboard Components

**Hospital Grid / Table**
```
Hospital Name | Available Beds | ICU | Emergency | Oxygen | Status
Central       | 5/50          | 0/10| Open      | Low    | ⚠
Private Med   | 25/100        | 8/20| Limited   | Full   | ✅
Teaching      | 0/200         | 15/30| Open      | None   | 🔴
```

**Live Incident Feed**
```
[CRITICAL] Teaching Hospital - Emergency mass casualty, 10 patients incoming
[HIGH] Central Hospital - Oxygen shortage
[MEDIUM] Private Med - Staff shortage
```

**Status Indicators**
- 🟢 Green: Normal (>20% capacity)
- 🟡 Yellow: Stressed (5-20% capacity)
- 🔴 Red: Critical (<5% capacity)

**Anomaly Alerts**
```
⚠️ Teaching Hospital: Unusual activity detected
   - Emergency visits up 300%
   - ICU capacity at 95%
```

### Real-Time Updates (WebSocket)

**Connection:**
```
Client connects to /ws
  → Server verifies JWT
  → Adds to broadcast group
  → Sends "Connected" message
```

**Broadcast Pattern:**
```
When any hospital updates capacity:
  → Backend publishes to broadcast channel
  → ALL connected clients receive update immediately
  → Dashboard updates without refresh
```

**Messages Sent Over WebSocket**
```json
{
  "type": "capacity_update",
  "hospital_id": "550e8400...",
  "available_beds": 5,
  "updated_at": "2025-01-23T10:30:00Z"
}

{
  "type": "incident_created",
  "hospital_id": "550e8400...",
  "severity": "HIGH",
  "description": "Oxygen shortage"
}

{
  "type": "anomaly_detected",
  "hospital_id": "550e8400...",
  "reason": "Emergency visits up 300%"
}
```

### Why WebSocket?

**HTTP Polling (❌ Bad)**
```
Client: "Any updates?" every 5 seconds
Server: "No" (90% of the time)
Result: Wasted bandwidth, latency
```

**WebSocket (✅ Good)**
```
Server: "Hospital updated → publish immediately"
Client: Receives update instantly
Result: Real-time, efficient
```

---

## How They Work Together

```
User logs in
    ↓
Authentication module verifies JWT
    ↓
User sees hospital list (Module 2)
    ↓
Hospital updates capacity (Module 2)
    ↓
Incident reported (Module 3)
    ↓
WebSocket broadcasts (Module 4)
    ↓
All dashboards update instantly
    ↓
Observer sees change
    ↓
Audit log records: "User X updated Hospital Y at time Z"
```

---

## Success Criteria for Each Module

### Module 1 (Auth)
- ✅ User can login
- ✅ Tokens work
- ✅ Unauthorized access blocked
- ✅ Token refresh works

### Module 2 (Capacity)
- ✅ Hospital can update in <10 seconds
- ✅ Data persists correctly
- ✅ Unique hospital names
- ✅ Capacity values validated (non-negative)

### Module 3 (Incidents)
- ✅ Hospital can create incident
- ✅ Incident appears instantly
- ✅ Can mark resolved
- ✅ History preserved

### Module 4 (Dashboard)
- ✅ WebSocket connects successfully
- ✅ Updates broadcast <2 seconds
- ✅ No data loss
- ✅ Handles 5 hospitals smoothly

---

## Build Order

1. **Module 1** (Auth) — Foundation for everything
2. **Module 2** (Capacity) — Core value
3. **Module 3** (Incidents) — Coordination value
4. **Module 4** (Dashboard) — Visibility

Each depends on previous modules.

---

## Implementation Time Estimates

| Module | Backend | Frontend | Tests | Total |
|--------|---------|----------|-------|-------|
| Auth | 5 days | 3 days | 2 days | 10 days |
| Capacity | 8 days | 5 days | 3 days | 16 days |
| Incidents | 5 days | 4 days | 2 days | 11 days |
| Dashboard | 7 days | 8 days | 3 days | 18 days |
| **Total** | 25 days | 20 days | 10 days | 55 days |

This assumes one full-time backend + one full-time frontend developer.

---

## Next Steps

Read: [Feature Checklist](./03-feature-checklist.md) for granular build order.
