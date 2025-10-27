# Day 4: State with useState

## 📋 Table of Contents
- [Introduction](#introduction)
- [What is State?](#what-is-state)
- [Understanding useState Hook](#understanding-usestate-hook)
- [Setting Initial State](#setting-initial-state)
- [Updating State](#updating-state)
- [State Patterns & Best Practices](#state-patterns--best-practices)
- [Practice Exercise](#practice-exercise)
- [Common Pitfalls](#common-pitfalls)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 4! Today you'll learn about **state** - the data that components maintain and change over time. By the end of today, you'll:
- ✅ Understand what state is and why it matters
- ✅ Master the `useState` hook
- ✅ Know how to update state correctly
- ✅ Handle multiple state variables
- ✅ Build interactive components
- ✅ Apply state management best practices

---

## What is State?

### Defining State

**State** is data that changes over time and affects what a component renders. Think of it as the component's "memory."

**Analogy**: State is like a **light switch**:
- It remembers if the light is on or off
- When you flip the switch, the light changes
- The state changes, and the UI updates automatically

### State vs Props

| Feature | Props | State |
|---------|-------|-------|
| **Definition** | Data passed from parent | Data managed by component |
| **Mutability** | Immutable (read-only) | Mutable (can change) |
| **Changes** | Parent decides | Component decides |
| **Flow** | Downward (parent → child) | Internal to component |
| **Purpose** | Share data | Manage dynamic data |

```javascript
// Props: Passed from outside
function Counter({ initialValue }) {
  return <div>{initialValue}</div>;
}

// State: Managed inside
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

---

## Understanding useState Hook

### What is useState?

`useState` is a React hook that lets you add state to functional components.

### Importing useState

```javascript
import { useState } from 'react';
```

### useState Syntax

```javascript
const [state, setState] = useState(initialValue);
```

**Breaking it down:**
- `state` - current state value
- `setState` - function to update state
- `initialValue` - initial state value

### Your First Counter

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

---

## Setting Initial State

### Different Initial Value Types

#### Number
```javascript
const [count, setCount] = useState(0);
```

#### String
```javascript
const [name, setName] = useState('');
```

#### Boolean
```javascript
const [isActive, setIsActive] = useState(false);
```

#### Array
```javascript
const [items, setItems] = useState([]);
```

#### Object
```javascript
const [user, setUser] = useState({
  name: '',
  email: ''
});
```

#### Complex Initial State
```javascript
const [form, setForm] = useState({
  username: '',
  password: '',
  remember: false
});
```

### Lazy Initial State

For expensive calculations, use a function:

```javascript
// ❌ Calculated on every render
const [data, setData] = useState(expensiveCalculation());

// ✅ Calculated only once
const [data, setData] = useState(() => {
  return expensiveCalculation();
});
```

```javascript
function TodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  return <div>...</div>;
}
```

---

## Updating State

### Direct State Updates (Primitives)

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  const decrement = () => {
    setCount(count - 1);
  };
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Updating Objects

**Important**: Always create a new object, don't mutate!

```javascript
function UserProfile() {
  const [user, setUser] = useState({
    name: 'John',
    age: 25
  });
  
  const updateName = () => {
    // ❌ WRONG - Mutates state
    // user.name = 'Jane';
    
    // ✅ CORRECT - Creates new object
    setUser({
      ...user,
      name: 'Jane'
    });
  };
  
  const updateAge = () => {
    setUser({
      ...user,
      age: user.age + 1
    });
  };
  
  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
}
```

### Updating Arrays

**Important**: Always create a new array, don't mutate!

```javascript
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build app' }
  ]);
  
  const addTodo = () => {
    const newTodo = {
      id: Date.now(),
      text: 'New task'
    };
    
    // ✅ CORRECT - Creates new array
    setTodos([...todos, newTodo]);
  };
  
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const updateTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };
  
  return (
    <div>
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Functional Updates

When the new state depends on the previous state, use a function:

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  const incrementTwice = () => {
    // ❌ WRONG - Both use same count value
    setCount(count + 1);
    setCount(count + 1);
    
    // ✅ CORRECT - Each uses previous state
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={incrementTwice}>Increment Twice</button>
    </div>
  );
}
```

---

## State Patterns & Best Practices

### Multiple State Variables

```javascript
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <form>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
    </form>
  );
}
```

### Grouped State

```javascript
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Email"
      />
    </form>
  );
}
```

### Conditional State Updates

```javascript
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  const toggle = () => {
    setIsOn(prev => !prev);
  };
  
  return (
    <div>
      <button onClick={toggle}>
        {isOn ? 'ON' : 'OFF'}
      </button>
      {isOn && <p>The switch is on!</p>}
    </div>
  );
}
```

### Derived State

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Derived state - calculated from other state
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const completedCount = todos.filter(t => t.completed).length;
  
  return (
    <div>
      <p>Completed: {completedCount}</p>
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('active')}>Active</button>
      <button onClick={() => setFilter('completed')}>Completed</button>
      
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Practice Exercise: Interactive Counter

Create a counter app with multiple features:

### Requirements:
- ✅ Display current count
- ✅ Increment and decrement buttons
- ✅ Reset button
- ✅ Step size selector
- ✅ History of operations

### Solution:

```javascript
function AdvancedCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);
  
  const increment = () => {
    const newCount = count + step;
    setCount(newCount);
    setHistory([...history, `+${step}`]);
  };
  
  const decrement = () => {
    const newCount = count - step;
    setCount(newCount);
    setHistory([...history, `-${step}`]);
  };
  
  const reset = () => {
    setCount(0);
    setHistory([]);
  };
  
  return (
    <div>
      <h1>Count: {count}</h1>
      
      <div>
        <button onClick={increment}>+{step}</button>
        <button onClick={decrement}>-{step}</button>
        <button onClick={reset}>Reset</button>
      </div>
      
      <div>
        <label>
          Step Size:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      
      {history.length > 0 && (
        <div>
          <h3>History:</h3>
          <ul>
            {history.map((operation, index) => (
              <li key={index}>{operation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdvancedCounter;
```

---

## Common Pitfalls

### Pitfall 1: Mutating State Directly

```javascript
// ❌ WRONG
const [items, setItems] = useState([1, 2, 3]);
items.push(4);
setItems(items);

// ✅ CORRECT
setItems([...items, 4]);
```

### Pitfall 2: Multiple setState Calls

```javascript
// ❌ WRONG
const [count, setCount] = useState(0);
setCount(count + 1);
setCount(count + 1); // Still uses old count

// ✅ CORRECT
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

### Pitfall 3: Forgetting State is Async

```javascript
// ❌ Don't expect immediate update
const handleClick = () => {
  setCount(count + 1);
  console.log(count); // Still old value!
};

// ✅ Use useEffect to react to state changes
useEffect(() => {
  console.log(count);
}, [count]);
```

---

## Key Takeaways

### ✅ What You Learned Today

1. **State Basics**: State is dynamic data that changes over time
2. **useState Hook**: How to add state to functional components
3. **Updating State**: Always create new objects/arrays, don't mutate
4. **Multiple State**: Managing multiple state variables
5. **State Patterns**: Best practices and common patterns

### 🎯 Key Concepts

- State is internal to a component
- Always update state immutably
- Use functional updates when state depends on previous state
- Group related state when it changes together
- Derive state from other state when possible

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ Event handling in React
- ✅ onClick, onChange, onSubmit
- ✅ Event object and preventDefault
- ✅ Passing arguments to handlers

---

**Great work! 🎉 See you tomorrow for Day 5: Event Handling!**
