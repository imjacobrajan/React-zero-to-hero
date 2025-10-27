# Day 4 Interview Questions: useState Hook

## State & useState Fundamentals

### 1. What is State in React?
**Answer:** State is data that changes over time and affects what a component renders. It's the component's "memory" that can be updated and causes re-renders when changed.

### 2. What is the useState Hook?
**Answer:** useState is a React hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.

```javascript
const [count, setCount] = useState(0);
```

### 3. What are the Rules of Hooks?
**Answer:**
- Only call hooks at the top level (not inside loops, conditions, or nested functions)
- Only call hooks from React functions or custom hooks
- Hooks must be called in the same order every render

### 4. Can you call useState conditionally?
**Answer:** No! Hooks must be called at the top level, not inside conditions.

```javascript
// ❌ WRONG
if (condition) {
  const [state, setState] = useState(0);
}

// ✅ CORRECT
const [state, setState] = useState(0);
if (condition) {
  // Use state here
}
```

### 5. How do you update state with useState?
**Answer:** Use the setter function returned by useState.

```javascript
const [count, setCount] = useState(0);
setCount(count + 1); // Direct update
setCount(prev => prev + 1); // Functional update
```

### 6. What's the difference between updating state with a value vs. a function?
**Answer:** 
- Value: Uses the state value at the time the function is called
- Function: Uses the most recent state value

```javascript
// Both use same initial value
setCount(count + 1);
setCount(count + 1); // count is still 0

// Each uses previous state
setCount(prev => prev + 1);
setCount(prev => prev + 1); // count is now 2
```

### 7. How do you update an object in state?
**Answer:** Create a new object using the spread operator to avoid mutation.

```javascript
const [user, setUser] = useState({ name: 'John', age: 25 });

setUser({ ...user, age: 26 }); // Update only age
```

### 8. How do you update an array in state?
**Answer:** Create a new array using methods like spread, map, filter, etc.

```javascript
const [items, setItems] = useState([1, 2, 3]);

// Add
setItems([...items, 4]);

// Remove
setItems(items.filter(item => item !== 2));

// Update
setItems(items.map(item => item === 1 ? 10 : item));
```

### 9. Why shouldn't you mutate state directly?
**Answer:** React uses reference equality to detect changes. Mutating won't trigger a re-render. Always create new values.

```javascript
// ❌ WRONG - Won't trigger re-render
const [items, setItems] = useState([1, 2, 3]);
items.push(4);

// ✅ CORRECT - Creates new array
setItems([...items, 4]);
```

### 10. Can you use multiple useState hooks in one component?
**Answer:** Yes! You can use as many useState hooks as needed.

```javascript
const [name, setName] = useState('');
const [age, setAge] = useState(0);
const [email, setEmail] = useState('');
```

## Coding Questions

### Q1: Create a counter with increment and decrement
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### Q2: Create a toggle button
```javascript
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
```

### Q3: Update nested object in state
```javascript
function Profile() {
  const [user, setUser] = useState({
    name: 'John',
    address: { city: 'NYC', country: 'USA' }
  });
  
  const updateCity = (city) => {
    setUser({
      ...user,
      address: { ...user.address, city }
    });
  };
  
  return <div>...</div>;
}
```

### Q4: Add item to array state
```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  };
  
  return <div>...</div>;
}
```

## Advanced Questions

### Q5: How would you implement undo/redo functionality?
```javascript
function Editor() {
  const [history, setHistory] = useState(['']);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const updateText = (text) => {
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, text]);
    setCurrentIndex(newHistory.length);
  };
  
  const undo = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };
  
  const redo = () => {
    setCurrentIndex(Math.min(history.length - 1, currentIndex + 1));
  };
  
  return <div>...</div>;
}
```

### Q6: How would you persist state to localStorage?
```javascript
function PersistedCounter() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('count');
    return saved ? Number(saved) : 0;
  });
  
  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);
  
  return <div>...</div>;
}
```

## Common Mistakes

1. Mutating state directly
2. Using state value immediately after setState
3. Forgetting to spread existing state when updating objects/arrays
4. Calling hooks conditionally
5. Not using functional updates when state depends on previous state
