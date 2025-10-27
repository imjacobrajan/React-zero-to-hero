# Day 8: useEffect Hook - Part 1

## Introduction

Welcome to Day 8! Today you'll learn **useEffect** - React's most important hook for side effects. By the end of today, you'll:
- ✅ Understand what useEffect does (complete fundamentals)
- ✅ Know when to use useEffect
- ✅ Master the dependency array (every scenario)
- ✅ Fetch data from APIs with async/await
- ✅ Handle component lifecycle correctly
- ✅ Build a data fetching app
- ✅ Understand the rendering lifecycle
- ✅ Common patterns and best practices

> **📌 What's NOT in Day 8**: Cleanup functions, memory leaks, and advanced useEffect patterns. Those are covered in Day 9. Day 8 focuses on the basics of useEffect and data fetching.

**Today's Scope**:
1. useEffect basics and syntax
2. What are side effects
3. Empty dependency array (mount)
4. Dependency array with values
5. Fetching data on mount
6. async/await in useEffect
7. Loading and error states
8. Common patterns

---

## Understanding useEffect

### What are Side Effects?

**Side effects** are operations that happen outside the normal render flow:
- API calls
- Subscriptions
- DOM manipulation
- Timer management
- Logging to console

**Analogy**: Think of useEffect as a **sprinkler system**:
- Automatically runs at specific times (after mount, when dependencies change)
- Handles maintenance tasks (data fetching, cleanup)
- Fire and forget operations

### Basic useEffect

```javascript
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    // This runs after every render
    console.log('Component rendered');
  });
  
  return <div>Hello</div>;
}
```

---

## useEffect Syntax

### Basic Form

```javascript
useEffect(() => {
  // Side effect code here
});
```

### With Dependency Array

```javascript
useEffect(() => {
  // Side effect code here
}, [dependency1, dependency2]);
```

### With Cleanup

```javascript
useEffect(() => {
  // Setup code
  
  return () => {
    // Cleanup code
  };
}, [dependencies]);
```

---

## Component Lifecycle

### React Lifecycle

1. **Mount**: Component is created and added to DOM
2. **Update**: Component re-renders due to state/props change
3. **Unmount**: Component is removed from DOM

### useEffect Timing

```javascript
function LifecycleDemo() {
  useEffect(() => {
    // Runs after mount and every update
    console.log('Effect ran');
  });
  
  useEffect(() => {
    // Runs only after mount
    console.log('Mount effect');
  }, []);
  
  useEffect(() => {
    // Runs on mount and when 'count' changes
    console.log('Count effect');
  }, [count]);
  
  return <div>Component</div>;
}
```

---

## Empty Dependency Array

### Effect Runs Once

```javascript
function MyComponent() {
  useEffect(() => {
    console.log('This runs only once on mount');
    fetchInitialData();
  }, []); // Empty array = run once
  
  return <div>Content</div>;
}
```

**When to use**: Initial setup, one-time API calls, event listeners setup

---

## Dependency Array Basics

### Adding Dependencies

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(`Count is ${count}`);
    document.title = `Count: ${count}`;
  }, [count]); // Runs when 'count' changes
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Multiple Dependencies

```javascript
function Form({ user }) {
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Runs when 'user' or 'email' changes
    console.log('User or email changed');
  }, [user, email]);
  
  return <input value={email} onChange={(e) => setEmail(e.target.value)} />;
}
```

---

## Common useEffect Patterns

### Pattern 1: Data Fetching

```javascript
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Pattern 2: Window Event Listeners

```javascript
function WindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div>Window width: {size}</div>;
}
```

### Pattern 3: Document Title Updates

```javascript
function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return <h1>{title}</h1>;
}
```

---

## Fetching Data on Mount

### Complete Example

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${userId}\`);
        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## useCallback with useEffect

### Preventing Infinite Loops

```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  
  const fetchTodos = useCallback(() => {
    fetch(`/api/todos?filter=${filter}`)
      .then(res => res.json())
      .then(setTodos);
  }, [filter]);
  
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]); // Use memoized function
  
  return <div>...</div>;
}
```

---

## Real-World Examples

### Example 1: API Polling

```javascript
function LivePriceTracker({ symbol }) {
  const [price, setPrice] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/price/${symbol}`)
        .then(res => res.json())
        .then(data => setPrice(data.price));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [symbol]);
  
  return <div>Price: ${price}</div>;
}
```

### Example 2: Save to LocalStorage

```javascript
function AutoSave({ content }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('draft', content);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  return null;
}
```

### Example 3: Analytics Tracking

```javascript
function PageView({ pageName }) {
  useEffect(() => {
    // Track page view
    analytics.track('page_view', {
      page: pageName,
      timestamp: Date.now()
    });
  }, [pageName]);
  
  return null;
}
```

---

## Advanced Patterns

### Pattern 1: Dependent API Calls

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}/posts`)
        .then(res => res.json())
        .then(setPosts);
    }
  }, [user]);
  
  return user ? <div>...</div> : <div>Loading...</div>;
}
```

### Pattern 2: Conditional Side Effects

```javascript
function ConditionalEffect({ isEnabled }) {
  useEffect(() => {
    if (!isEnabled) return;
    
    const subscription = setupSubscription();
    return () => subscription.unsubscribe();
  }, [isEnabled]);
  
  return <div>...</div>;
}
```

---

## Performance Optimization

### Skipping Effects

```javascript
function ExpensiveComponent({ data }) {
  const [processedData, setProcessedData] = useState(null);
  
  useEffect(() => {
    // Only process if data changed
    if (!data) return;
    
    const processed = expensiveProcessing(data);
    setProcessedData(processed);
  }, [data]); // Only runs when data changes
  
  return <div>{processedData}</div>;
}
```

### Effect Dependency Lists

```javascript
function SmartEffect({ userId, refetch }) {
  useEffect(() => {
    fetchUser(userId);
    // ESLint will warn if you forget refetch
  }, [userId, refetch]); // Always include all dependencies
}
```

---

## Common Mistakes

### Mistake 1: Missing Dependencies

```javascript
// ❌ WRONG
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(setUser);
  }, []); // Missing userId!
}
```

### Mistake 2: Infinite Loop

```javascript
// ❌ WRONG - Infinite loop
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1); // Triggers re-render, which triggers effect again!
  }, [count]);
  
  return <div>{count}</div>;
}
```

### Mistake 3: Stale Closures

```javascript
// ❌ WRONG - Stale closure
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setTimeout(() => {
      console.log(count); // Logs old count value!
    }, 1000);
  }, []);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## Practice Exercise

**Fetch user data from JSONPlaceholder API on mount**

### Requirements:
- ✅ Use useEffect to fetch data
- ✅ Display loading state
- ✅ Handle errors gracefully
- ✅ Show user information
- ✅ Allow switching between different users

### Solution:

See practice file: `day-08/practice/user-data-fetch.jsx`

---

## Data Fetching with useEffect

### Basic Fetch Pattern

```javascript
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Start loading
    setLoading(true);
    setError(null);
    
    // Fetch data
    fetch(`/api/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Using async/await

```javascript
function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Dependency Array Deep Dive

### Empty Dependency Array []

```javascript
function Component() {
  useEffect(() => {
    // Runs only ONCE on mount
    console.log('Component mounted');
    
    fetch('/api/data').then(response => response.json());
  }, []); // Empty array = run once
  
  return <div>Component</div>;
}
```

### Dependency Array with Values

```javascript
function Component({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Runs whenever userId changes
    fetch(`/api/users/${userId}`)
      .then(response => response.json())
      .then(setUser);
  }, [userId]); // Re-runs when userId changes
  
  return <div>{user?.name}</div>;
}
```

### Multiple Dependencies

```javascript
function DataDisplay({ user, filter, sortBy }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Runs when any of the dependencies change
    fetchData(user.id, filter, sortBy)
      .then(setData);
  }, [user, filter, sortBy]);
  
  return <div>{data.length} items</div>;
}
```

### No Dependency Array (Run Every Render)

```javascript
function Component() {
  useEffect(() => {
    // Runs on EVERY render
    console.log('Component rendered');
  }); // No array = run every render
  
  return <div>Component</div>;
}
```

**⚠️ Warning**: Without a dependency array, the effect runs on every render. Use with caution!

---

## useEffect Execution Timing

### When useEffect Runs

```javascript
function Component({ count }) {
  console.log('1. Render');
  
  useEffect(() => {
    console.log('3. Effect (after render and DOM update)');
    
    return () => {
      console.log('4. Cleanup (before next effect or unmount)');
    };
  }, [count]);
  
  console.log('2. Still rendering');
  
  return <div>Count: {count}</div>;
}
```

### Multiple useEffects Order

```javascript
function Component() {
  console.log('Render');
  
  useEffect(() => {
    console.log('Effect 1 (mount)');
    return () => console.log('Cleanup 1');
  }, []);
  
  useEffect(() => {
    console.log('Effect 2 (mount)');
    return () => console.log('Cleanup 2');
  }, []);
  
  return <div>Content</div>;
}

// Execution order:
// 1. Render
// 2. Effect 1
// 3. Effect 2
```

---

## Common useEffect Patterns

### Pattern 1: Document Title

```javascript
function DocumentTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  
  return <div>{title}</div>;
}
```

### Pattern 2: Window Event Listener

```javascript
function WindowResize({ onResize }) {
  useEffect(() => {
    const handleResize = () => {
      onResize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onResize]);
  
  return null;
}
```

### Pattern 3: Console Logging (Debug)

```javascript
function DebugComponent({ data }) {
  useEffect(() => {
    console.log('Data updated:', data);
  }, [data]);
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Pattern 4: Local Storage Sync

```javascript
function PersistentState({ key }) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : '';
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
```

---

## Fetching from Different APIs

### REST API Example

```javascript
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Multiple API Calls

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    
    // Fetch user
    const userPromise = fetch(`/api/users/${userId}`)
      .then(res => res.json());
    
    // Fetch posts
    const postsPromise = fetch(`/api/users/${userId}/posts`)
      .then(res => res.json());
    
    // Wait for both
    Promise.all([userPromise, postsPromise])
      .then(([userData, postsData]) => {
        setUser(userData);
        setPosts(postsData);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Loading and Error States

### Complete Loading Pattern

```javascript
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch('/api/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return (
      <div className="loading-state">
        <Spinner />
        <p>Loading data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-state">
        <ErrorIcon />
        <h3>Error loading data</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="empty-state">
        <EmptyIcon />
        <p>No data available</p>
      </div>
    );
  }
  
  return (
    <div className="data-state">
      <DataDisplay data={data} />
    </div>
  );
}
```

---

## Best Practices for useEffect

### ✅ DO

1. Always include dependencies in the dependency array
2. Use cleanup functions for subscriptions and listeners
3. Handle loading and error states
4. Use async/await for cleaner async code
5. Extract complex effects into custom hooks
6. Consider using multiple useEffect hooks for separation of concerns

### ❌ DON'T

1. Don't forget the dependency array when needed
2. Don't mutate state directly in effects
3. Don't use useEffect for transformations (use derived state)
4. Don't create infinite loops by missing dependencies
5. Don't forget to clean up subscriptions
6. Don't use useEffect for event handlers (use event handlers)

---

## Common Mistakes

### Mistake 1: Missing Dependencies

```javascript
// ❌ BAD - Missing count in dependencies
function Counter({ count }) {
  useEffect(() => {
    console.log(count); // Uses count but not in deps
  }, []); // Missing count!
}

// ✅ GOOD - Include all dependencies
function Counter({ count }) {
  useEffect(() => {
    console.log(count);
  }, [count]); // Includes count
}
```

### Mistake 2: Infinite Loop

```javascript
// ❌ BAD - Infinite loop!
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1); // Updates count
  }, [count]); // which triggers effect again!
  
  return <div>{count}</div>;
}

// ✅ GOOD - Use functional update
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(prev => prev + 1); // Uses prev, no dependency needed
  }, []); // Empty array is OK here
  
  return <div>{count}</div>;
}
```

### Mistake 3: Creating Objects in Dependency Array

```javascript
// ❌ BAD - New object every render
function BadComponent({ user }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchUserData(user.id);
  }, [{ id: user.id }]); // New object every render!
  
  return <div>{data}</div>;
}

// ✅ GOOD - Use primitive values
function GoodComponent({ user }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchUserData(user.id);
  }, [user.id]); // Primitive value
  
  return <div>{data}</div>;
}
```

---

## Interview Preparation

### Common Questions About useEffect

#### Q1: What does useEffect do?

**Answer**: useEffect lets you perform side effects in functional components, like data fetching, subscriptions, or manually changing the DOM.

#### Q2: When does useEffect run?

**Answer**: By default, after every render. With empty array `[]`, it runs once on mount. With dependencies, it runs when those values change.

#### Q3: Can you use async/await in useEffect?

**Answer**: Yes, but you can't make the effect function itself async. Define an async function inside the effect and call it.

#### Q4: What's the dependency array for?

**Answer**: It tells React when to re-run the effect based on changing values.

#### Q5: What happens without a dependency array?

**Answer**: The effect runs on every render, which can cause performance issues.

---

## useEffect for Data Fetching Patterns

### Pattern 1: Single Data Fetch

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Pattern 2: Sequential Data Fetching

```javascript
function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        // First, load user
        const userResponse = await fetch(`/api/users/${userId}`);
        const userData = await userResponse.json();
        setUser(userData);
        
        // Then, load user's posts
        const postsResponse = await fetch(`/api/users/${userId}/posts`);
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <h2>Posts</h2>
      {posts.map(post => <div key={post.id}>{post.title}</div>)}
    </div>
  );
}
```

### Pattern 3: Conditional Data Fetching

```javascript
function OptionalData({ userId, shouldLoadPosts }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  useEffect(() => {
    if (shouldLoadPosts && userId) {
      fetch(`/api/users/${userId}/posts`)
        .then(res => res.json())
        .then(setPosts);
    }
  }, [shouldLoadPosts, userId]);
  
  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {shouldLoadPosts && (
        <div>
          <h2>Posts</h2>
          {posts.map(post => <div key={post.id}>{post.title}</div>)}
        </div>
      )}
    </div>
  );
}
```

---

## useEffect with Timers

### Pattern 1: Interval Timer

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div>Seconds: {seconds}</div>;
}
```

### Pattern 2: Delayed Action

```javascript
function DelayedMessage({ message, delay }) {
  const [shownMessage, setShownMessage] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShownMessage(message);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [message, delay]);
  
  return <div>{shownMessage}</div>;
}
```

### Pattern 3: Debounced Search

```javascript
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      searchAPI(searchTerm).then(setResults);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return (
    <div>
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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

## useEffect with Event Listeners

### Window Events

```javascript
function WindowSize({ onSizeChange }) {
  useEffect(() => {
    const handleResize = () => {
      onSizeChange(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onSizeChange]);
  
  return null;
}
```

### Keyboard Events

```javascript
function KeyboardShortcuts({ onKeyPress }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      onKeyPress(e);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyPress]);
  
  return null;
}
```

### Scroll Events

```javascript
function ScrollableList({ children }) {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div>
      <div>Scroll position: {scrollY}px</div>
      {children}
    </div>
  );
}
```

---

## Multiple useEffect Hooks

### Separation of Concerns

```javascript
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState('offline');
  
  // Effect 1: Load user data
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  // Effect 2: Subscribe to notifications
  useEffect(() => {
    const eventSource = new EventSource(`/api/notifications/${userId}`);
    eventSource.onmessage = (event) => {
      setNotifications(prev => [...prev, JSON.parse(event.data)]);
    };
    
    return () => eventSource.close();
  }, [userId]);
  
  // Effect 3: Track online status
  useEffect(() => {
    setOnlineStatus('online');
    
    const handleOffline = () => setOnlineStatus('offline');
    const handleOnline = () => setOnlineStatus('online');
    
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  return (
    <div>
      <div>Status: {onlineStatus}</div>
      <div>Notifications: {notifications.length}</div>
      {user && <h1>{user.name}</h1>}
    </div>
  );
}
```

---

## Async Functions in useEffect

### Proper Pattern

```javascript
function AsyncComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Define async function inside
    async function fetchData() {
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    }
    
    // Call it
    fetchData();
  }, []);
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### With Error Handling

```javascript
function AsyncComponentWithError() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    }
    
    fetchData();
  }, []);
  
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Side Effects Explained

### What Are Side Effects?

Side effects are operations that:
- Interact with the world outside your component
- Don't result in JSX being returned
- Have effects beyond just rendering

### Types of Side Effects

```javascript
// 1. DOM Manipulation
useEffect(() => {
  document.title = 'New Title';
}, []);

// 2. API Calls
useEffect(() => {
  fetch('/api/data').then(res => res.json());
}, []);

// 3. Subscriptions
useEffect(() => {
  const subscription = subscribe();
  return () => unsubscribe();
}, []);

// 4. Timers
useEffect(() => {
  const timer = setInterval(() => doSomething(), 1000);
  return () => clearInterval(timer);
}, []);

// 5. Event Listeners
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// 6. Local Storage
useEffect(() => {
  localStorage.setItem('key', value);
}, [value]);
```

---

## useEffect Lifecycle Visualization

### Component Lifecycle with useEffect

```
Component Renders
      ↓
useEffect Hook Called
      ↓
Side Effect Executes
      ↓
Component Unmounts (or dependencies change)
      ↓
Cleanup Function Runs (if provided)
```

### Example with All Phases

```javascript
function Component({ userId }) {
  console.log('1. Component rendering');
  
  useEffect(() => {
    console.log('2. Effect running');
    
    return () => {
      console.log('3. Cleanup running');
    };
  }, [userId]);
  
  console.log('4. Still rendering');
  
  return <div>Hello</div>;
}

// Console output:
// 1. Component rendering
// 4. Still rendering
// 2. Effect running
// (when userId changes or unmounts)
// 3. Cleanup running
```

---

## useEffect Dependencies Deep Dive

### Understanding Dependencies

React compares current dependency values with previous values using `Object.is()`:

```javascript
useEffect(() => {
  console.log('Effect runs when deps change');
}, [dependency1, dependency2]);

// React does: Object.is(prevDep1, currentDep1)
```

### Primitives as Dependencies

```javascript
function Component({ userId, count }) {
  // These work fine
  useEffect(() => {
    console.log(userId, count);
  }, [userId, count]); // ✅ Primitives work great
  
  return <div>Content</div>;
}
```

### Objects as Dependencies (Problematic)

```javascript
function Component({ config }) {
  // ❌ BAD - Object reference changes every render
  useEffect(() => {
    fetchData(config);
  }, [config]); // config is new object every render!
  
  // ✅ GOOD - Use specific properties
  useEffect(() => {
    fetchData(config.apiUrl);
  }, [config.apiUrl]);
  
  // ✅ GOOD - Use useMemo for stable reference
  const stableConfig = useMemo(() => config, [config.apiUrl]);
  useEffect(() => {
    fetchData(stableConfig);
  }, [stableConfig]);
  
  return <div>Content</div>;
}
```

### Functions as Dependencies

```javascript
// ❌ BAD - New function every render
function Component({ handleSubmit }) {
  useEffect(() => {
    setupEventListeners(handleSubmit);
    return () => removeEventListeners(handleSubmit);
  }, [handleSubmit]); // handleSubmit changes every render!
  
  // ✅ GOOD - Wrap in useCallback in parent
  // Parent:
  const handleSubmit = useCallback(() => {
    // handle submit
  }, [deps]);
  
  // ✅ ALTERNATIVE - Define inside useEffect
  function Component() {
    useEffect(() => {
      const handleSubmit = () => { /* ... */ };
      setupEventListeners(handleSubmit);
      return () => removeEventListeners(handleSubmit);
    }, []);
  }
}
```

---

## Complete Data Fetching Pattern

```javascript
function CompleteDataFetcher({ resourceId, onSuccess, onError }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/resource/${resourceId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const jsonData = await response.json();
        
        // Only update state if request wasn't cancelled
        if (!cancelled) {
          setData(jsonData);
          setLoading(false);
          onSuccess?.(jsonData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
          onError?.(err);
        }
      }
    }
    
    fetchData();
    
    // Cleanup: Cancel if component unmounts or resourceId changes
    return () => {
      cancelled = true;
    };
  }, [resourceId, onSuccess, onError]);
  
  return { data, loading, error };
}
```

---

## More useEffect Patterns

### Pattern: Polling for Updates

```javascript
function PollingComponent({ endpoint }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(endpoint);
      const json = await response.json();
      setData(json);
    };
    
    // Poll every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    // Initial fetch
    fetchData();
    
    return () => clearInterval(interval);
  }, [endpoint]);
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Pattern: Updating Document Meta

```javascript
function DocumentMeta({ title, description }) {
  useEffect(() => {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);
  
  return null;
}
```

### Pattern: Analytics Tracking

```javascript
function TrackableComponent({ userId, eventName }) {
  useEffect(() => {
    if (userId && eventName) {
      // Track user interaction
      analytics.track(eventName, { userId, timestamp: Date.now() });
    }
  }, [userId, eventName]);
  
  return <div>Component content</div>;
}
```

### Pattern: Focus Management

```javascript
function AutoFocusInput({ autoFocus }) {
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  return <input ref={inputRef} />;
}
```

---

## useEffect Gotchas

### Gotcha 1: Stale Closures

```javascript
// ❌ BAD - Old count value is captured
function BadCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Uses old count!
    }, 1000);
    
    return () => clearInterval(timer);
  }, [count]); // Effect re-runs every second!
  
  return <div>{count}</div>;
}

// ✅ GOOD - Uses functional update
function GoodCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1); // Uses latest count
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Runs once on mount
  
  return <div>{count}</div>;
}
```

### Gotcha 2: Missing Dependencies

```javascript
// ❌ BAD - Missing dependency
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing userId!
  
  // If userId changes, effect doesn't re-run
}

// ✅ GOOD - Include all dependencies
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // Includes userId
  
  // Effect re-runs when userId changes
}
```

### Gotcha 3: Infinite Loops

```javascript
// ❌ BAD - Infinite loop!
function BadComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, [data]); // data changes, effect runs, changes data, effect runs again!
  
  return <div>{JSON.stringify(data)}</div>;
}

// ✅ GOOD - No dependency on data
function GoodComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []); // Run once on mount
  
  return <div>{JSON.stringify(data)}</div>;
}
```

---

## Testing useEffect

### Testing Components with useEffect

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import DataComponent from './DataComponent';

test('fetches data on mount', async () => {
  render(<DataComponent resourceId="123" />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/user data/i)).toBeInTheDocument();
  });
});

test('handles errors', async () => {
  render(<DataComponent resourceId="invalid" />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

---

## Resources & Further Reading

### Official Documentation
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Fetching Data](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### MDN References
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

---

## Key Takeaways

### ✅ What You Learned Today

1. **useEffect**: Hook for side effects
2. **Dependency Array**: Controls when effect runs
3. **Empty Array**: Run once on mount
4. **Cleanup**: Cleanup function returned from effect
5. **Data Fetching**: Common use case for useEffect

### 🎯 Key Concepts

- useEffect runs after render
- Empty array = run once
- Dependencies = when to re-run
- Always clean up subscriptions
- Handle loading and error states

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ Cleanup functions in detail
- ✅ Preventing memory leaks
- ✅ Multiple useEffect hooks
- ✅ Advanced useEffect patterns

---

**Great work! 🎉 You've mastered useEffect fundamentals and data fetching!**

**You're now ready for Day 9: useEffect Hook - Part 2 (cleanup and advanced patterns)! 🚀**

---

## useEffect Quick Reference

### Dependency Array Guide

| Dependency Array | When Effect Runs |
|-----------------|------------------|
| **No array** | After every render |
| **`[]`** | Once on mount |
| **`[dep]`** | When dep changes |
| **`[dep1, dep2, ...]`** | When any dependency changes |

### Common useEffect Patterns

```javascript
// 1. Data fetching on mount
useEffect(() => {
  fetchData().then(setData);
}, []);

// 2. Fetching on prop/state change
useEffect(() => {
  fetchData(userId).then(setData);
}, [userId]);

// 3. Event listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// 4. Timer
useEffect(() => {
  const timer = setInterval(() => doSomething(), 1000);
  return () => clearInterval(timer);
}, []);

// 5. async/await with fetch
useEffect(() => {
  async function loadData() {
    const data = await fetch('/api/data').then(r => r.json());
    setData(data);
  }
  loadData();
}, []);
```

### Best Practices Checklist

- [ ] Include all dependencies in the dependency array
- [ ] Use cleanup functions for subscriptions/timers
- [ ] Handle loading states properly
- [ ] Handle error states properly
- [ ] Use async/await correctly inside useEffect
- [ ] Avoid infinite loops
- [ ] Use functional updates for state in effects
- [ ] Extract complex effects to custom hooks
- [ ] Test your effects thoroughly

**This completes Day 8! You're ready for advanced useEffect patterns! 🎯**
