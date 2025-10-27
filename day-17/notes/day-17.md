# Day 17: Custom Hooks - Part 2 - Advanced Patterns

## 📋 Table of Contents
- [Introduction](#introduction)
- [useFetch Custom Hook](#useeffect-custom-hook)
- [useDebounce Hook](#usedebounce-hook)
- [useWindowSize Hook](#usewindowsize-hook)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Learn advanced custom hooks: useFetch, useDebounce, and useWindowSize.

---

## useFetch Custom Hook

```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
}
```

---

## useDebounce Hook

```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

## useWindowSize Hook

```javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

---

## Practice Exercise

Create 3 custom hooks for common patterns.

See practice file: `day-17/practice/advanced-hooks.jsx`

---

## Key Takeaways

- Custom hooks for common patterns
- Share logic across components
- Improve code reusability

**See you tomorrow for Day 18: Component Composition!**

