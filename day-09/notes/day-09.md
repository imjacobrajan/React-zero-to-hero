# Day 9: useEffect Hook - Part 2 (Cleanup & Dependencies)

## 📋 Table of Contents
- [Introduction](#introduction)
- [Cleanup Functions Deep Dive](#cleanup-functions-deep-dive)
- [Preventing Memory Leaks](#preventing-memory-leaks)
- [Advanced Cleanup Patterns](#advanced-cleanup-patterns)
- [useEffect Timing & Execution](#useeffect-timing--execution)
- [Multiple useEffect Hooks](#multiple-useeffect-hooks)
- [Conditional Effects](#conditional-effects)
- [Canceling Requests](#canceling-requests)
- [Real-World Examples](#real-world-examples)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Resources & Further Reading](#resources--further-reading)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 9! Today you'll master **advanced useEffect** patterns including cleanup functions, preventing memory leaks, and handling complex side effects. By the end of today, you'll:
- ✅ Master cleanup functions in depth
- ✅ Prevent memory leaks effectively
- ✅ Understand when cleanup runs
- ✅ Cancel async operations properly
- ✅ Use multiple useEffect hooks efficiently
- ✅ Build a live search with debouncing
- ✅ Handle complex side effects

> **📌 What's NOT in Day 9**: Custom hooks, other hooks like useCallback, useMemo, etc. Day 9 focuses exclusively on advanced useEffect patterns including cleanup and dependencies.

**Today's Scope**:
1. Cleanup functions - complete understanding
2. Preventing memory leaks
3. Canceling async operations
4. Advanced dependency patterns
5. Multiple useEffect hooks
6. Debouncing and throttling with effects
7. Real-world complex examples

---

## Cleanup Functions Deep Dive

### Why Cleanup Functions Matter

Cleanup functions in useEffect serve critical purposes:
1. **Prevent Memory Leaks**: Cancel timers, subscriptions, and requests
2. **Avoid Race Conditions**: Cancel stale async operations
3. **Resource Management**: Free up resources when components unmount
4. **Stop Duplicate Effects**: Clean up before next effect runs

### Basic Cleanup Pattern

```javascript
useEffect(() => {
  // Setup code here
  const subscription = subscribeToUpdates();
  
  // Cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, [dependencies]);
```

### Cleanup Execution Order

```javascript
function Example() {
  console.log('1. Render');
  
  useEffect(() => {
    console.log('2. Effect runs');
    
    return () => {
      console.log('3. Cleanup runs');
    };
  }, []);
  
  console.log('4. Still rendering');
  
  return <div>Content</div>;
}

// Output when component mounts:
// 1. Render
// 4. Still rendering
// 2. Effect runs

// Output when component unmounts or dependencies change:
// 3. Cleanup runs
// (followed by new effect if dependencies changed)
```

### Cleanup for Timers

```javascript
function TimerComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(timer);
      console.log('Timer cleaned up');
    };
  }, []);
  
  return <div>Count: {count}</div>;
}
```

---

## Preventing Memory Leaks

### Problem 1: Stale Closures in Timers

```javascript
// ❌ BAD - Stale closure
function BadCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Uses old 'count'
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Missing 'count' in deps
  
  return <div>Count: {count}</div>; // Count stays at 0
}

// ✅ GOOD - Functional update
function GoodCounter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1); // Uses current 'count'
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Empty deps is OK with functional update
  
  return <div>Count: {count}</div>; // Count increments
}
```

---

## Advanced Cleanup Patterns

### Event Listeners Cleanup

```javascript
function EventListenerComponent() {
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
  
  return <div>Scroll: {scrollY}px</div>;
}
```

### WebSocket Cleanup

```javascript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(`wss://chat.example.com/rooms/${roomId}`);
    
    ws.onopen = () => console.log('Connected');
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };
    ws.onerror = (error) => console.error('WebSocket error:', error);
    
    return () => {
      ws.close();
      console.log('WebSocket closed');
    };
  }, [roomId]);
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
}
```

### Polling with Cleanup

```javascript
function PollingComponent({ endpoint }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(endpoint);
      const json = await response.json();
      setData(json);
    };
    
    fetchData(); // Initial fetch
    
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, [endpoint]);
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Subscription Cleanup

```javascript
function SubscriptionComponent({ channel }) {
  const [lastMessage, setLastMessage] = useState(null);
  
  useEffect(() => {
    const subscription = EventEmitter.subscribe(channel, (data) => {
      setLastMessage(data);
    });
    
    return () => {
      subscription.unsubscribe();
      console.log(`Unsubscribed from ${channel}`);
    };
  }, [channel]);
  
  return (
    <div>
      Last message: {lastMessage ? JSON.stringify(lastMessage) : 'None'}
    </div>
  );
}
```

---

## useEffect Timing & Execution

### Cleanup Before Re-run

```javascript
function ReRunExample({ userId }) {
  console.log('Render with userId:', userId);
  
  useEffect(() => {
    console.log(`Effect starts for user ${userId}`);
    
    const timer = setTimeout(() => {
      console.log(`Timer fired for user ${userId}`);
    }, 2000);
    
    return () => {
      console.log(`Cleanup runs for user ${userId}`);
      clearTimeout(timer);
    };
  }, [userId]);
  
  return <div>User: {userId}</div>;
}

// When userId changes from 1 to 2:
// Render with userId: 2
// Cleanup runs for user 1
// Effect starts for user 2
```

### Multiple Effects Order

```javascript
function MultipleEffects({ value }) {
  console.log('Render');
  
  // Effect 1
  useEffect(() => {
    console.log('Effect 1');
    return () => console.log('Cleanup 1');
  }, [value]);
  
  // Effect 2
  useEffect(() => {
    console.log('Effect 2');
    return () => console.log('Cleanup 2');
  }, [value]);
  
  // Effect 3
  useEffect(() => {
    console.log('Effect 3');
    return () => console.log('Cleanup 3');
  }, [value]);
  
  return <div>Value: {value}</div>;
}

// On mount:
// Effect 1
// Effect 2
// Effect 3

// On unmount (reverse order):
// Cleanup 3
// Cleanup 2
// Cleanup 1
```

---

## Multiple useEffect Hooks

### Pattern 1: Separate Data Loading

```javascript
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Load user
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  // Load posts
  useEffect(() => {
    fetchPosts(userId).then(setPosts);
  }, [userId]);
  
  // Load notifications
  useEffect(() => {
    const unsubscribe = subscribeToNotifications(userId, (notif) => {
      setNotifications(prev => [...prev, notif]);
    });
    return () => unsubscribe();
  }, [userId]);
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <div>Posts: {posts.length}</div>
      <div>Notifications: {notifications.length}</div>
    </div>
  );
}
```

### Pattern 2: UI and Logic Separation

```javascript
function ComplexComponent({ itemId }) {
  const [item, setItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Data loading
  useEffect(() => {
    fetchItem(itemId).then(setItem);
  }, [itemId]);
  
  // Window size tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div>
      <div>Width: {windowWidth}px</div>
      <div>Status: {isOnline ? 'Online' : 'Offline'}</div>
      {item && <div>{item.name}</div>}
    </div>
  );
}
```

---

## Conditional Effects

### Skip Effect Based on Condition

```javascript
function ConditionalFetch({ userId, enabled }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    if (!enabled) {
      console.log('Effect skipped');
      return;
    }
    
    console.log('Fetching user');
    fetchUser(userId).then(setUser);
  }, [userId, enabled]);
  
  return (
    <div>
      {enabled ? `Loading user ${userId}...` : 'Fetching disabled'}
      {user && <div>{user.name}</div>}
    </div>
  );
}
```

### Skip When Empty

```javascript
function EmptySkipComponent({ searchTerm }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    searchAPI(searchTerm).then(setResults);
  }, [searchTerm]);
  
  return (
    <div>
      {results.length > 0 ? (
        <ul>
          {results.map(r => <li key={r.id}>{r.name}</li>)}
        </ul>
      ) : (
        <div>No results</div>
      )}
    </div>
  );
}
```

---

## Canceling Requests

### Using AbortController

```javascript
function CancellableFetch({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchUser() {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
    
    return () => {
      controller.abort();
      console.log(`Cancelled request for user ${userId}`);
    };
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
```

### Flag-Based Cancellation

```javascript
function FlagCancellation({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchUser() {
      const data = await fetch(`/api/users/${userId}`).then(r => r.json());
      
      if (!cancelled) {
        setUser(data);
      } else {
        console.log('Request was cancelled');
      }
    }
    
    fetchUser();
    
    return () => {
      cancelled = true;
      console.log(`Cancelled fetch for user ${userId}`);
    };
  }, [userId]);
  
  return <div>{user?.name || 'Loading...'}</div>;
}
```

---

## Real-World Examples

### Example 1: Live Search with Debouncing

```javascript
function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const debounceTimer = setTimeout(() => {
      setLoading(true);
      
      searchAPI(query)
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Search error:', err);
          setLoading(false);
        });
    }, 300);
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);
  
  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(r => <li key={r.id}>{r.name}</li>)}
      </ul>
    </div>
  );
}
```

### Example 2: Real-time Data Updates

```javascript
function RealTimeData({ dataId }) {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/data/${dataId}`);
      const json = await response.json();
      setData(json);
      setLastUpdate(new Date());
    };
    
    fetchData();
    
    const interval = setInterval(fetchData, 5000);
    
    return () => {
      clearInterval(interval);
      console.log('Stopped polling');
    };
  }, [dataId]);
  
  return (
    <div>
      <div>Data: {JSON.stringify(data)}</div>
      <div>Last update: {lastUpdate?.toLocaleTimeString()}</div>
    </div>
  );
}
```

### Example 3: Document Title Updates

```javascript
function DynamicTitle({ pageTitle, user }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${pageTitle} - MyApp`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [pageTitle]);
  
  return (
    <div>
      <h1>{pageTitle}</h1>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
```

---

## Best Practices

### ✅ DO

1. Always provide cleanup functions for side effects
2. Use functional updates to avoid stale closures
3. Cancel async operations on unmount
4. Separate concerns into multiple useEffects
5. Use AbortController for fetch cancellation
6. Handle loading and error states
7. Test cleanup functions

### ❌ DON'T

1. Don't forget cleanup for timers/subscriptions
2. Don't miss dependencies in dependency array
3. Don't mutate state directly in effects
4. Don't create infinite loops
5. Don't forget to cancel async requests
6. Don't set state on unmounted components
7. Don't use effects for transformations

---

## Common Pitfalls

### Pitfall 1: Setting State on Unmounted Component

```javascript
// ❌ BAD - May try to set state after unmount
function BadComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser); // May run after unmount!
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

// ✅ GOOD - Check before setting state
function GoodComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setUser(data);
      });
    
    return () => { cancelled = true; };
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

### Pitfall 2: Multiple Cleanup Calls

```javascript
// ❌ BAD - Effect runs multiple times
function BadComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }); // Missing dependency array - runs every render!
  
  return <div>Count: {count}</div>;
}

// ✅ GOOD - Effect runs once
function GoodComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Empty array - runs once on mount
  
  return <div>Count: {count}</div>;
}
```

---

## Resources & Further Reading

### Official Documentation
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### MDN References
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval)

---

## Advanced useEffect Scenarios

### Scenario 1: Dependent Data Loading

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Load user first
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  // Load posts when user is loaded
  useEffect(() => {
    if (!user) return; // Wait for user
    
    fetch(`/api/users/${userId}/posts`)
      .then(res => res.json())
      .then(setPosts);
  }, [userId, user]);
  
  if (!user) return <div>Loading user...</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <div>Posts: {posts.length}</div>
    </div>
  );
}
```

### Scenario 2: Window Size Tracking

```javascript
function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div>
      <p>Width: {windowSize.width}px</p>
      <p>Height: {windowSize.height}px</p>
    </div>
  );
}
```

### Scenario 3: Keyboard Shortcuts

```javascript
function KeyboardShortcuts() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowUp') {
        setCount(prev => prev + 1);
      } else if (e.key === 'ArrowDown') {
        setCount(prev => prev - 1);
      } else if (e.key === 'r' || e.key === 'R') {
        setCount(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Press ↑ to increase, ↓ to decrease, R to reset</p>
    </div>
  );
}
```

---

## useEffect Dependencies Deep Dive

### Understanding When Effects Re-run

```javascript
function DependencyExample({ userId, filters }) {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  
  // Effect 1: Runs only on mount
  useEffect(() => {
    console.log('This runs ONCE');
  }, []);
  
  // Effect 2: Runs when userId changes
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  // Effect 3: Runs when filters change (object dependency)
  useEffect(() => {
    fetchFilteredData(filters).then(setData);
  }, [filters]); // ⚠️ filters object reference must be stable
  
  return <div>{user?.name}</div>;
}
```

### Object Dependencies - Common Issue

```javascript
// ❌ BAD - New object every render
function BadComponent({ config }) {
  useEffect(() => {
    doSomething(config);
  }, [config]); // config is new object every render!
}

// ✅ GOOD - Use primitive values
function GoodComponent({ config }) {
  const { apiUrl, timeout } = config;
  
  useEffect(() => {
    doSomething(apiUrl, timeout);
  }, [apiUrl, timeout]); // Use primitive values
}

// ✅ ALTERNATIVE - useMemo
function AlsoGoodComponent({ config }) {
  const memoizedConfig = useMemo(() => config, [
    config.apiUrl,
    config.timeout
  ]);
  
  useEffect(() => {
    doSomething(memoizedConfig);
  }, [memoizedConfig]);
}
```

---

## Debugging useEffect

### Adding Console Logs

```javascript
function DebuggingComponent({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    console.log('useEffect triggered', { userId });
    
    const controller = new AbortController();
    
    async function fetchData() {
      try {
        console.log('Fetching data...');
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal
        });
        console.log('Response received');
        const data = await response.json();
        console.log('Data set:', data);
        setUser(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    fetchData();
    
    return () => {
      console.log('Cleanup running');
      controller.abort();
    };
  }, [userId]);
  
  return <div>{user?.name}</div>;
}
```

### Using React DevTools

```javascript
// Enable useEffect tracking in DevTools:
// 1. Open React DevTools
// 2. Select component
// 3. Check "Render" section
// 4. See which effects ran and why
```

---

## Real-World Applications

### Application 1: Chat Application

```javascript
function ChatRoom({ roomId, userId }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`wss://chat.example.com/${roomId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'join', userId }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };
    
    ws.onerror = () => setIsConnected(false);
    
    ws.onclose = () => setIsConnected(false);
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId, userId]);
  
  // Mark messages as read
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead(roomId, messages[messages.length - 1].id);
    }
  }, [messages, roomId]);
  
  return (
    <div>
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  );
}
```

### Application 2: Form Auto-save

```javascript
function AutoSaveForm({ formId }) {
  const [formData, setFormData] = useState({});
  const [lastSaved, setLastSaved] = useState(null);
  
  // Save on unmount
  useEffect(() => {
    return () => {
      if (formData && Object.keys(formData).length > 0) {
        saveToDraft(formId, formData);
      }
    };
  }, [formId, formData]);
  
  // Auto-save periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData && Object.keys(formData).length > 0) {
        saveToDraft(formId, formData);
        setLastSaved(new Date());
      }
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(interval);
  }, [formId, formData]);
  
  return (
    <div>
      <input onChange={e => setFormData({ ...formData, name: e.target.value })} />
      {lastSaved && <div>Last saved: {lastSaved.toLocaleTimeString()}</div>}
    </div>
  );
}
```

### Application 3: Infinite Scroll

```javascript
function InfiniteScroll({ endpoint }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Load initial data
  useEffect(() => {
    loadData(page);
  }, []);
  
  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);
  
  // Load more data
  useEffect(() => {
    if (page > 1) {
      loadData(page);
    }
  }, [page]);
  
  const loadData = async (pageNum) => {
    setLoading(true);
    
    const data = await fetch(`${endpoint}?page=${pageNum}`).then(r => r.json());
    
    if (data.items.length === 0) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...data.items]);
    }
    
    setLoading(false);
  };
  
  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      {loading && <div>Loading more...</div>}
    </div>
  );
}
```

---

## useEffect Execution Timing Flow

### Visual Flow Diagram

```
Component Renders
      ↓
useEffect Called (but not run yet)
      ↓
Browser Paints (DOM Update)
      ↓
Effect Code Executes
      ↓
(dependencies change OR unmount)
      ↓
Cleanup Function Runs
      ↓
(if dependencies changed)
      ↓
Effect Code Executes Again
```

### Practical Example

```javascript
function TimingFlowExample({ userId }) {
  console.log('1. Component rendering');
  
  useEffect(() => {
    console.log('3. Effect executing');
    
    const timer = setTimeout(() => {
      console.log('4. Timer callback');
    }, 100);
    
    return () => {
      console.log('5. Cleanup executing');
      clearTimeout(timer);
    };
  }, [userId]);
  
  console.log('2. Still rendering');
  
  return <div>User: {userId}</div>;
}

// Output when component first mounts:
// 1. Component rendering
// 2. Still rendering
// 3. Effect executing
// 4. Timer callback (100ms later)

// When userId changes:
// 5. Cleanup executing
// 3. Effect executing
// 4. Timer callback
```

---

## Complex Real-World Examples

### Example: Data Synchronization

```javascript
function DataSync({ userId, syncEnabled }) {
  const [localData, setLocalData] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Load initial data
  useEffect(() => {
    loadFromCache(userId).then(setLocalData);
  }, [userId]);
  
  // Sync to server
  useEffect(() => {
    if (!syncEnabled || !localData) return;
    
    const syncInterval = setInterval(async () => {
      setIsSyncing(true);
      
      try {
        await syncToServer(userId, localData);
        console.log('Sync successful');
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        setIsSyncing(false);
      }
    }, 10000); // Sync every 10 seconds
    
    return () => {
      clearInterval(syncInterval);
      console.log('Sync stopped');
    };
  }, [userId, syncEnabled, localData]);
  
  return (
    <div>
      {isSyncing && <div>Syncing...</div>}
      <div>{JSON.stringify(localData)}</div>
    </div>
  );
}
```

### Example: Notification Manager

```javascript
function NotificationManager({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState(null);
  
  // Request permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(setPermission);
    }
  }, []);
  
  // Subscribe to push notifications
  useEffect(() => {
    if (!user || !permission || permission !== 'granted') return;
    
    const eventSource = new EventSource(`/api/notifications/${user.id}`);
    
    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications(prev => [...prev, notification]);
      
      // Show browser notification
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon
      });
    };
    
    eventSource.onerror = () => {
      console.error('EventSource error');
    };
    
    return () => {
      eventSource.close();
    };
  }, [user, permission]);
  
  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map(n => (
        <div key={n.id}>{n.title}</div>
      ))}
    </div>
  );
}
```

### Example: Live Collaboration

```javascript
function CollaborativeEditor({ docId, userId }) {
  const [content, setContent] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  
  // Connection effect
  useEffect(() => {
    const ws = new WebSocket(`wss://collab.example.com/${docId}`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'join',
        userId
      }));
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'update':
          setContent(message.content);
          break;
        case 'cursor':
          updateOtherCursor(message.userId, message.position);
          break;
        case 'collaborator':
          setCollaborators(message.users);
          break;
        default:
          break;
      }
    };
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'leave', userId }));
        ws.close();
      }
    };
  }, [docId, userId]);
  
  // Send updates with throttling
  useEffect(() => {
    if (!content) return;
    
    const throttleTimer = setTimeout(() => {
      sendUpdate(docId, content);
    }, 500);
    
    return () => clearTimeout(throttleTimer);
  }, [content, docId]);
  
  return (
    <div>
      <div>Collaborators: {collaborators.length}</div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
      />
    </div>
  );
}
```

---

## useEffect with Dependencies Patterns

### Pattern 1: Dynamic Dependencies

```javascript
function DynamicDependencies({ filters, sorting, pagination }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const { page, limit } = pagination;
    const { sortBy, sortOrder } = sorting;
    const { search, category } = filters;
    
    fetchData({ page, limit, sortBy, sortOrder, search, category })
      .then(setData);
  }, [pagination, sorting, filters]);
  
  return <div>{data.length} items</div>;
}
```

### Pattern 2: Computed Dependencies

```javascript
function ComputedDependencies({ items, filter }) {
  const [filteredItems, setFilteredItems] = useState([]);
  
  useEffect(() => {
    const filtered = items.filter(item => {
      return filter ? item.name.includes(filter) : true;
    });
    setFilteredItems(filtered);
  }, [items, filter]);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Pattern 3: Conditional Cleanup

```javascript
function ConditionalCleanup({ autoStart }) {
  const [timer, setTimer] = useState(null);
  
  useEffect(() => {
    if (!autoStart) return; // No effect if not enabled
    
    const interval = setInterval(() => {
      console.log('Timer tick');
    }, 1000);
    
    setTimer(interval);
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoStart]);
  
  return <div>Timer: {autoStart ? 'Running' : 'Stopped'}</div>;
}
```

---

## Performance Optimization with useEffect

### Avoiding Unnecessary Re-renders

```javascript
// ❌ BAD - Creates new functions on every render
function BadComponent({ data }) {
  const [processedData, setProcessedData] = useState(null);
  
  useEffect(() => {
    const process = (data) => {
      return data.map(item => ({ ...item, processed: true }));
    };
    
    setProcessedData(process(data));
  }, [data]);
  
  return <div>{JSON.stringify(processedData)}</div>;
}

// ✅ GOOD - Extract function outside or use useMemo
function GoodComponent({ data }) {
  const [processedData, setProcessedData] = useState(null);
  
  useEffect(() => {
    const processed = data.map(item => ({ ...item, processed: true }));
    setProcessedData(processed);
  }, [data]);
  
  return <div>{JSON.stringify(processedData)}</div>;
}
```

---

## Testing useEffect

### Testing Cleanup

```javascript
import { render, unmount } from '@testing-library/react';
import TimerComponent from './TimerComponent';

test('cleanup clears interval', () => {
  const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
  
  const { unmount } = render(<TimerComponent />);
  
  unmount();
  
  expect(clearIntervalSpy).toHaveBeenCalled();
  clearIntervalSpy.mockRestore();
});
```

---

## Resources & Further Reading

### Official Documentation
- [useEffect Hook](https://react.dev/reference/react/useEffect)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### MDN References
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Timers](https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval)
- [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)

---

## Key Takeaways

### ✅ What You Learned Today

1. **Cleanup Functions**: Essential for preventing memory leaks
2. **When Cleanup Runs**: Before re-run and on unmount
3. **Multiple useEffects**: Separate concerns into different effects
4. **Canceling Requests**: Use AbortController or cancellation flags
5. **Timing & Execution**: Understand the complete flow
6. **Real-World Patterns**: WebSocket, polling, synchronization
7. **Performance**: Optimize to avoid unnecessary re-renders

### 🎯 Key Concepts

- Always provide cleanup functions
- Use functional updates for timers/intervals
- Cancel async operations on unmount
- Separate concerns into multiple useEffects
- Use AbortController for fetch cancellation
- Handle all states: loading, error, success

### 📚 Next Steps

Tomorrow (Day 10) you'll build your first mini project - a weather app with data fetching!

---

**Great work! 🎉 You've mastered advanced useEffect patterns with cleanup!**

**You're now ready to build your first real-world app! 🚀**

---

## Summary: useEffect Cleanup Patterns

### Quick Reference Cheat Sheet

| Pattern | Use Case | Cleanup Needed |
|---------|----------|----------------|
| **Timer** | setInterval/setTimeout | ✅ clearInterval/clearTimeout |
| **Event Listener** | addEventListener | ✅ removeEventListener |
| **Subscription** | Subscriptions | ✅ unsubscribe |
| **WebSocket** | WebSocket connections | ✅ ws.close() |
| **Fetch** | HTTP requests | ✅ AbortController |
| **Polling** | Periodic updates | ✅ clearInterval |

### When Cleanup Runs

```javascript
// Cleanup runs:
// 1. Before next effect (if dependencies changed)
// 2. On component unmount
// 3. In reverse order of effect registration

useEffect(() => {
  console.log('Effect 1');
  return () => console.log('Cleanup 1');
}, []);

useEffect(() => {
  console.log('Effect 2');
  return () => console.log('Cleanup 2');
}, []);

// On unmount:
// Cleanup 2 runs first
// Cleanup 1 runs second
```

### Common Patterns Reference

```javascript
// Pattern 1: Timer with cleanup
useEffect(() => {
  const timer = setInterval(() => doSomething(), 1000);
  return () => clearInterval(timer);
}, []);

// Pattern 2: Event listener with cleanup
useEffect(() => {
  const handler = () => doSomething();
  window.addEventListener('event', handler);
  return () => window.removeEventListener('event', handler);
}, []);

// Pattern 3: Fetch with cancellation
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);

// Pattern 4: Conditional effect
useEffect(() => {
  if (!condition) return; // Skip effect
  doSomething();
  return () => cleanup();
}, [condition]);
```

---

## Practice Project Ideas

### Project 1: Live Search Component
- Debounced input
- Cancel previous requests
- Handle loading/error states
- Display results

### Project 2: WebSocket Chat
- Connect on mount
- Listen for messages
- Send messages
- Disconnect on unmount

### Project 3: Polling Dashboard
- Fetch data on interval
- Stop on unmount
- Handle offline/online
- Retry on failure

---

**Complete! You've mastered useEffect cleanup! 🎯**

---

## More Cleanup Examples

### Example: Media Player

```javascript
function MediaPlayer({ videoUrl }) {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const video = videoRef.current;
    
    const handlePlay = () => console.log('Video playing');
    const handlePause = () => console.log('Video paused');
    const handleEnd = () => console.log('Video ended');
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnd);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnd);
    };
  }, [videoUrl]);
  
  return <video ref={videoRef} src={videoUrl} controls />;
}
```

### Example: Geolocation Tracking

```javascript
function GeoLocationTracker() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        setError(err.message);
      },
      { enableHighAccuracy: true }
    );
    
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  
  return (
    <div>
      {error && <div>Error: {error}</div>}
      {location && (
        <div>
          Lat: {location.lat}, Lng: {location.lng}
        </div>
      )}
    </div>
  );
}
```

### Example: Document Visibility API

```javascript
function VisibilityTracker() {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <div>
      {isVisible ? 'Page is visible' : 'Page is hidden'}
    </div>
  );
}
```

### Example: Multiple Subscriptions

```javascript
function MultiSubscriptionComponent({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  useEffect(() => {
    // Subscribe to notifications
    const unsubNotify = subscribe('notifications', (data) => {
      setNotifications(prev => [...prev, data]);
    });
    
    // Subscribe to online users
    const unsubOnline = subscribe('online-users', (data) => {
      setOnlineUsers(data);
    });
    
    // Both cleanups run
    return () => {
      unsubNotify();
      unsubOnline();
    };
  }, [userId]);
  
  return (
    <div>
      <div>Notifications: {notifications.length}</div>
      <div>Online: {onlineUsers.length}</div>
    </div>
  );
}
```

---

## Debugging useEffect Issues

### Issue 1: Effect Running Too Often

```javascript
function TooOftenComponent({ config }) {
  const [data, setData] = useState(null);
  
  // ❌ Problem: Runs every render because config is new object
  useEffect(() => {
    fetchData(config).then(setData);
  }, [config]); // config reference changes every render!
  
  // ✅ Solution 1: Use primitive values
  useEffect(() => {
    fetchData(config.apiUrl).then(setData);
  }, [config.apiUrl]);
  
  // ✅ Solution 2: useMemo in parent
  // Parent:
  // const memoizedConfig = useMemo(() => config, [config.apiUrl]);
  // <Component config={memoizedConfig} />
  
  return <div>{JSON.stringify(data)}</div>;
}
```

### Issue 2: Missing Cleanup

```javascript
// ❌ Problem: No cleanup - memory leak
function LeakyComponent() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    // Forgot to clean up!
  }, []);
  
  return <div>Component</div>;
}

// ✅ Solution: Add cleanup
function GoodComponent() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return <div>Component</div>;
}
```

### Issue 3: Stale State in Closure

```javascript
// ❌ Problem: Uses old count value
function StaleClosure() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // Always logs 0!
      setCount(count + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [count]); // ⚠️ This causes timer to restart every second!
  
  return <div>Count: {count}</div>;
}

// ✅ Solution: Functional update
function FixedClosure() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
      setCount(c => c + 1); // Uses latest value
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Empty array - runs once
  
  return <div>Count: {count}</div>;
}
```

---

## Advanced Patterns

### Pattern: Request Deduplication

```javascript
const activeRequests = new Map();

function useDeduplicatedFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if request is already in progress
    if (activeRequests.has(url)) {
      activeRequests.get(url).then(setData);
      return;
    }
    
    setLoading(true);
    
    const request = fetch(url)
      .then(r => r.json())
      .then(json => {
        activeRequests.delete(url);
        setData(json);
        return json;
      })
      .finally(() => setLoading(false));
    
    activeRequests.set(url, request);
    
    return () => {
      // Don't delete if component unmounts
      // Keep it for other components
    };
  }, [url]);
  
  return { data, loading };
}
```

### Pattern: Request Queue

```javascript
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  async add(request) {
    this.queue.push(request);
    if (!this.processing) {
      this.process();
    }
  }
  
  async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      await request();
    }
    this.processing = false;
  }
}

const requestQueue = new RequestQueue();

function QueuedComponent() {
  useEffect(() => {
    const makeRequest = async () => {
      console.log('Making request');
      await fetch('/api/data');
    };
    
    requestQueue.add(makeRequest);
  }, []);
  
  return <div>Component</div>;
}
```

---

## useEffect Testing Strategies

### Testing Effects with Cleanup

```javascript
import { render, screen, waitFor, unmount } from '@testing-library/react';
import TimerComponent from './TimerComponent';

describe('useEffect Cleanup', () => {
  test('cleans up on unmount', async () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    const { unmount } = render(<TimerComponent />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
  
  test('cleans up when dependencies change', async () => {
    const { rerender } = render(<Component prop="value1" />);
    
    // Mock cleanup
    const cleanupSpy = jest.fn();
    
    rerender(<Component prop="value2" />);
    
    await waitFor(() => {
      // First cleanup should have been called
    });
  });
});
```

---

## Complete useFetch Implementation

```javascript
function useFetch(url, options = {}) {
  const {
    enabled = true,
    refetchOnMount = true,
    onSuccess,
    onError
  } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revalidateKey, setRevalidateKey] = useState(0);
  
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    let cancelled = false;
    
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        
        if (!cancelled) {
          setData(json);
          setLoading(false);
          onSuccess?.(json);
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
    
    return () => {
      cancelled = true;
    };
  }, [url, enabled, revalidateKey, onSuccess, onError]);
  
  const revalidate = () => setRevalidateKey(prev => prev + 1);
  
  return { data, loading, error, revalidate };
}

// Usage with callbacks
function MyComponent() {
  const { data, loading, error, revalidate } = useFetch('/api/data', {
    onSuccess: (data) => {
      console.log('Data fetched:', data);
    },
    onError: (error) => {
      console.error('Fetch failed:', error);
    }
  });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <button onClick={revalidate}>Refresh</button>
      {JSON.stringify(data)}
    </div>
  );
}
```

---

## useEffect with Custom Hook Pattern

```javascript
function useInterval(callback, delay) {
  useEffect(() => {
    if (delay === null) return;
    
    const interval = setInterval(callback, delay);
    
    return () => clearInterval(interval);
  }, [callback, delay]);
}

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
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return size;
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    if (debouncedSearch) {
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return (
    <input
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
  );
}
```

---

**Complete! You've mastered all useEffect patterns including cleanup! 🎯**
