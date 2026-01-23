# 🚨 Challenges & Solutions

**Real problems we faced and how we solved them.**

This section documents bugs, blockers, performance issues, and lessons learned.

---

## 📄 Starter Challenges

### [Challenge 1: Understanding Real-Time Requirements](./001-realtime-requirements.md)

**Problem:** How do we actually implement "real-time"? What's fast enough?

**Solution:** WebSocket architecture with broadcast channels.

**Lesson:** Real-time has different meanings in different contexts.

---

### [Challenge 2: API Response Consistency](./002-api-response-consistency.md)

**Problem:** Every endpoint was returning slightly different response shapes.

**Solution:** Generic `ApiResponse<T>` wrapper with unified error handling.

**Lesson:** Standardization early saves refactoring later.

---

### [Challenge 3: Testing Async Code](./003-testing-async-code.md)

**Problem:** How do you test Tokio/async code reliably?

**Solution:** Use `tokio::test` macro and proper cleanup.

**Lesson:** Async testing requires different patterns than sync code.

---

## 📝 How to Add a Challenge

When you hit a bug or blocker:

1. Create a file: `[number]-[short-title].md`
   - Example: `004-websocket-connection-leaks.md`

2. Fill in the template:

```markdown
# Challenge: [Title]

## 🔴 Problem
What went wrong? How did you discover it?

## 🔍 Root Cause
Why did it happen?

## ✅ Solution
How did you fix it?

## 🧠 Lessons Learned
What will you do differently next time?

## 📖 References
- Stack Overflow link
- GitHub issue
- Documentation

## ⏰ Time to Resolve
How long did this take to figure out?

## 🔗 Related Code
- PR that fixed it
- Commit hash
- File path
```

3. Be specific with code examples

4. Include timestamps and context

5. Link to commits/PRs that fixed it

---

## 🎯 Why Document Failures

- ✅ Others learn from your mistakes
- ✅ You don't repeat the same mistake
- ✅ Shows problem-solving process
- ✅ Builds credibility ("we know what we're doing")

---

## Challenge Categories

### Technical Challenges
- Database issues
- Performance problems
- Integration bugs
- Architecture decisions

### Process Challenges
- Planning accuracy
- Scope creep
- Communication
- Testing coverage

### Learnings
- "What I should have known"
- "Better way to do X"
- "Tool recommendation"
- "Gotcha to watch for"

---

## Template

Use this for each new challenge:

```markdown
# Challenge: [Title]

**Date:** January 23, 2025
**Status:** Resolved / In Progress / Workaround

## 🔴 Problem
Describe the bug/blocker. How did you first notice it?

### Reproduction Steps
1. Step 1
2. Step 2
3. Step 3
Result: [what happens]

## 🔍 Root Cause
Why did this happen? Include:
- Code snippet
- System behavior
- Environment info

## ✅ Solution
What fixed it?

### Code Changes
```rust
// Before
[code]

// After
[code]
```

## 🧠 Lessons Learned
- What will you do differently?
- What would you tell someone else?
- Any gotchas to watch for?

## 📊 Impact
- Time spent: X hours
- Severity: Low / Medium / High
- Affected features: [list]

## 🔗 References
- [PR #123](link)
- [Commit abc123](link)
- [Stack Overflow](link)
```

---

## Getting Started

Add your first challenge today, even if it's rough.

**Don't wait for perfection.**
