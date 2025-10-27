# Day 4: useState Hook - Interview Questions

## Theory Questions from Top MNCs

### Q1: What is state in React? (Google, Meta)
**Answer**: State is component's internal data that changes over time, triggering re-renders. Unlike props (from parent), state belongs to component and can be modified.

```javascript
const [count, setCount] = useState(0);
// count: current state value
// setCount: function to update state
```

### Q2: useState Hook - Explain it? (Amazon, Microsoft)
**Answer**: `useState` is React hook that adds state to functional components.

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  // Initial value: 0
  // Returns: [value, setter]
}
```

### Q3: State vs Props? (Meta, Netflix)
**Answer**:
- **Props**: From parent, read-only, can't modify
- **State**: Internal to component, can modify, causes re-render

| Props | State |
|-------|-------|
| Passed from parent | Defined in component |
| Read-only | Mutable |
| Don't trigger re-render by themselves | Triggers re-render |

### Q4: Why useState returns array? (Google, Uber)
**Answer**: Allows destructuring with custom names:
```javascript
const [name, setName] = useState(''); // Any names
const [count, setCount] = useState(0);
```

### Q5: How to update state? (Apple, Amazon)
**Answer**: Use setter function. Never mutate state directly.

```javascript
// ✅ Correct
setCount(count + 1);
setCount(prev => prev + 1);

// ❌ Wrong
count = count + 1;
count++;
```

### Q6: Multiple state variables? (Netflix, Microsoft)
**Answer**: Call useState multiple times:

```javascript
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  // Each state is independent
}
```

### Q7: State initialization - when? (Google, Meta)
**Answer**: Only once on first render. Subsequent renders use current state value.

```javascript
const [count, setCount] = useState(calculateInitialValue());
// calculateInitialValue() runs only once
```

### Q8: Async state updates - understanding? (Amazon, Uber)
**Answer**: State updates are batched for performance:

```javascript
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
// Count increases by 1, not 3

// Solution: use functional update
setCount(prev => prev + 1);
setCount(prev => prev + 1);
setCount(prev => prev + 1);
// Count increases by 3
```

### Q9: Object state updates? (Meta, Netflix)
**Answer**: Always spread previous state:

```javascript
const [user, setUser] = useState({ name: '', age: 0 });

// ✅ Correct
setUser({ ...user, name: 'John' });
setUser(prev => ({ ...prev, age: 25 }));

// ❌ Wrong
user.name = 'John'; // Doesn't trigger re-render
setUser(user); // Same object reference
```

### Q10: Array state updates? (Apple, Microsoft)
**Answer**: Create new array reference:

```javascript
const [items, setItems] = useState([]);

// Add
setItems([...items, newItem]);

// Update
setItems(items.map(item => 
  item.id === id ? {...item, ...changes} : item
));

// Delete
setItems(items.filter(item => item.id !== id));
```

---

## Coding Questions from Real Interviews

### Problem 1: Counter (Facebook)
**Task**: Build counter with increment/decrement

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

### Problem 2: Form State (Google)
**Task**: Manage multiple input fields

```javascript
function Form() {
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="age" value={form.age} onChange={handleChange} />
    </form>
  );
}
```

### Problem 3: Todo List State (Amazon)
**Task**: Manage list of items

```javascript
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    setTodos([...todos, input]);
    setInput('');
  };
  
  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  );
}
```

### Problem 4: Functional Updates (Netflix)
**Task**: Use functional updates for complex state

```javascript
function ComplexCounter() {
  const [count, setCount] = useState(0);
  
  const incrementThree = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Each call uses latest state
  };
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={incrementThree}>+3</button>
    </div>
  );
}
```

### Problem 5: Lazy Initialization (Microsoft)
**Task**: Expensive initial state

```javascript
function ExpensiveInit() {
  // Run expensive calculation only once
  const [data, setData] = useState(() => {
    const expensiveValue = calculateValue(); // Runs once
    return expensiveValue;
  });
  
  return <div>{data}</div>;
}
```

---

## Advanced Questions

### Q1: State re-rendering mechanism? (Meta)
**Answer**: When state changes via setter, React:
1. Schedules re-render
2. Compares new virtual DOM with old
3. Updates only changed DOM elements

### Q2: State batching in React 18? (Google)
**Answer**: React 18 automatically batches all updates, even in promises/timeouts.

```javascript
// React 17: Multiple re-renders
setCount(1); setName('A'); setEmail('B'); // 3 renders

// React 18: Single re-render
// Automatic batching for all updates
```

### Q3: useState with objects - when to spread? (Amazon)
**Answer**: Always spread to create new reference:

```javascript
// ✅ New object reference
setUser({ ...user, name: 'John' });

// ❌ Same reference (won't re-render)
user.name = 'John';
setUser(user);
```

### Q4: State dependency issues? (Netflix)
**Answer**: Use functional updates when new state depends on old:

```javascript
// ❌ Problem: uses stale state
setCount(count + 1);

// ✅ Solution: functional update
setCount(prev => prev + 1);
```

### Q5: Multiple re-renders - how to prevent? (Microsoft)
**Answer**: 
1. Use React.memo()
2. useMemo() for computed values
3. useCallback() for functions
4. Batch state updates

---

## Common Pitfalls

### Pitfall 1: Mutating State
```javascript
// ❌ Wrong
const [user, setUser] = useState({ name: 'John' });
user.name = 'Jane'; // Mutation
setUser(user);

// ✅ Correct
setUser({ ...user, name: 'Jane' });
```

### Pitfall 2: Async State
```javascript
// ❌ Doesn't work as expected
const [count, setCount] = useState(0);
setCount(count + 1);
console.log(count); // Still 0 (not updated yet)

// ✅ Use callback if needed
setCount(prev => {
  const newCount = prev + 1;
  console.log(newCount); // Correct value
  return newCount;
});
```

---

**🎯 Summary**: Master useState hook for component state management!

