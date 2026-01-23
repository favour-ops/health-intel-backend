# 📦 MVP Definition

**What are we actually building first?**

This section defines v0.1 — the minimum viable proof that this concept works.

---

## 📄 Documents in This Section

### [1. MVP Scope & Features](./01-mvp-scope.md)

**What it covers:**
- Exactly what's included in v0.1
- Exactly what's NOT included (and why)
- User roles and permissions
- Success criteria

**Best for:** Understanding the first release

### [2. Core Modules (Detailed)](./02-core-modules.md)

**What it covers:**
- Authentication & Access
- Hospital & Capacity Management
- Incident Reporting
- Live Dashboard
- AI Features (minimal)

**Best for:** Developers building features

### [3. Feature List](./03-feature-checklist.md)

**What it covers:**
- Complete checklist of MVP features
- Priority levels
- Dependencies between features
- Build order

**Best for:** Project planning

---

## ⚡ Quick Summary

### MVP Goal

Prove that real-time capacity visibility reduces emergency delays and coordination chaos.

### MVP Scope

- 🏥 Hospital capacity management
- 📊 Live dashboard with real-time updates
- 🚨 Incident reporting
- 🔐 Role-based access (Admin / Observer)
- 🔍 Basic anomaly detection

### MVP Success Criteria

A hospital admin can:
- Update capacity in <10 seconds
- See updates reflected instantly

An observer can:
- See live system state
- Identify stressed hospitals

Demonstration of:
- 5 hospitals
- Live updates
- Incident spike
- Anomaly flag

### Out of Scope (For v0.1)

- ❌ Patient medical records
- ❌ Payments or insurance
- ❌ Citizen mobile app
- ❌ Full AI models
- ❌ Multi-language support
- ❌ Advanced notifications (SMS/email)

---

## 📊 Timeline

**Target:** 60-90 days from start to MVP

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| **Week 1-2** | 2 weeks | Backend API complete + Database |
| **Week 3-4** | 2 weeks | Dashboard basic functionality |
| **Week 5-6** | 2 weeks | WebSocket real-time updates |
| **Week 7-8** | 2 weeks | Testing & polish |
| **Week 9-12** | 4 weeks | Buffer, deployments, docs |

---

## 🎯 Why This Scope?

### Why We Include Hospital Capacity

- ✅ Real problem hospitals face daily
- ✅ Simple to understand
- ✅ Immediately useful
- ✅ Easy to measure impact

### Why We Exclude Patient Records

- ❌ Adds complexity (privacy, compliance)
- ❌ Belongs in EMR, not intelligence platform
- ❌ Not needed for v0.1 proof
- ✅ Can be added later

### Why We Exclude Citizen App

- ❌ Requires different tech stack
- ❌ Different user experience
- ❌ Not critical for MVP proof
- ✅ Can be built once hospital side works

### Why We Start Rule-Based AI

- ✅ Fast to build
- ✅ Immediately useful
- ✅ Less data required
- ✅ Can evolve to ML later

---

## 🚀 Getting Started

Read in order:

1. **[MVP Scope & Features](./01-mvp-scope.md)** - What's in, what's out
2. **[Core Modules](./02-core-modules.md)** - How it works
3. **[Feature Checklist](./03-feature-checklist.md)** - Build in this order
