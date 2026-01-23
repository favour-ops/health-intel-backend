# MVP Scope & Features

## What Are We Building?

### One-Sentence Definition

A real-time hospital capacity and incident coordination system that reduces emergency delays and improves hospital operational efficiency.

---

## ✅ What's INCLUDED (MVP)

### 1. Hospital Management
- Hospital registration
- Hospital profile (name, location, type)
- Hospital admin users

### 2. Capacity Management (Core)
- Real-time bed availability tracking
- ICU bed status
- Emergency ward status (Open/Limited/Closed)
- Oxygen availability status
- All updates timestamped and broadcast live

### 3. Incident Reporting
- Report incidents (accident, surge, shortage, staff issue)
- Severity levels (Low/Medium/High)
- Live incident feed

### 4. Authentication
- Email + password login
- JWT-based auth
- Role-based access (Admin / Observer)
- Session management

### 5. Live Dashboard
- Hospital list with current capacity
- Live incidents feed
- Status indicators (color-coded)
- Real-time updates (no page refresh needed)
- Optional: Simple map view

### 6. AI Features (Minimal, Rule-Based)
- Anomaly detection:
  - Sudden drop in available beds
  - ICU capacity >90%
  - Incident spike within time window
- Flag unusual activity on dashboard

### 7. Audit & Logging
- Every capacity update logged
- Every incident creation logged
- Timestamp + user information
- Searchable audit trail

---

## ❌ What's NOT INCLUDED (Explicitly Out of Scope for v0.1)

### Medical/Clinical
- ❌ Patient medical records
- ❌ Patient health data
- ❌ Diagnosis or clinical decision support
- ❌ Medical imaging or test results

### Financial
- ❌ Payments or insurance
- ❌ Billing integration
- ❌ Reimbursement tracking
- ❌ Cost allocation

### Citizen-Facing
- ❌ Citizen mobile app
- ❌ Patient portal
- ❌ Public-facing website
- ❌ Emergency SOS button

### Advanced Features
- ❌ Multi-language support
- ❌ SMS/email notifications
- ❌ Video conferencing
- ❌ Advanced ML models
- ❌ Analytics reports

### Integration
- ❌ Direct EMR integration
- ❌ External API integrations
- ❌ Third-party authentication
- ❌ HL7/FHIR standards (yet)

**Why these are out of scope:**
- Add complexity without MVP proof
- Can be added after v0.1 works
- Require external dependencies we don't need yet

---

## 👥 User Roles (Only 2)

### Role 1: Hospital Admin

**Can:**
- Update hospital capacity (beds, ICU, oxygen)
- Report incidents
- View hospital dashboard
- View other hospitals (read-only)

**Cannot:**
- Edit other hospitals
- Access reports
- Configure system

**Use Case:**
- "Beds just filled up, update the system"
- "We have oxygen shortage, report it"
- "Check where can we send overflow patients"

---

### Role 2: System Observer (Read-Only)

**Can:**
- View all hospitals
- View all capacity data
- View all incidents
- View audit logs
- See live updates

**Cannot:**
- Modify anything
- Update capacity
- Report incidents

**Use Case:**
- Government ministry monitoring
- Emergency response coordinator
- System admin
- Future: becomes journalist, public access

---

## 📊 Success Criteria

Your MVP is successful when:

### Technical Criteria
- ✅ Hospital can update capacity in <10 seconds
- ✅ All users see updates in <2 seconds (WebSocket broadcast)
- ✅ No lost updates or data corruption
- ✅ System handles 5 concurrent hospitals

### Functional Criteria
- ✅ Hospital admin can log in
- ✅ Capacity updates are timestamped
- ✅ Incidents appear on live feed immediately
- ✅ Anomaly detection fires correctly

### Demo Criteria (for investor/stakeholder)
- ✅ Can show 5 hospitals on map
- ✅ Simulate incident spike
- ✅ Watch capacity update live
- ✅ Show anomaly flag appears
- ✅ Access audit trail

---

## 🎯 Why This Specific Scope?

### Hospital Capacity First
- Hospitals feel this pain daily
- Data they already know internally
- Easy to measure impact
- Foundation for everything else

### Role-Based Access First
- Prepares for government/citizen layer
- Shows we're thinking about security early
- Not complex yet, but scalable

### Audit Trail from Day 1
- Non-negotiable for government acceptance
- Prepares us for compliance later
- Shows we're serious about accountability

### Live Updates (WebSocket)
- Shows the real-time capability immediately
- Creates "wow" moment when you see it
- Essential for emergency coordination
- Separates us from basic CRUD apps

### Rule-Based AI First
- Demonstrates intelligence without complexity
- Proves anomaly detection concept
- Can be upgraded to ML later
- Stakeholders can verify it's working

---

## 📦 Deliverables

By end of MVP, you'll have:

✅ **Backend**
- Rust/Axum REST API
- PostgreSQL database
- JWT authentication
- WebSocket server
- Audit logging
- Rule-based anomaly detection

✅ **Frontend**
- Next.js dashboard
- Hospital login
- Capacity update form
- Live dashboard
- Incidents feed
- Audit log viewer

✅ **Documentation**
- API documentation (OpenAPI/Swagger)
- Database schema docs
- Deployment guide
- User guide (hospital admin)

✅ **Testing**
- API integration tests
- WebSocket tests
- Authentication tests
- Anomaly detection tests

---

## 🚀 Next Steps

Once MVP is done and working:

**Phase 2 (After MVP):**
- Update/Delete operations
- Pagination and filtering
- Patient reference records (minimal)
- Advanced search

**Phase 3:**
- Citizen mobile app
- AI-powered routing
- Government dashboard
- Analytics & reporting

**Phase 4:**
- EMR integrations
- Full patient records
- Advanced ML models
- Third-party integrations

But for now: Build MVP, prove the concept, then expand.
