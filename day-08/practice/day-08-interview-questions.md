# Day 8: useEffect - Interview Questions

## 📋 Basic Concepts

### 1. What is useEffect?
**Answer:** Hook for handling side effects (API calls, subscriptions, timers).

**Follow-up:** When does it run?

---

### 2. What is the dependency array?
**Answer:** Array that controls when effect runs. Empty array = once on mount.

**Follow-up:** What happens without dependency array?

---

### 3. How do you fetch data on mount?
**Answer:** Use useEffect with empty dependency array.

**Follow-up:** How do you prevent stale data?

---

### 4. How do you handle loading states?
**Answer:** Add loading state, set true before fetch, false after.

**Follow-up:** What about error states?

---

### 5. How do you prevent useEffect from running on every render?
**Answer:** Use dependency array to specify when it should run.

**Follow-up:** What values should you include?

---

**Practice these to master useEffect basics!**

