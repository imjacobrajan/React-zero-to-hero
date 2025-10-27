# Day 16: Custom Hooks - Part 1 - Creating Reusable Logic

## 📋 Table of Contents
- [Introduction](#introduction)
- [What are Custom Hooks?](#what-are-custom-hooks)
- [Creating Custom Hooks](#creating-custom-hooks)
- [Hook Naming Conventions](#hook-naming-conventions)
- [Extracting Reusable Logic](#extracting-reusable-logic)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Custom hooks let you extract and reuse logic across components. Learn to create and use custom hooks.

---

## What are Custom Hooks?

Custom hooks are JavaScript functions that use React hooks and start with "use".

```javascript
function useCustomHook() {
  // Use React hooks here
  const [state, setState] = useState();
  useEffect(() => {
    // Logic
  });
  
  // Return values/functions
  return { state };
}
```

---

## Creating Custom Hooks

### useToggle Hook

```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(v => !v);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return [value, { toggle, setTrue, setFalse }];
}
```

### useLocalStorage Hook

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}
```

---

## Practice Exercise

Create useToggle and useLocalStorage hooks.

See practice file: `day-16/practice/custom-hooks.jsx`

---

## Key Takeaways

- Custom hooks start with "use"
- Extract reusable logic
- Return values or functions
- Share stateful logic across components

**See you tomorrow for Day 17: Custom Hooks Part 2!**

