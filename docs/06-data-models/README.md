# 🗄 Data Models

**The shape of our data and how it changes.**

This section documents database schemas, entities, and data relationships.

---

## 📄 Core Models

### [Hospital Entity](./01-hospital-entity.md)

**What it covers:**
- Hospital table schema
- Fields and constraints
- Relationships
- Indexing strategy

### [Capacity Model](./02-capacity-model.md)

**What it covers:**
- Real-time capacity tracking
- Bed availability
- ICU status
- Oxygen levels
- Historical tracking

### [Incident Model](./03-incident-model.md)

**What it covers:**
- Incident reporting structure
- Incident types
- Severity levels
- Status tracking
- Timeline

### [Audit Log Model](./04-audit-log-model.md)

**What it covers:**
- Immutable change history
- Who, what, when
- Data integrity
- Compliance

### [User & Auth Model](./05-user-auth-model.md)

**What it covers:**
- User entity
- Password storage
- JWT tokens
- Session management
- Role assignment

---

## 🗺 Entity Relationship Diagram

```
┌──────────────┐
│   Hospital   │
│──────────────│
│ id (UUID)    │◄─────┐
│ name         │      │
│ type         │      │
│ state        │      │
│ city         │      │
│ created_at   │      │
└──────────────┘      │
       △              │
       │              │
       │1    *        │
       │     │        │
┌──────────────┐      │
│  Capacity    │      │
│──────────────│      │
│ hospital_id  │──────┘
│ beds_total   │
│ beds_available
│ icu_beds     │
│ oxygen_level │
│ updated_at   │
└──────────────┘

       ◄────────┐
       │        │
┌──────────────┐ │
│   Incident   │ │
│──────────────│ │
│ hospital_id  │─┘
│ type         │
│ severity     │
│ description  │
│ created_at   │
└──────────────┘

       ◄────────┐
       │        │
┌──────────────┐ │
│  Audit Log   │ │
│──────────────│ │
│ entity_type  │ ├─ Hospital/Capacity/Incident
│ entity_id    │─┘
│ action       │
│ changed_by   │
│ before       │
│ after        │
│ timestamp    │
└──────────────┘
```

---

## 📊 Quick Reference

| Entity | Purpose | Mutable | Critical |
|--------|---------|---------|----------|
| Hospital | Hospital registration | Yes (name, location) | ✅ Yes |
| Capacity | Real-time status | Yes (beds, oxygen) | ✅ Yes |
| Incident | Event reporting | Yes (status) | ✅ Yes |
| Audit Log | Change history | No (immutable) | ✅ Yes |
| User | Authentication | Yes (password, role) | ✅ Yes |

---

## 🔑 Key Constraints

### Data Integrity
- Hospital names must be unique
- Capacity values must be non-negative
- Timestamp fields are immutable
- Audit log entries are immutable

### Performance
- Index on hospital.name (for lookup)
- Index on capacity.hospital_id (for real-time updates)
- Index on incident.hospital_id (for feed)
- Index on audit_log.timestamp (for search)

### Compliance
- No patient data in database
- No passwords stored (only hash)
- Audit trail is immutable
- Deletion is soft (marked inactive, not removed)

---

## 📝 How to Add a New Model

When adding a new entity:

1. Create a file: `[number]-[entity-name]-model.md`

2. Document:
   - Purpose of the entity
   - All fields with types
   - Constraints and validation
   - Relationships to other entities
   - Indexing strategy
   - Example data

3. Include SQL schema

4. Update the ER diagram above

5. Update this README

---

## TEMPLATE.md

```markdown
# [Entity Name] Model

## Purpose
Why does this entity exist?

## Schema

### Table Definition
```sql
CREATE TABLE [table_name] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name TYPE CONSTRAINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Fields

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| id | UUID | Primary Key | Unique identifier |
| field2 | TEXT | NOT NULL | ... |

## Relationships

| Relation | To | Type | Purpose |
|----------|----|----|---------|
| hospital_id | Hospital | FK | Which hospital |

## Indexing

```sql
CREATE INDEX idx_table_field ON table_name(field);
```

## Example Data

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "field": "value"
}
```

## Validation Rules

- Field X must be: ...
- Field Y cannot be: ...

## Migration History

- 2025-01-23: Initial schema
```

---

## Getting Started

Read [Hospital Entity](./01-hospital-entity.md) first to understand the pattern.
