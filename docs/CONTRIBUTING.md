# 📝 Documentation Contribution Guide

**How to document your work so others learn and future you remembers why you did it.**

---

## Why Documentation Matters

Good documentation:
- ✅ Saves time (onboarding new people)
- ✅ Prevents repeated mistakes
- ✅ Shows your thought process
- ✅ Becomes portfolio material
- ✅ Helps you learn better (writing = thinking)

---

## When to Document

### Always Document:
- ✅ New features completed
- ✅ Bugs fixed (add to Challenges & Solutions)
- ✅ Architecture decisions made
- ✅ Lessons learned from failures
- ✅ Performance improvements

### Frequently Document:
- ✅ Weekly progress updates (Development Logs)
- ✅ Data model changes
- ✅ API endpoint additions

### Optionally Document:
- ⭐ Code refactoring
- ⭐ Small bug fixes
- ⭐ Internal improvements

---

## Documentation Structure

```
docs/
├── 01-vision-and-strategy/     ← Big picture stuff (changes rarely)
├── 02-mvp-definition/          ← What we're building (changes rarely)
├── 03-architecture/            ← How it works (changes as we build)
├── 04-development-logs/        ← What we did when (growing daily)
├── 05-challenges-and-solutions/← Problems & solutions (add as we hit them)
└── 06-data-models/            ← Data structure (changes with schema)
```

---

## Writing Standards

### Tone

- **Clear and direct** - No marketing fluff
- **Honest** - Include failures, not just successes
- **Accessible** - Explain jargon or avoid it
- **Helpful** - Answer the reader's question completely

### Format

- **Headings** for structure (makes skimmable)
- **Bullet points** for lists
- **Code blocks** when necessary (not verbose)
- **Real examples** from the project
- **Questions & answers** for explanations

### Length

- **Aim for 300-1000 words** per doc
- **Use sections** to break up long content
- **Link to other docs** instead of repeating

### Readers

Write for **both technical and non-technical people**:
- Explain acronyms
- Use analogies
- Show the "why" before the "how"

---

## Templates by Document Type

### Development Log Entry

**When:** After completing a feature or significant work  
**Where:** `docs/04-development-logs/[date]-[title].md`  
**Frequency:** Weekly or after major milestones

```markdown
# Development Log: [Feature/Work] - January 23, 2025

## 📋 Summary
One sentence: what was accomplished.

## ✅ What Was Done
- Implemented hospital CRUD endpoints
- Added JWT authentication
- Created WebSocket server
- Written 15 tests

## 🎯 Why
Why was this important? How does it move us toward MVP?

## 🚧 Challenges
What was harder than expected?
- Challenge 1: [description]
- Challenge 2: [description]

## 💡 Solutions
How did we overcome them?
- Solution 1: [description]
- Solution 2: [description]

## 📊 Metrics
- Lines added: X
- Tests added: Y
- Performance impact: [if applicable]
- Time spent: X hours

## 🧠 Lessons Learned
What will you do differently next time?

## 🔮 Next Up
What comes next?

## 🔗 References
- PR #123
- Commit abc123
- Related doc: [link]
```

---

### Challenge & Solution Entry

**When:** After fixing a bug or solving a blocker  
**Where:** `docs/05-challenges-and-solutions/[number]-[title].md`  
**Frequency:** As issues arise

```markdown
# Challenge: [Title]

**Date:** January 23, 2025  
**Status:** ✅ Resolved

## 🔴 Problem
What went wrong? How did you discover it?

### Reproduction Steps
1. Step 1
2. Step 2
3. Result: What happens

## 🔍 Root Cause
Why did it happen?

### Code Sample
```rust
// Buggy code
```

## ✅ Solution
What fixed it?

### Code Changes
```rust
// Before
old_code

// After
new_code
```

## 🧠 Lessons Learned
- What will you do differently?
- What pattern should others avoid?
- Any gotchas to watch for?

## 📊 Impact
- Time to resolve: X hours
- Severity: Low / Medium / High
- Affected features: [list]

## 🔗 References
- [PR #123](link)
- [Stack Overflow](link)
- [GitHub Issue](link)
```

---

### Data Model Entry

**When:** Adding or modifying a database entity  
**Where:** `docs/06-data-models/[number]-[entity-name].md`  
**Frequency:** When schema changes

```markdown
# [Entity Name] Model

## Purpose
Why does this entity exist?

## Table Schema

```sql
CREATE TABLE [name] (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Fields

| Field | Type | Constraint | Purpose |
|-------|------|-----------|---------|
| id | UUID | PK | Identifier |
| field | TEXT | NOT NULL | ... |

## Relationships

| Field | References | Type | Purpose |
|-------|-----------|------|---------|
| hospital_id | hospitals(id) | FK | ... |

## Indexing

```sql
CREATE INDEX idx_entity_field ON entity(field);
```

## Example Data

```json
{
  "id": "550e8400...",
  "field": "value"
}
```

## Validation

- Field X must be: ...
- Field Y cannot be: ...

## Migration History

- 2025-01-23: Initial schema
```

---

## Writing Tips

### 1. Start with the Problem
Don't jump to solution. Explain what was broken.

❌ Bad:
```
We used WebSockets instead of HTTP polling.
```

✅ Good:
```
HTTP polling meant asking "any updates?" every 5 seconds.
90% of the time: "No". Wasted bandwidth.
WebSocket solution: Server calls us when something changes.
Why it matters: Real emergencies can't wait for polling cycles.
```

### 2. Include Concrete Numbers
Vague is unhelpful.

❌ Bad:
```
Performance improved significantly.
```

✅ Good:
```
Database queries reduced from 150ms to 45ms (70% improvement).
WebSocket broadcast latency: <100ms (meets our requirement).
```

### 3. Explain the Why
Anyone can describe what happened. Explain why it matters.

❌ Bad:
```
Added JWT authentication.
```

✅ Good:
```
Added JWT authentication to:
- Identify which hospital admin made each change
- Enable role-based access (Hospital Admin vs Observer)
- Prepare for government audit requirements
These are non-negotiable for a health system.
```

### 4. Link Everything
Reference related docs, issues, PRs.

```markdown
See [MVP Definition](../02-mvp-definition/) for context.
Related PR: [#123](https://github.com/...)
Challenges: See [WebSocket Connection Issues](../05-challenges-and-solutions/003-websocket.md)
```

---

## Review Before Publishing

### Checklist

- [ ] Explains the what, why, and how
- [ ] Includes concrete examples or numbers
- [ ] Links to related docs
- [ ] Would make sense to someone new to the project?
- [ ] Honest about challenges and trade-offs?
- [ ] Free of jargon (or jargon is explained)?
- [ ] References PRs/commits?

---

## Updating Existing Docs

When you find something unclear or wrong:

1. **Fix it immediately** - Don't let unclear docs compound
2. **Add a note** - "Updated Jan 23: clarified WebSocket behavior"
3. **Link the change** - "See PR #456 for implementation"

Docs are living. Keep them current.

---

## Converting Docs to Blog Posts

Some docs become blog posts:

1. Polish the writing (remove internal notes)
2. Add a "teaser" paragraph at the top
3. Add a "next steps" section at the bottom
4. Include an author bio
5. Publish with link back to docs

Example posts:
- "Designing Systems for Three-Party Alignment"
- "Real-Time Health Intelligence with WebSockets"
- "Lessons from Building Health Intel"

---

## Questions to Guide Your Documentation

Before writing, answer these:

1. **Who is the reader?** (developer, PM, investor?)
2. **What do they need to know?** (big picture, details, decision?)
3. **What will they do with this info?** (build, decide, pitch?)
4. **What might they misunderstand?** (explain that)
5. **What's the one thing they should remember?** (emphasize that)

---

## Example: Before & After

### Before (Unclear)

```
Fixed bug in capacity update endpoint. 

Changed the error handling to return proper HTTP status codes.
Now returns 409 if hospital name already exists instead of 500.

This required updating the database error converter.
```

### After (Clear)

```
# Challenge: Wrong HTTP Status for Duplicate Hospital Names

## Problem

When creating a hospital with a duplicate name, the system returned HTTP 500 (Server Error) instead of HTTP 409 (Conflict).

This confused clients — they thought the server crashed when it was actually just a validation issue.

### Impact
- Emergency response dashboard would show red error alerts
- Hospital admins would think the system was broken
- Retry logic in clients would behave incorrectly

## Root Cause

PostgreSQL raised error code `23505` (unique constraint violation).

Our error handler was catching it as a generic database error and returning 500.

### Error Flow
```rust
// Before: All DB errors → 500
Err(sqlx::Error::Database(...)) → 500 Internal Error

// After: Specific handling
Err(sqlx::Error::Database(db_err)) if db_err.code() == "23505" → 409 Conflict
```

## Solution

Updated [src/errors/db.rs](https://...) to detect the specific error code:

```rust
if db_err.code().as_deref() == Some("23505") {
    return AppError::Conflict("Hospital with this name already exists");
}
```

Now:
- ✅ Duplicate names → HTTP 409
- ✅ Clients handle correctly
- ✅ Matches REST conventions
- ✅ Better user experience

## Lesson

Always distinguish between:
- Client error (4xx) - Client did something wrong
- Server error (5xx) - Server failed

This matters for observability and client behavior.

## References
- [PR #45](https://...)
- [Commit abc123](https://...)
```

**Much better!** Notice:
- Explains the impact
- Shows the before/after code
- Includes the lesson
- References the PR
```

---

## Getting Started

Pick one:

1. **Add a development log** for work you just finished
2. **Document a challenge** you solved recently
3. **Update a data model** doc if you changed schema

Start small. Write one doc. Get feedback. Improve.

---

## Questions?

Most questions answered in related docs:
- [Vision & Strategy](./docs/01-vision-and-strategy/)
- [Architecture](./docs/03-architecture/)
- [Development Logs](./docs/04-development-logs/)

If something is unclear in the docs, **that's a bug in the docs.**

Fix it and push the change. Improving docs is as important as improving code.

---

**Remember:** Good documentation is an investment in your team, your future self, and the project's success.

Write well. Document thoroughly. Future you will thank you.
