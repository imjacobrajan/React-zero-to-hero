# Day 12: useCallback Hook - Mastering Function Memoization for Performance
## Introduction
Welcome to Day 12! Today you'll master **useCallback** - React's powerful hook for memoizing functions to optimize performance. By the end of today, you'll:
- ✅ Understand function memoization and why it matters
- ✅ Know when to use useCallback effectively
- ✅ Prevent unnecessary re-renders in child components
- ✅ Optimize component performance
- ✅ Build memory-efficient React applications
- ✅ Understand the relationship between useCallback and React.memo
- ✅ Handle dependency arrays correctly
- ✅ Recognize when NOT to use useCallback
---


## What is useCallback?


### Understanding useCallback
**useCallback** returns a memoized version of the callback function that only changes if one of the dependencies has changed.
**Analogy**: Think of useCallback as a **recipe card**:
- If you write the same recipe (function) every time, you waste paper (memory)
- A recipe card (memoized function) lets you reference the same recipe
- Only update the card when ingredients (dependencies) change
- Saves memory and prevents unnecessary work


### Core Concept
```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b] // Dependencies
);
```
**Key Points:**
- Returns a memoized callback
- Only changes when dependencies change
- Same reference if dependencies don't change
- Used to prevent unnecessary re-renders
- Ideal for passing to child components
---


## Why Use useCallback?


### The Problem: New Function on Every Render
```javascript
function Parent({ items }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  // This function is recreated on EVERY render!
  const handleClick = () => {
    console.log('Clicked', count);
  };
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <ExpensiveChild items={items} onClick={handleClick} />
    </div>
  );
}
function ExpensiveChild({ items, onClick }) {
  console.log('ExpensiveChild rendered'); // Logs every render!
  return <div>...</div>;
}
```
**Problem**: Every time `name` changes, a new `handleClick` function is created, causing `ExpensiveChild` to re-render even though it doesn't need to!


### The Solution: useCallback
```javascript
function Parent({ items }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  // This function is only recreated when count changes!
  const handleClick = useCallback(() => {
    console.log('Clicked', count);
  }, [count]); // Dependencies
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <ExpensiveChild items={items} onClick={handleClick} />
    </div>
  );
}
```
**Now**: Changing `name` doesn't create a new `handleClick` function, so `ExpensiveChild` won't re-render unnecessarily!


### Visual Comparison
```javascript
// WITHOUT useCallback:
// Render 1: handleClick = function#1
// Render 2: handleClick = function#2 (different reference!)
// Render 3: handleClick = function#3 (different reference!)
// Result: Child always re-renders!
// WITH useCallback:
// Render 1: handleClick = function#1 (cached)
// Render 2: handleClick = function#1 (same reference!)
// Render 3: handleClick = function#1 (same reference!)
// Result: Child skips re-render if props haven't changed!
```
---


## useCallback Syntax


### Basic Syntax
```javascript
const memoizedCallback = useCallback(
  () => {
    // Function body
    doSomething(a, b);
  },
  [a, b] // Dependency array
);
```


### Complete Example
```javascript
import { useState, useCallback, useEffect } from 'react';
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState('');
  // Without useCallback - recreated every render
  const handleAdd = () => {
    setTodos([...todos, { id: Date.now(), text: newTodo }]);
    setNewTodo('');
  };
  // With useCallback - only recreated when dependencies change
  const handleAddMemoized = useCallback(() => {
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo }]);
    setNewTodo('');
  }, [newTodo]); // Depends on newTodo
  return (
    <div>
      <input 
        value={newTodo} 
        onChange={(e) => setNewTodo(e.target.value)} 
      />
      <button onClick={handleAddMemoized}>Add Todo</button>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
```


### Empty Dependency Array
```javascript
function StableCallback() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
    // This function NEVER changes
  }, []); // No dependencies
  return <button onClick={handleClick}>Click me</button>;
}
```


### With Dependencies
```javascript
function DynamicCallback({ userId }) {
  const [count, setCount] = useState(0);
  const fetchUser = useCallback(async () => {
    const user = await api.getUser(userId);
    console.log(user);
  }, [userId]); // Recreated when userId changes
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}
```


### With Multiple Dependencies
```javascript
function ComplexCallback({ userId, filter, sortOrder }) {
  const fetchData = useCallback(async () => {
    const data = await api.getData({
      userId,
      filter,
      sortOrder
    });
    console.log(data);
  }, [userId, filter, sortOrder]); // All dependencies
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return <div>Data</div>;
}
```
---


## When to Use useCallback


### ✅ Good Use Cases


#### 1. Passing Callbacks to Memoized Children
```javascript
const MemoizedChild = React.memo(({ onClick, label }) => {
  console.log('Child rendered:', label);
  return <button onClick={onClick}>{label}</button>;
});
function Parent({ items }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  // Good: Prevents unnecessary re-renders
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Name: {name}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoizedChild onClick={handleClick} label="Click Me" />
    </div>
  );
}
```


#### 2. Dependency in useEffect
```javascript
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const fetchData = useCallback(async () => {
    const userData = await api.getData(userId);
    setData(userData);
  }, [userId]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // Without useCallback, this would run on every render!
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```


#### 3. Dependency in Other Hooks
```javascript
function Component({ items }) {
  const [filter, setFilter] = useState('');
  const filterItems = useCallback(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);
  const memoizedValue = useMemo(() => {
    const filtered = filterItems();
    return filtered.length;
  }, [filterItems]);
  return <div>Count: {memoizedValue}</div>;
}
```


#### 4. Event Handlers Passed to Many Children
```javascript
const ExpensiveItem = React.memo(({ item, onClick }) => {
  console.log('Rendering item:', item.id);
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  );
});
function Parent({ largeList }) {
  const handleItemClick = useCallback((id) => {
    console.log('Item clicked:', id);
  }, []); // Same function reference for all items
  return (
    <div>
      {largeList.map(item => (
        <ExpensiveItem 
          key={item.id} 
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
}
```


### ❌ When NOT to Use useCallback
```javascript
// ❌ BAD: Simple function, no optimization needed
function SimpleComponent() {
  const handleClick = useCallback(() => {
    console.log('click');
  }, []); // Unnecessary overhead
  return <button onClick={handleClick}>Click</button>;
}
// ✅ GOOD: Just use regular function
function SimpleComponent() {
  const handleClick = () => {
    console.log('click');
  };
  return <button onClick={handleClick}>Click</button>;
}
// ❌ BAD: No memoized child to benefit
function BadOptimization() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <Child onClick={handleClick} />;
}
// ✅ GOOD: Only use when child is memoized
function GoodOptimization() {
  const MemoizedChild = React.memo(Child);
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  return <MemoizedChild onClick={handleClick} />;
}
// ❌ BAD: Dependencies change too often
function BadDeps() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log(count);
  }, [count]); // Recreated every time count changes!
  // Better to use functional update
}
// ✅ GOOD: Use functional updates to avoid dependencies
function GoodDeps() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1); // No count in dependencies!
  }, []); // Stable reference
}
```
---


## Common Patterns


### Pattern 1: Memoized Event Handlers
```javascript
const Button = React.memo(({ onClick, children }) => {
  console.log('Button rendered:', children);
  return <button onClick={onClick}>{children}</button>;
});
function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1); // Functional update
  }, []); // No dependencies
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Name: {name}</p>
      <Button onClick={handleIncrement}>
        Increment: {count}
      </Button>
      <Button onClick={handleClick}>
        Click Me
      </Button>
    </div>
  );
}
```


### Pattern 2: Debounced Handlers
```javascript
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debounceTimeoutRef = useRef(null);
  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    // Simulate API call
    const data = await fetch(`/api/search?q=${searchTerm}`).then(r => r.json());
    setResults(data);
  }, []);
  const debouncedSearch = useCallback((searchTerm) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 500);
  }, [performSearch]);
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search..." />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```


### Pattern 3: Dynamic Handlers with Parameters
```javascript
const Item = React.memo(({ item, onClick }) => {
  console.log('Item rendered:', item.id);
  return (
    <div onClick={() => onClick(item.id)}>
      {item.name}
    </div>
  );
});
function ItemList({ items, onItemAction }) {
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId);
    onItemAction(itemId);
  }, [onItemAction]);
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Item 
            item={item} 
            onClick={handleItemClick}
          />
        </li>
      ))}
    </ul>
  );
}
```


### Pattern 4: Conditional Callbacks
```javascript
function ConditionalHandler({ condition, userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = useCallback(async () => {
    if (!condition) return;
    setLoading(true);
    try {
      const userData = await api.getUser(userId);
      setData(userData);
    } finally {
      setLoading(false);
    }
  }, [condition, userId]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (loading) return <div>Loading...</div>;
  return <div>{data ? JSON.stringify(data) : 'No data'}</div>;
}
```


### Pattern 5: Chained Callbacks
```javascript
function ChainHandlers() {
  const [step, setStep] = useState(0);
  const handleNext = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);
  const handlePrevious = useCallback(() => {
    setStep(prev => prev - 1);
  }, []);
  const handleReset = useCallback(() => {
    setStep(0);
  }, []);
  return (
    <div>
      <p>Step: {step}</p>
      <button onClick={handlePrevious} disabled={step === 0}>
        Previous
      </button>
      <button onClick={handleNext}>
        Next
      </button>
      <button onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
```
---


## Performance Optimization


### Before Optimization
```javascript
function UserList({ users }) {
  const [filter, setFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleUserSelect = (userId) => {
    setSelectedId(userId);
  };
  const filteredUsers = users.filter(u => u.name.includes(filter));
  return (
    <div>
      <input value={filter} onChange={handleFilterChange} placeholder="Filter users..." />
      {filteredUsers.map(user => (
        <div 
          key={user.id}
          onClick={() => handleUserSelect(user.id)}
          style={{ 
            padding: '10px', 
            background: user.id === selectedId ? '#007bff' : '#f0f0f0',
            cursor: 'pointer'
          }}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
```
**Problem**: Every time `filter` changes, all user items re-render unnecessarily!


### After Optimization
```javascript
const UserItem = React.memo(({ user, isSelected, onSelect }) => {
  console.log('Rendering user:', user.name);
  return (
    <div 
      onClick={() => onSelect(user.id)}
      style={{ 
        padding: '10px', 
        background: isSelected ? '#007bff' : '#f0f0f0',
        cursor: 'pointer',
        margin: '5px'
      }}
    >
      {user.name}
    </div>
  );
});
function UserList({ users }) {
  const [filter, setFilter] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);
  const handleUserSelect = useCallback((userId) => {
    setSelectedId(userId);
  }, []);
  const filteredUsers = useMemo(() => 
    users.filter(u => u.name.includes(filter)), 
    [users, filter]
  );
  return (
    <div>
      <input 
        value={filter} 
        onChange={handleFilterChange} 
        placeholder="Filter users..."
      />
      {filteredUsers.map(user => (
        <UserItem
          key={user.id}
          user={user}
          isSelected={user.id === selectedId}
          onSelect={handleUserSelect}
        />
      ))}
    </div>
  );
}
```
**Now**: `UserItem` only re-renders when its props change!
---


## Advanced Patterns


### Pattern 1: useCallback with useRef
```javascript
function Autosave({ data }) {
  const lastSaveRef = useRef(null);
  const autoSaveEnabledRef = useRef(true);
  const saveData = useCallback(async () => {
    if (!autoSaveEnabledRef.current || data === lastSaveRef.current) {
      return;
    }
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      lastSaveRef.current = data;
      console.log('Auto-saved!');
    } catch (error) {
      console.error('Save failed:', error);
    }
  }, [data]);
  const handleToggleAutoSave = useCallback(() => {
    autoSaveEnabledRef.current = !autoSaveEnabledRef.current;
    console.log('Auto-save:', autoSaveEnabledRef.current);
  }, []);
  useEffect(() => {
    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [saveData]);
  return (
    <div>
      <p>Auto-saving: {autoSaveEnabledRef.current ? 'ON' : 'OFF'}</p>
      <button onClick={handleToggleAutoSave}>Toggle</button>
    </div>
  );
}
```


### Pattern 2: Memoized Callbacks with Previous Values
```javascript
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
function SmartInput({ onSubmit }) {
  const [value, setValue] = useState('');
  const prevValue = usePrevious(value);
  const handleSubmit = useCallback(() => {
    if (value === prevValue) {
      console.log('Value unchanged, skipping submit');
      return;
    }
    onSubmit(value);
  }, [value, prevValue, onSubmit]);
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return (
    <div>
      <input value={value} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```


### Pattern 3: Custom Hook with useCallback
```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  const setTrue = useCallback(() => {
    setValue(true);
  }, []);
  const setFalse = useCallback(() => {
    setValue(false);
  }, []);
  return [value, { toggle, setTrue, setFalse }];
}
function ToggleButton() {
  const [isOn, { toggle, setTrue, setFalse }] = useToggle();
  return (
    <div>
      <p>Status: {isOn ? 'ON' : 'OFF'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Turn On</button>
      <button onClick={setFalse}>Turn Off</button>
    </div>
  );
}
```


### Pattern 4: Callback with Multiple Parameters
```javascript
function MultiParamHandler() {
  const handleAction = useCallback((action, target, data) => {
    console.log('Action:', action);
    console.log('Target:', target);
    console.log('Data:', data);
  }, []); // No dependencies needed
  const handleClick = useCallback((event, additionalInfo) => {
    console.log('Clicked:', event.target);
    console.log('Info:', additionalInfo);
  }, []);
  return (
    <div>
      <button onClick={(e) => handleAction('save', 'file', { name: 'test' })}>
        Save
      </button>
      <button onClick={(e) => handleClick(e, 'extra')}>
        Click
      </button>
    </div>
  );
}
```
---


## useCallback vs useMemo


### Key Differences
```javascript
// useCallback - memoizes FUNCTIONS
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
// useMemo - memoizes VALUES
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```


### When to Use Each
```javascript
// ❌ BAD: Using useMemo for functions
const handleClick = useMemo(() => {
  return () => {
    console.log('click');
  };
}, []);
// ✅ GOOD: Use useCallback for functions
const handleClick = useCallback(() => {
  console.log('click');
}, []);
// ❌ BAD: Using useCallback for values
const sum = useCallback(() => a + b, [a, b]);
// ✅ GOOD: Use useMemo for values
const sum = useMemo(() => a + b, [a, b]);
```


### Combined Usage
```javascript
function OptimizedComponent({ items }) {
  const [filter, setFilter] = useState('');
  // Memoized callback
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);
  // Memoized value (uses the callback in dependency)
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  // Memoized callback that uses memoized value
  const handleItemClick = useCallback((itemId) => {
    const item = filteredItems.find(i => i.id === itemId);
    console.log('Clicked item:', item);
  }, [filteredItems]);
  return (
    <div>
      <input value={filter} onChange={handleFilterChange} />
      <ul>
        {filteredItems.map(item => (
          <li key={item.id} onClick={() => handleItemClick(item.id)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
---


## Combining with React.memo


### Without React.memo (not effective)
```javascript
// This useCallback won't help!
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('click');
  }, []);
  return <Child onClick={handleClick} />;
}
function Child({ onClick }) {
  console.log('Child rendered'); // ALWAYS renders!
  return <button onClick={onClick}>Click</button>;
}
```


### With React.memo (effective)
```javascript
// Now useCallback helps!
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('click');
  }, []); // Stable reference
  return <MemoizedChild onClick={handleClick} />;
}
const MemoizedChild = React.memo(({ onClick }) => {
  console.log('Child rendered'); // Only renders when onClick changes!
  return <button onClick={onClick}>Click</button>;
});
```


### Advanced: Custom Comparison
```javascript
const MemoizedChild = React.memo(
  ({ onClick, data }) => {
    return <button onClick={onClick}>{data}</button>;
  },
  (prevProps, nextProps) => {
    // Custom comparison
    return prevProps.data === nextProps.data 
      && prevProps.onClick === nextProps.onClick;
  }
);
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback(() => {
    console.log('click');
  }, []); // Stable reference ensures optimized comparison
  return <MemoizedChild onClick={handleClick} data="test" />;
}
```
---


## Common Pitfalls


### Pitfall 1: Missing Dependencies
```javascript
// ❌ BAD: Missing dependency
function Component({ userId }) {
  const [data, setData] = useState(null);
  const fetchData = useCallback(async () => {
    const user = await api.getUser(userId); // Using userId
  }, []); // Missing userId!
  useEffect(() => {
    fetchData();
  }, [fetchData]);
}
// ✅ GOOD: Correct dependencies
function Component({ userId }) {
  const [data, setData] = useState(null);
  const fetchData = useCallback(async () => {
    const user = await api.getUser(userId);
    setData(user);
  }, [userId]); // Correct!
  useEffect(() => {
    fetchData();
  }, [fetchData]);
}
```


### Pitfall 2: Dependencies Change Too Often
```javascript
// ❌ BAD: Recreates on every render
function BadComponent({ items }) {
  const handleClick = useCallback((id) => {
    console.log('clicked:', id);
  }, [items]); // items might change frequently!
  return <Child onClick={handleClick} />;
}
// ✅ GOOD: Use functional updates
function GoodComponent({ items }) {
  const handleClick = useCallback((id) => {
    // Access items when needed, not in closure
    console.log('clicked:', id, items);
  }, []); // Stable reference!
  return <Child onClick={handleClick} />;
}
```


### Pitfall 3: Using useCallback Unnecessarily
```javascript
// ❌ BAD: Overuse
function OverOptimized() {
  const handleClick = useCallback(() => console.log('click'), []);
  const handleSubmit = useCallback(() => console.log('submit'), []);
  const handleChange = useCallback(() => console.log('change'), []);
  // ... 10 more callbacks
  // Overhead outweighs benefits!
}
// ✅ GOOD: Only when needed
function Reasonable() {
  // No optimization for simple component
  return (
    <div>
      <button onClick={() => console.log('click')}>Click</button>
    </div>
  );
}
```
---


## Best Practices


### ✅ DO
1. **Use useCallback with React.memo**
   ```javascript
   const MemoizedChild = React.memo(Child);
   const handleClick = useCallback(() => {}, []);
   return <MemoizedChild onClick={handleClick} />;
   ```
2. **Keep dependencies minimal**
   ```javascript
   // Good: Uses functional update to avoid dependency
   const handleClick = useCallback(() => {
     setCount(prev => prev + 1);
   }, []);
   ```
3. **Use for expensive computations with callbacks**
   ```javascript
   const filteredData = useMemo(() => 
     items.filter(/* expensive filter */), 
     [items]
   );
   const handleClick = useCallback(() => {
     // Uses filteredData
   }, []);
   ```
4. **Document complex callbacks**
   ```javascript
   // Memoized to prevent unnecessary re-renders of ChildComponent
   const handleClick = useCallback(() => {
     // Complex logic
   }, [/* deps */]);
   ```


### ❌ DON'T
1. **Don't use without React.memo**
   ```javascript
   // Won't help if child isn't memoized!
   const handleClick = useCallback(() => {}, []);
   return <NormalChild onClick={handleClick} />;
   ```
2. **Don't recreate callbacks frequently**
   ```javascript
   const handleClick = useCallback(() => {}, [dependencyThatChangesOften]);
   // Defeats the purpose!
   ```
3. **Don't overuse useCallback**
   ```javascript
   // Not needed for simple callbacks
   const handleClick = useCallback(() => console.log('click'), []);
   ```
4. **Don't forget dependencies**
   ```javascript
   // Missing dependencies can cause bugs!
   const fetchData = useCallback(() => {
     api.getData(userId);
   }, []); // Missing userId!
   ```
---


## Real-World Applications


### Application 1: Search with Debouncing
```javascript
function SearchWithDebounce() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debounceRef = useRef(null);
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    try {
      const response = await fetch(`/api/search?q=${searchQuery}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, []);
  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  return (
    <div>
      <input 
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```


### Application 2: Optimized List with Actions
```javascript
const TodoItem = React.memo(({ todo, onToggle, onDelete, onEdit }) => {
  console.log('Rendering todo:', todo.id);
  return (
    <div style={{ padding: '10px', margin: '5px', background: '#f0f0f0' }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onEdit(todo.id)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});
function TodoListApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Master useCallback', completed: false },
    { id: 3, text: 'Build apps', completed: true },
  ]);
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);
  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);
  const handleEdit = useCallback((id) => {
    const newText = prompt('Edit todo:');
    if (newText) {
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      ));
    }
  }, []);
  return (
    <div>
      <h2>Todos</h2>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}
```


### Application 3: Form with Validation
```javascript
const FormField = React.memo(({ name, value, onChange, error, label }) => {
  console.log('Rendering field:', name);
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={{ border: error ? '2px solid red' : '1px solid #ccc' }}
      />
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
});
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const validate = useCallback((name, value) => {
    const newErrors = { ...errors };
    if (name === 'name' && !value) {
      newErrors.name = 'Name is required';
    } else if (name === 'email' && !value.includes('@')) {
      newErrors.email = 'Invalid email';
    } else if (name === 'password' && value.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
  }, [errors]);
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validate(name, value);
  }, [validate]);
  return (
    <form>
      <FormField
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <FormField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <FormField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
    </form>
  );
}
```
---


## Interview Preparation


### Common Questions About useCallback


#### Q1: What is useCallback and when should you use it?
**Answer**: useCallback memoizes functions to prevent unnecessary re-renders. Use it when:
- Passing callbacks to memoized child components
- Callbacks are dependencies of other hooks
- Callbacks are passed to many child components
- Callbacks are expensive to recreate


#### Q2: What's the difference between useCallback and useMemo?
**Answer**: useCallback memoizes functions, useMemo memoizes values. useCallback returns the same function reference, useMemo returns the computed value.


#### Q3: Why would useCallback not work with a regular child component?
**Answer**: useCallback prevents prop changes, but a regular child re-renders when the parent re-renders regardless of prop changes. You need React.memo to prevent re-renders based on prop comparison.


#### Q4: What happens if you forget dependencies in useCallback?
**Answer**: The callback will use stale values, potentially causing bugs. The callback closure will capture old values from when it was created.


#### Q5: When should you NOT use useCallback?
**Answer**: Don't use useCallback when:
- The component is not expensive to re-render
- Child components are not memoized
- Callbacks have dependencies that change frequently
- The overhead of memoization outweighs benefits
---


## Practice Exercise


### Requirements:
- ✅ Optimize a search component with useCallback
- ✅ Prevent unnecessary re-renders of child components
- ✅ Implement debounced search
- ✅ Memoize event handlers
- ✅ Combine useCallback with React.memo


### Solution:
See practice file: `day-12/practice/search-optimization.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **useCallback**: Hook for memoizing functions
2. **Performance**: Prevents unnecessary re-renders
3. **Memoization**: Returns same function reference
4. **Dependencies**: Include all used values
5. **React.memo**: Essential for useCallback to work
6. **Functional Updates**: Avoid extra dependencies
7. **Best Practices**: Don't overuse, use wisely


### 🎯 Key Concepts
- useCallback memoizes function references
- Only use when it prevents re-renders
- Include all dependencies in dependency array
- Combine with React.memo for best results
- Don't overuse - it has overhead
- Use functional updates to avoid dependencies
- Measure before optimizing


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ useMemo for value memoization
- ✅ Optimizing expensive calculations
- ✅ useMemo vs useCallback
- ✅ Building performant React apps
---
**Great work! 🎉 You've mastered useCallback!**
**You're now ready to learn useMemo for value optimization! 🚀**
---


## Summary Cheat Sheet


### useCallback Quick Reference
```javascript
// Basic usage
const handleClick = useCallback(() => {
  doSomething();
}, []);
// With dependencies
const handleAction = useCallback((id) => {
  doSomething(id, userId);
}, [userId]);
// With functional updates (avoid dependencies)
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // No count in dependencies!
```


### When to Use
```javascript
// ✅ Good: With memoized child
const MemoizedChild = React.memo(Child);
const handleClick = useCallback(() => {}, []);
return <MemoizedChild onClick={handleClick} />;
// ✅ Good: As dependency
const fetchData = useCallback(() => {}, [userId]);
useEffect(() => { fetchData(); }, [fetchData]);
// ❌ Bad: Without memoized child
const handleClick = useCallback(() => {}, []);
return <Child onClick={handleClick} />; // Won't help!
```


### Common Patterns
```javascript
// Pattern 1: Memoized event handler
const handleClick = useCallback(() => {}, []);
// Pattern 2: With functional updates
const handleClick = useCallback(() => {
  setState(prev => prev + 1);
}, []); // No deps needed!
// Pattern 3: With useRef
const handleClick = useCallback(() => {
  ref.current.doSomething();
}, []); // ref.current doesn't need to be a dep
// Pattern 4: Combined with useMemo
const filtered = useMemo(() => filter(items), [items]);
const handleClick = useCallback(() => {
  // Use filtered
}, []); // Only if filtered is used
```
---
**Complete! You've mastered useCallback from basics to production patterns! 🎯**
