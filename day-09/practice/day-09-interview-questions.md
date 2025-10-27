# Day 9: useEffect Advanced - Interview Questions

## 📋 Advanced Concepts

### 1. What is a cleanup function?
**Answer:** Function returned from useEffect to clean up side effects.

**Follow-up:** When does cleanup run?

---

### 2. Why do you need cleanup functions?
**Answer:** To prevent memory leaks, cancel subscriptions, clear timers.

**Follow-up:** What happens without cleanup?

---

### 3. How do you handle memory leaks with fetch?
**Answer:** Use cleanup to cancel requests on unmount.

**Follow-up:** How do you cancel fetch requests?

---

### 4. When should you use multiple useEffects?
**Answer:** To separate concerns into different effects.

**Follow-up:** What are best practices?

---

### 5. How do you implement debouncing?
**Answer:** Use timer in useEffect, clear in cleanup.

**Follow-up:** What's a good debounce time?

---

**Master cleanup and memory leak prevention!**

