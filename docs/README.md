# Health Intel Documentation

Welcome to the Health Intel documentation hub. This folder contains the complete journey of building a national health intelligence platform — from vision to implementation.

**Purpose:** Document not just the code, but the *thinking*, *decisions*, *challenges*, and *learnings* along the way. This documentation is written for both engineers and laypeople.

---

## 📚 Documentation Structure

### [01. Vision & Strategy](./01-vision-and-strategy/)

**What is this project really about?**

- The big picture problem we're solving
- Why this matters for citizens, hospitals, and government
- The underlying economic and behavioral incentives
- One-sentence spine: what this system is, at its core

**Start here** if you're new to the project.

---

### [02. MVP Definition](./02-mvp-definition/)

**What are we building first?**

- MVP scope (what's included, what's not)
- User roles and permissions
- Core features broken down into modules
- Success criteria and deliverables
- Why we're NOT building the full vision yet

**Read this** if you want to understand what ships in v0.1.

---

### [03. Architecture & Design Decisions](./03-architecture/)

**How does this system work?**

- System architecture overview
- Tech stack reasoning
- Data flow and real-time patterns
- Design decisions and trade-offs
- Why we chose Rust, Axum, PostgreSQL, WebSockets

**Read this** if you're building features or integrating systems.

---

### [04. Development Logs](./04-development-logs/)

**The day-to-day journey.**

- What was built when
- Technical decisions made during development
- Commits and milestones
- Progress updates
- Planned work

**Check this** for real-time development status.

---

### [05. Challenges & Solutions](./05-challenges-and-solutions/)

**What got stuck and how we fixed it.**

- Bugs encountered and debugged
- Technical blockers and workarounds
- Performance issues and optimizations
- Lessons learned from failures
- "What we'd do differently"

**Read this** to avoid repeating our mistakes.

---

### [06. Data Models](./06-data-models/)

**The shape of our data.**

- Hospital entity schema
- Capacity tracking structure
- Incident reporting model
- Audit log design
- ER diagrams
- Database evolution and migrations

**Reference this** when working with data.

---

## 🗂 How to Navigate

### For **Product Managers / Non-Technical People**

1. Read [Vision & Strategy](./01-vision-and-strategy/) first
2. Then [MVP Definition](./02-mvp-definition/) to understand scope
3. Then skim [Development Logs](./04-development-logs/) for progress

### For **Developers**

1. Start with [Architecture & Design Decisions](./03-architecture/)
2. Reference [Data Models](./06-data-models/) while coding
3. Check [Challenges & Solutions](./05-challenges-and-solutions/) before diving into tricky areas
4. Skim [Development Logs](./04-development-logs/) for context

### For **Decision Makers / Investors**

1. Read [Vision & Strategy](./01-vision-and-strategy/) for "why this matters"
2. Check [MVP Definition](./02-mvp-definition/) for "what's realistic"
3. Scan [Development Logs](./04-development-logs/) for "what's done"
4. Review [Challenges & Solutions](./05-challenges-and-solutions/) for "risk assessment"

---

## 📖 Reading Level

Each document is written with **laypeople in mind**:

- ✅ Avoids jargon (or explains it clearly)
- ✅ Uses analogies and real-world examples
- ✅ Explains the *why* before the *how*
- ✅ Includes diagrams, not just text
- ✅ Shows code snippets only when necessary

---

## 📝 Writing Style

This documentation uses:

- **Clear headings** to break up sections
- **Bullet points** for lists (easy scanning)
- **Real examples** from the project
- **Questions and answers** format for explanations
- **Code blocks** only when crucial
- **Analogies** to explain complex ideas

Example:

> **Q: Why do we use WebSockets?**
>
> A: Think of it like this:
> - Regular HTTP = you call the hospital asking "any updates?" → they answer
> - WebSocket = the hospital calls you automatically when something changes
>
> For a live dashboard, WebSocket is faster because hospitals don't have to wait for us to ask.

---

## 🔄 Updating Documentation

### When to Document

- **After every major feature** is completed
- **When a bug is fixed** (add to Challenges & Solutions)
- **When an architectural decision** is made
- **When you learn something** the hard way
- **Weekly or bi-weekly** in Development Logs

### How to Add Content

1. Open the relevant folder
2. Create a new `.md` file
3. Use the template provided in that folder
4. Update the section's `README.md` with a link
5. Update the main `docs/README.md` if needed

### Templates Available

- [Development Log Entry Template](./04-development-logs/TEMPLATE.md)
- [Challenge & Solution Template](./05-challenges-and-solutions/TEMPLATE.md)
- [Data Model Template](./06-data-models/TEMPLATE.md)

---

## 📊 Quick Stats

**Current Status:** Pre-MVP (Hospital Management APIs Complete)

| Area | Status | Docs |
|------|--------|------|
| Hospital CRUD | ✅ Complete | [API Docs](./03-architecture/api-endpoints.md) |
| Real-time Updates | 🔨 In Progress | [WebSocket Design](./03-architecture/realtime-strategy.md) |
| Authentication | 🔨 In Progress | [Auth Design](./03-architecture/authentication.md) |
| AI Features | 📋 Planned | [AI Roadmap](./01-vision-and-strategy/ai-roadmap.md) |
| Citizen App | 📋 Planned | [Citizen UX](./02-mvp-definition/citizen-flows.md) |

---

## 🎯 What's Coming

- Blog-style versions of these docs (Markdown → HTML)
- Visual diagrams and flowcharts
- Video walkthroughs
- Interactive tutorials
- FAQ section

---

## 💬 Questions?

If something in the docs is unclear:

1. Check if there's a related doc
2. Search for keywords in the relevant folder
3. Check [Challenges & Solutions](./05-challenges-and-solutions/) for common issues

---

**Last Updated:** January 2025  
**Next Review:** Check [Development Logs](./04-development-logs/) for latest
