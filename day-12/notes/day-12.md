# Day 12: useCallback Hook - Function Memoization for Performance

## 📋 Table of Contents
- [Introduction](#introduction)
- [What is useCallback?](#what-is-usecallback)
- [Why Use useCallback?](#why-use-usecallback)
- [useCallback Syntax](#usecallback-syntax)
- [When to Use useCallback](#when-to-use-usecallback)
- [Common Patterns](#common-patterns)
- [Performance Optimization](#performance-optimization)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 12! Today you'll master **useCallback** - React's optimization hook for memoizing functions. By the end of today, you'll:
- ✅ Understand function memoization
- ✅ Know when to use useCallback
- ✅ Prevent unnecessary re-renders
- ✅ Optimize component performance
- ✅ Build memory-efficient React apps

---

## What is useCallback?

### Understanding useCallback

**useCallback** returns a memoized version of the callback function that only changes if one of the dependencies has changed.

**Analogy**: Think of useCallback as a **recipe card**:
- If you write the same recipe (function) every time, you waste paper (memory)
- A recipe card (memoized function) lets you reference the same recipe
- Only update the card when ingredients (dependencies) change

---

## Why Use useCallback?

### Without useCallback

```javascript
function Parent({ items }) {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    console.log('Clicked');
  }; // New function on every render!
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild items={items} onClick={handleClick} />
    </div>
  );
}

// ExpensiveChild re-renders on every Parent re-render!
function ExpensiveChild({ items, onClick }) {
  console.log('ExpensiveChild rendering'); // Logs every time
  return <div>...</div>;
}
```

### With useCallback

```javascript
function Parent({ items }) {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Same function reference!
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveChild items={items} onClick={handleClick} />
    </div>
  );
}

// ExpensiveChild only re-renders when onClick actually changes
function ExpensiveChild({ items, onClick }) {
  console.log('ExpensiveChild rendering'); // Only logs when onClick changes
  return <div>...</div>;
}
```

---

## useCallback Syntax

### Basic Syntax

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b] // Dependencies
);
```

### Complete Example

```javascript
import { useState, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  
  // Without useCallback - new function every render
  const handleAdd = () => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  // With useCallback - same function unless dependencies change
  const handleAddMemoized = useCallback(() => {
    setTodos([...todos, { id: Date.now(), text }]);
  }, [todos, text]);
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddMemoized}>Add Todo</button>
    </div>
  );
}
```

---

## When to Use useCallback

### ✅ Good Use Cases

1. **Passing callbacks to memoized children**
```javascript
const MemoizedChild = React.memo(ChildComponent);

function Parent() {
  const [count, setCount] = useState(0);
  
  // Good: Prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <MemoizedChild onClick={handleClick} />;
}
```

2. **Dependency in useEffect**
```javascript
function DataFetcher({ userId }) {
  const fetchData = useCallback(async () => {
    const data = await api.getData(userId);
    console.log(data);
  }, [userId]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
}
```

3. **Expensive function definitions**
```javascript
function Calculator({ numbers }) {
  const expensiveCalculation = useCallback(() => {
    return numbers.reduce((sum, num) => sum + num * 2, 0);
  }, [numbers]);
  
  return <div>Result: {expensiveCalculation()}</div>;
}
```

### ❌ When NOT to Use useCallback

```javascript
// ❌ BAD: Simple function, no optimization needed
const handleClick = useCallback(() => {
  console.log('click');
}, []); // Unnecessary overhead

// ✅ GOOD: Just use regular function
const handleClick = () => {
  console.log('click');
};
```

---

## Common Patterns

### Pattern 1: Memoized Event Handlers

```javascript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  
  const debouncedSearch = useCallback((searchTerm) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    
    const timeout = setTimeout(() => {
      fetchResults(searchTerm).then(setResults);
    }, 300);
    
    setDebounceTimeout(timeout);
  }, [debounceTimeout]);
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return <div>{results.map(r => <div key={r.id}>{r.title}</div>)}</div>;
}
```

### Pattern 2: Dynamic Handlers

```javascript
function ItemList({ items, onItemClick }) {
  const handleItemClick = useCallback((itemId) => {
    onItemClick(itemId);
  }, [onItemClick]);
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Item 
            item={item} 
            onClick={() => handleItemClick(item.id)}
          />
        </li>
      ))}
    </ul>
  );
}
```

### Pattern 3: useCallback with useRef

```javascript
function Autosave({ data }) {
  const lastSaveRef = useRef(null);
  
  const saveData = useCallback(async () => {
    if (data === lastSaveRef.current) return;
    
    await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    lastSaveRef.current = data;
  }, [data]);
  
  useEffect(() => {
    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [saveData]);
  
  return null;
}
```

---

## Performance Optimization

### Before Optimization

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <TodoList todos={todos} onAddTodo={addTodo} />
    </div>
  );
}
// Problem: TodoList re-renders when count changes!
```

### After Optimization

```javascript
function App() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }, []); // No dependencies needed with functional update!
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <TodoList todos={todos} onAddTodo={addTodo} />
    </div>
  );
}
// TodoList only re-renders when todos change
```

---

## Practice Exercise

### Optimize Search Component with useCallback

See practice file: `day-12/practice/search-optimization.jsx`

---

## Key Takeaways

### ✅ What You Learned Today

1. **useCallback**: Memoize functions to prevent re-renders
2. **Performance**: Optimize expensive child re-renders
3. **Dependencies**: Always include used values in dependency array
4. **When to Use**: With memoized children or useEffect dependencies

### 🎯 Key Concepts

- useCallback memoizes function references
- Only use when it actually prevents re-renders
- Include all dependencies in dependency array
- Combine with React.memo for best results
- Don't overuse - it has overhead

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ useMemo for value memoization
- ✅ Optimizing expensive calculations
- ✅ useMemo vs useCallback
- ✅ Building performant React apps

---

**Great work! 🎉 See you tomorrow for Day 13: useMemo Hook!**

