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
- ✅ Master the `useState` hook completely (beginner to advanced)
- ✅ Know how to update state correctly
- ✅ Handle multiple state variables
- ✅ Build interactive components
- ✅ Apply state management best practices
- ✅ Understand state updates and re-rendering
- ✅ Handle complex state scenarios

> **📌 What's NOT in Day 4**: Advanced state management (Context, Redux), useReducer, custom hooks, or state lifting. These will be covered in Days 14-20.
>
> **Day 4 Focus**: ONLY useState hook fundamentals, patterns, and best practices.

**Today's Scope**:
1. What is state and why do we need it?
2. useState hook syntax and usage
3. Initial state values (primitives, objects, arrays)
4. Updating state correctly
5. Multiple state variables
6. State re-rendering behavior
7. Common pitfalls and solutions

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

## State with Objects Deep Dive

### Updating Object State

```javascript
import { useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    age: 25,
    email: 'alice@example.com'
  });
  
  // ❌ WRONG - Mutating existing object
  const handleUpdateAge = () => {
    user.age = 26; // Don't do this!
    setUser(user);
  };
  
  // ✅ CORRECT - Creating new object
  const handleUpdateAge = () => {
    setUser({
      ...user,  // Spread existing properties
      age: 26    // Update the age
    });
  };
  
  // ✅ ALTERNATIVE - Using function form
  const handleUpdateAge = () => {
    setUser(prevUser => ({
      ...prevUser,
      age: 26
    }));
  };
  
  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleUpdateAge}>Update Age</button>
    </div>
  );
}
```

### Updating Nested Objects

```javascript
function Settings() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  
  // Update nested property
  const handleToggleEmail = () => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        email: !settings.notifications.email
      }
    });
  };
  
  // Using function form
  const handleToggleEmail = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      notifications: {
        ...prevSettings.notifications,
        email: !prevSettings.notifications.email
      }
    }));
  };
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.notifications.email}
          onChange={handleToggleEmail}
        />
        Email notifications
      </label>
    </div>
  );
}
```

---

## State with Arrays Deep Dive

### Adding to Array State

```javascript
function TodoList() {
  const [todos, setTodos] = useState(['Learn React', 'Build app']);
  
  // ✅ Add new item
  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };
  
  // ✅ Add to beginning
  const addTodoToStart = (newTodo) => {
    setTodos([newTodo, ...todos]);
  };
  
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo}</li>
      ))}
    </ul>
  );
}
```

### Removing from Array State

```javascript
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build app' },
    { id: 3, text: 'Deploy app' }
  ]);
  
  // Remove item by id
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Using function form
  const removeTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Updating Items in Array

```javascript
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false }
  ]);
  
  // Toggle completion
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };
  
  // Using function form
  const toggleComplete = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };
}
```

### Complex Array Operations

```javascript
function ShoppingCart() {
  const [cart, setCart] = useState([
    { id: 1, name: 'Product A', quantity: 2, price: 10 },
    { id: 2, name: 'Product B', quantity: 1, price: 20 }
  ]);
  
  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };
  
  // Remove item
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate total
  const total = cart.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  return (
    <div>
      {cart.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <span>Quantity: {item.quantity}</span>
          <span>Subtotal: ${item.price * item.quantity}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total}</p>
    </div>
  );
}
```

---

## Lazy Initialization

### When to Use Lazy Initialization

**Use lazy initialization when the initial state requires expensive computation:**

```javascript
// ❌ BAD - Expensive computation runs on every render
function ExpensiveComponent() {
  const [data, setData] = useState(expensiveComputation());
  return <div>{data}</div>;
}

// ✅ GOOD - Only runs once on mount
function ExpensiveComponent() {
  const [data, setData] = useState(() => expensiveComputation());
  return <div>{data}</div>;
}
```

### Examples of Lazy Initialization

```javascript
// Reading from localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  // Save to localStorage when value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// Fetching initial data
function UserProfile({ userId }) {
  const [user, setUser] = useState(() => {
    return fetchUser(userId); // Only called once
  });
  
  return <div>{user.name}</div>;
}

// Parsing large JSON
function DataVisualization() {
  const [data, setData] = useState(() => {
    return JSON.parse(largeJsonString); // Only parsed once
  });
  
  return <Chart data={data} />;
}
```

---

## Functional Updates Deep Dive

### When to Use Functional Updates

Use functional updates when:
1. State update depends on previous state
2. Multiple updates in the same event
3. State update is asynchronous

### Examples

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  // ❌ WRONG - Multiple quick clicks only increment by 1
  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };
  
  // ✅ CORRECT - Each click increments by 3
  const handleClick = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };
  
  return (
    <button onClick={handleClick}>Count: {count}</button>
  );
}
```

### Functional Update Pattern

```javascript
// Increment/Decrement
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Advanced Functional Updates

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  // Add todo
  const addTodo = (text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  };
  
  // Toggle todo
  const toggleTodo = (id) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Delete todo
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  // Clear completed
  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };
  
  // Toggle all
  const toggleAll = () => {
    setTodos(prev => {
      const allCompleted = prev.every(todo => todo.completed);
      return prev.map(todo => ({ ...todo, completed: !allCompleted }));
    });
  };
  
  return (
    <div>
      {/* Todo list implementation */}
    </div>
  );
}
```

---

## State Batching

### Understanding State Batching

React batches multiple state updates in event handlers to reduce re-renders:

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Both updates batched together
  const handleClick = () => {
    setCount(count + 1);
    setName('New Name');
    // Only one re-render!
  };
  
  return (
    <div>
      <p>{name}: {count}</p>
      <button onClick={handleClick}>Update</button>
    </div>
  );
}
```

### Batching Example

```javascript
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // All three updates are batched
  const handleSubmit = () => {
    setFirstName('Alice');
    setLastName('Smith');
    setEmail('alice@example.com');
    // Only one re-render!
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## Multiple useState Patterns

### Pattern 1: Separate States

Good when values change independently:

```javascript
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  return (
    <form>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <input 
        type="checkbox" 
        checked={rememberMe} 
        onChange={e => setRememberMe(e.target.checked)} 
      />
    </form>
  );
}
```

### Pattern 2: Combined Object State

Good when values change together:

```javascript
function Form() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input 
        value={formData.username}
        onChange={e => handleChange('username', e.target.value)}
      />
      <input 
        value={formData.password}
        onChange={e => handleChange('password', e.target.value)}
      />
      <input 
        type="checkbox"
        checked={formData.rememberMe}
        onChange={e => handleChange('rememberMe', e.target.checked)}
      />
    </form>
  );
}
```

---

## Real-World Examples

### Example 1: Toggle Component

```javascript
function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    // Update theme logic here
  };
  
  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

### Example 2: Modal State

```javascript
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <h2>Modal Content</h2>
        </Modal>
      )}
    </div>
  );
}
```

### Example 3: Search Component

```javascript
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    // Search logic here
    const filtered = performSearch(term);
    setResults(filtered);
  };
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Best Practices Summary

### ✅ DO

1. Initialize state with appropriate default values
2. Use functional updates when state depends on previous state
3. Keep state as local as possible
4. Use lazy initialization for expensive computations
5. Update state immutably (objects/arrays)
6. Extract state logic into separate functions

### ❌ DON'T

1. Don't mutate state directly
2. Don't use state for values that don't affect rendering
3. Don't store derived data in state
4. Don't forget to handle edge cases
5. Don't over-complicate state structure
6. Don't use state for values that can be props or constants

---

## Interview Preparation

### Common Questions About useState

#### Q1: What is state in React?

**Answer**: State is data that a component maintains internally. When state changes, React re-renders the component to reflect those changes.

#### Q2: How does useState work?

**Answer**: useState returns an array with two elements: the current state value and a setter function. When you call the setter, React updates state and re-renders.

#### Q3: Why can't you mutate state directly?

**Answer**: React uses reference equality to determine if state changed. If you mutate the existing object/array, React won't detect the change and won't re-render.

#### Q4: When should you use functional updates?

**Answer**: When the new state depends on the previous state value, especially when you have multiple state updates or async operations.

#### Q5: What is lazy initialization?

**Answer**: Passing a function to useState instead of a value. The function only runs once on mount, useful for expensive computations.

---

## State Update Patterns

### Pattern 1: Counter with Step

```javascript
function Counter({ initialValue = 0, step = 1 }) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  
  return (
    <div>
      <button onClick={decrement}>-{step}</button>
      <span>{count}</span>
      <button onClick={increment}>+{step}</button>
    </div>
  );
}
```

### Pattern 2: Controlled Input

```javascript
function NameInput() {
  const [name, setName] = useState('');
  
  const handleChange = (e) => {
    setName(e.target.value);
  };
  
  return (
    <div>
      <input 
        type="text" 
        value={name} 
        onChange={handleChange}
        placeholder="Enter your name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
}
```

### Pattern 3: Toggle Boolean

```javascript
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  const toggle = () => setIsOn(prev => !prev);
  
  return (
    <div>
      <button onClick={toggle}>
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
```

---

## State vs Derived Values

### Don't Store Derived Data

```javascript
// ❌ BAD - Storing derived data
function BadComponent({ users }) {
  const [userCount, setUserCount] = useState(0);
  
  useEffect(() => {
    setUserCount(users.length);
  }, [users]);
  
  return <div>Total users: {userCount}</div>;
}

// ✅ GOOD - Calculate derived data
function GoodComponent({ users }) {
  return <div>Total users: {users.length}</div>;
}
```

### Another Example

```javascript
// ❌ BAD
function BadCart({ items }) {
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0));
  }, [items]);
  
  return <div>Total: ${total}</div>;
}

// ✅ GOOD
function GoodCart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return <div>Total: ${total}</div>;
}
```

---

## Complex State Scenarios

### Accordion Component

```javascript
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <button onClick={() => toggleItem(index)}>
            {item.title}
          </button>
          {openIndex === index && (
            <div>{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Tab Navigation

```javascript
function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div>
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? 'active' : ''}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
```

### Multi-Step Form

```javascript
function MultiStepForm({ steps }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div>
      <div>Step {currentStep + 1} of {steps.length}</div>
      {steps[currentStep]}
      <button onClick={prevStep} disabled={currentStep === 0}>
        Previous
      </button>
      <button onClick={nextStep}>
        {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}
```

---

## State Initialization Patterns

### Pattern 1: Primitive Values

```javascript
const [count, setCount] = useState(0);
const [name, setName] = useState('');
const [isActive, setIsActive] = useState(false);
```

### Pattern 2: Objects

```javascript
const [user, setUser] = useState({
  name: '',
  email: '',
  age: 0
});
```

### Pattern 3: Arrays

```javascript
const [items, setItems] = useState([]);
const [selectedIds, setSelectedIds] = useState([1, 2, 3]);
```

### Pattern 4: Lazy Initialization

```javascript
const [data, setData] = useState(() => expensiveComputation());
const [savedData, setSavedData] = useState(() => {
  const saved = localStorage.getItem('data');
  return saved ? JSON.parse(saved) : null;
});
```

### Pattern 5: Conditional Initialization

```javascript
function Component({ initialValue }) {
  const [value, setValue] = useState(initialValue || defaultValue);
  
  // Or with lazy initialization
  const [value, setValue] = useState(() => initialValue || defaultValue);
}
```

---

## Debugging State Updates

### Console Logging

```javascript
function DebugComponent() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    console.log('Before update:', count);
    setCount(prev => {
      const newCount = prev + 1;
      console.log('New count:', newCount);
      return newCount;
    });
  };
  
  return (
    <button onClick={increment}>Count: {count}</button>
  );
}
```

### Using React DevTools

1. Open React DevTools
2. Find your component
3. Click on component name
4. View state values on the right
5. See state updates in real-time

---

## More State Management Patterns

### Selecting Items in List

```javascript
function SelectableList({ items }) {
  const [selectedIds, setSelectedIds] = useState([]);
  
  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };
  
  const selectAll = () => {
    setSelectedIds(items.map(item => item.id));
  };
  
  const deselectAll = () => {
    setSelectedIds([]);
  };
  
  return (
    <div>
      <button onClick={selectAll}>Select All</button>
      <button onClick={deselectAll}>Deselect All</button>
      
      {items.map(item => (
        <div key={item.id}>
          <input
            type="checkbox"
            checked={selectedIds.includes(item.id)}
            onChange={() => toggleSelection(item.id)}
          />
          <label>{item.name}</label>
        </div>
      ))}
    </div>
  );
}
```

### Form with Validation

```javascript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => handleChange('name', e.target.value)}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name}</span>}
      
      <input
        type="email"
        value={formData.email}
        onChange={e => handleChange('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}
      
      <textarea
        value={formData.message}
        onChange={e => handleChange('message', e.target.value)}
        placeholder="Message"
      />
      {errors.message && <span>{errors.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## State Update Cheat Sheet

### Primitives

```javascript
// String
const [name, setName] = useState('');
setName('Alice');

// Number
const [count, setCount] = useState(0);
setCount(count + 1);
setCount(prev => prev + 1);

// Boolean
const [isActive, setIsActive] = useState(false);
setIsActive(prev => !prev);
setIsActive(true);
```

### Objects

```javascript
// Updating single property
setUser({ ...user, name: 'Alice' });

// Updating nested property
setSettings({
  ...settings,
  notifications: {
    ...settings.notifications,
    email: true
  }
});

// Using function form
setUser(prev => ({ ...prev, name: 'Alice' }));
```

### Arrays

```javascript
// Add item
setItems([...items, newItem]);
setItems(prev => [...prev, newItem]);

// Remove item
setItems(items.filter(item => item.id !== id));
setItems(prev => prev.filter(item => item.id !== id));

// Update item
setItems(items.map(item => 
  item.id === id ? { ...item, property: value } : item
));

// Replace item
setItems(items.map((item, index) => 
  index === i ? newItem : item
));
```

---

## Common State Patterns in Production

### Loading State Pattern

```javascript
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // useEffect will be covered in Day 8
  // For now, just understand the state pattern
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

### Selected Item Pattern

```javascript
function ItemSelector({ items }) {
  const [selectedId, setSelectedId] = useState(null);
  
  const selectedItem = items.find(item => item.id === selectedId);
  
  return (
    <div>
      <div className="list">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={selectedId === item.id ? 'selected' : ''}
          >
            {item.name}
          </div>
        ))}
      </div>
      
      {selectedItem && (
        <div className="details">
          <h3>{selectedItem.name}</h3>
          <p>{selectedItem.description}</p>
        </div>
      )}
    </div>
  );
}
```

### Search/Filter Pattern

```javascript
function FilterableList({ items }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || item.category === category;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Performance Considerations

### When State Updates Are Expensive

```javascript
// ❌ BAD - Recalculates on every render
function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  const filteredItems = items
    .filter(item => item.name.includes(filter))
    .map(item => expensiveTransform(item));
  
  return <div>...</div>;
}

// ✅ GOOD - Use lazy initialization and memoization (covered in Day 13)
function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');
  
  // Later you'll learn useMemo for this
  const filteredItems = useMemo(() =>
    items
      .filter(item => item.name.includes(filter))
      .map(item => expensiveTransform(item)),
    [items, filter]
  );
  
  return <div>...</div>;
}
```

### Avoid Unnecessary Renders

```javascript
// Derived values shouldn't be state
function GoodComponent({ items }) {
  // ✅ Calculate, don't store
  const itemCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${totalPrice}</p>
    </div>
  );
}
```

---

## Testing State Updates

### Testing State with React Testing Library

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments count on click', () => {
  render(<Counter />);
  
  const button = screen.getByText(/count: 0/i);
  fireEvent.click(button);
  
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

---

## Resources & Further Reading

### Official Documentation
- [useState Hook](https://react.dev/reference/react/useState)
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)

### MDN References
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JavaScript Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

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
