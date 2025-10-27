# Day 13: useMemo - Interview Questions

## 📋 Basic Concepts

### 1. What is useMemo?
**Answer:** React hook that returns a memoized value, only recalculating when dependencies change.

**Follow-up:** When should you use useMemo?

---

### 2. What's the difference between useMemo and useCallback?
**Answer:** useMemo memoizes **values**, useCallback memoizes **functions**.

**Follow-up:** Give examples of when to use each.

---

### 3. When should you use useMemo?
**Answer:** For expensive calculations, filtering/sorting large arrays, maintaining referential equality.

**Follow-up:** When shouldn't you use useMemo?

---

### 4. How do you optimize expensive computations with useMemo?
**Answer:** Wrap expensive calculations in useMemo with proper dependencies.

**Follow-up:** What if dependencies are missing?

---

### 5. What is referential equality and why does it matter?
**Answer:** Same object reference means equality. Important for preventing unnecessary re-renders.

**Follow-up:** How does useMemo help with referential equality?

---

## 🔧 Intermediate Concepts

### 6. How do you memoize an expensive filter operation?
**Answer:** Wrap the filter in useMemo with items and filters as dependencies.

**Follow-up:** What about sorting?

---

### 7. How do you optimize computed properties?
**Answer:** Use useMemo to compute derived state from props/state.

**Follow-up:** When is this pattern useful?

---

### 8. What happens if you forget to include dependencies in useMemo?
**Answer:** You get stale data, the memoized value won't update when dependencies change.

**Follow-up:** How can ESLint help?

---

### 9. How do you measure if useMemo is actually helping?
**Answer:** Use performance.now(), React DevTools Profiler, or console logs.

**Follow-up:** What metrics matter?

---

### 10. Can you overuse useMemo?
**Answer:** Yes! It has overhead. Only use for genuinely expensive operations.

**Follow-up:** How do you know when it's worth it?

---

## 🎯 Advanced Concepts

### 11. How do you memoize nested object creation?
**Answer:** Wrap object creation in useMemo with dependencies.

**Follow-up:** What about arrays?

---

### 12. How does useMemo work with React.memo?
**Answer:** useMemo provides stable references, React.memo prevents child re-renders.

**Follow-up:** Show an example.

---

### 13. How do you debug useMemo issues?
**Answer:** Add console.logs inside the function, check dependencies, verify with React DevTools.

**Follow-up:** What are common issues?

---

### 14. How do you optimize rendering many items with useMemo?
**Answer:** Memoize the filtered/sorted list, pass stable references to children.

**Follow-up:** What about pagination?

---

### 15. What's the performance tradeoff with useMemo?
**Answer:** Memory for speed. Cache takes memory, but saves computation time.

**Follow-up:** When is this worth it?

---

**Master useMemo to build performant React apps! 🚀**

