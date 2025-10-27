# Day 7: Conditional Rendering - Interview Questions

## 📋 Basic Concepts

### 1. What is conditional rendering in React?
**Answer:**
Conditional rendering is displaying different UI based on conditions. Use JavaScript conditional statements (if, ternary, &&) to decide what to render.

**Follow-up:** Why is conditional rendering important?

---

### 2. How do you conditionally render elements using ternary operators?
**Answer:**
```javascript
{condition ? <Component1 /> : <Component2 />}
```

**Follow-up:** When should you use ternary vs && operator?

---

### 3. How do you use logical && for conditional rendering?
**Answer:**
```javascript
{condition && <Component />}
```

**Follow-up:** What happens if condition is 0?

---

### 4. How do you handle multiple conditions?
**Answer:**
Use switch statements, early returns, or nested ternaries.

**Follow-up:** Which approach is most readable?

---

### 5. How do you render nothing/null?
**Answer:**
Return `null` from component or use conditional rendering.

**Follow-up:** When would you return null?

---

## 🔧 Intermediate Concepts

### 6. How do you implement loading states?
**Answer:**
```javascript
{isLoading ? <Spinner /> : <Content />}
```

**Follow-up:** What about skeleton loaders?

---

### 7. How do you handle error states?
**Answer:**
```javascript
{error ? <ErrorMessage /> : <Content />}
```

**Follow-up:** How do you show retry options?

---

### 8. How do you show empty states?
**Answer:**
```javascript
{items.length ? <ItemList /> : <EmptyState />}
```

**Follow-up:** How do you make empty states helpful?

---

### 9. How do you conditionally apply CSS classes?
**Answer:**
Use template literals or clsx/classnames library.

**Follow-up:** What's the cleanest way?

---

### 10. How do you implement auth-based rendering?
**Answer:**
Check user authentication status and render accordingly.

**Follow-up:** How do you handle role-based access?

---

## 🎯 Advanced Concepts

### 11. How do you prevent rendering certain elements?
**Answer:**
Use early returns or return null.

**Follow-up:** What's the performance impact?

---

### 12. How do you handle permission-based rendering?
**Answer:**
Check user permissions before rendering features.

**Follow-up:** How do you handle nested permissions?

---

### 13. How do you implement feature flags?
**Answer:**
Check feature flag status before rendering features.

**Follow-up:** How do you A/B test features?

---

### 14. How do you conditionally render lists?
**Answer:**
Filter array first, then render.

**Follow-up:** What about pagination?

---

### 15. How do you show/hide based on screen size?
**Answer:**
Use media queries or window size hooks.

**Follow-up:** How do you make responsive components?

---

**Practice these patterns to master conditional rendering!**

