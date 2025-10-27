# Day 10: Data Fetching Patterns
## Introduction
Welcome to Day 10! Today you'll master **data fetching patterns** in React. By the end of today, you'll:
- ✅ Use fetch API with React
- ✅ Handle loading states
- ✅ Handle error states
- ✅ Use async/await in useEffect
- ✅ Create custom fetch hooks
- ✅ Build a complete weather app
---


## Fetch API in React


### Basic Fetch
```javascript
function DataFetch() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  return <div>{JSON.stringify(data)}</div>;
}
```


### Fetch with Error Handling
```javascript
function SafeFetch() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, []);
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```
---


## Loading and Error States


### Complete Pattern
```javascript
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (users.length === 0) return <EmptyState />;
  return <List items={users} />;
}
```
---


## Async/Await in useEffect


### Using Async Inside useEffect
```javascript
function AsyncFetch() {
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchData();
        setData(data);
      } catch (error) {
        setError(error);
      }
    }
    loadData();
  }, []);
  // OR use IIFE
  useEffect(() => {
    (async () => {
      const data = await fetchData();
      setData(data);
    })();
  }, []);
}
```


### Proper Cleanup with Async
```javascript
function CancellableFetch({ userId }) {
  useEffect(() => {
    let cancelled = false;
    async function fetchUser() {
      const user = await fetch(\`/api/users/\${userId}\`);
      if (!cancelled) setUser(user);
    }
    fetchUser();
    return () => { cancelled = true; };
  }, [userId]);
  return <div>User</div>;
}
```
---


## Custom Fetch Hook


### Create useFetch Hook
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
}
// Usage
function App() {
  const { data, loading, error } = useFetch('/api/users');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```
---


## Practice Exercise
**Create a weather app fetching from OpenWeather API**


### Requirements:
- ✅ Search by city
- ✅ Display current weather
- ✅ Show loading state
- ✅ Handle errors
- ✅ Display weather icon


### Solution:
See practice file: `day-10/practice/weather-app.jsx`
---


## Advanced Fetch Patterns


### Pattern 1: Parallel Fetching
```javascript
function ParallelFetch({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadAll() {
      try {
        setLoading(true);
        const [userData, postsData, friendsData] = await Promise.all([
          fetch(`/api/users/${userId}`).then(r => r.json()),
          fetch(`/api/users/${userId}/posts`).then(r => r.json()),
          fetch(`/api/users/${userId}/friends`).then(r => r.json())
        ]);
        setUser(userData);
        setPosts(postsData);
        setFriends(friendsData);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [userId]);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{user?.name}</h1>
      <div>Posts: {posts.length}</div>
      <div>Friends: {friends.length}</div>
    </div>
  );
}
```


### Pattern 2: Sequential Fetching
```javascript
function SequentialFetch({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    async function loadSequentially() {
      // Step 1: Load user
      const userData = await fetch(`/api/users/${userId}`).then(r => r.json());
      setUser(userData);
      // Step 2: Load user's posts
      const postsData = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
      setPosts(postsData);
      // Step 3: Load comments for all posts
      const postIds = postsData.map(p => p.id);
      const commentsData = await Promise.all(
        postIds.map(id => 
          fetch(`/api/posts/${id}/comments`).then(r => r.json())
        )
      );
      setComments(commentsData.flat());
    }
    loadSequentially();
  }, [userId]);
  return <div>{user?.name}</div>;
}
```


### Pattern 3: Retry on Failure
```javascript
function RetryFetch({ endpoint }) {
  const [data, setData] = useState(null);
  const [retries, setRetries] = useState(0);
  const fetchWithRetry = async (url, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        return json;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        setRetries(i + 1);
      }
    }
  };
  useEffect(() => {
    fetchWithRetry(endpoint).then(setData).catch(console.error);
  }, [endpoint]);
  return (
    <div>
      {retries > 0 && <div>Retried {retries} times</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```
---


## Error Handling Deep Dive


### Network Error Handling
```javascript
function NetworkErrorHandler({ endpoint }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState('online');
  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  useEffect(() => {
    async function fetchData() {
      if (networkStatus === 'offline') {
        setError('No internet connection');
        return;
      }
      try {
        setError(null);
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
          setError('Network error - please check your connection');
        } else {
          setError(err.message);
        }
      }
    }
    fetchData();
  }, [endpoint, networkStatus]);
  return (
    <div>
      {networkStatus === 'offline' && <div>⚠️ Offline</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```


### Timeout Handling
```javascript
function FetchWithTimeout({ endpoint }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    async function fetchWithTimeout() {
      try {
        const timeout = setTimeout(() => {
          controller.abort();
          setError('Request timeout');
        }, 5000); // 5 second timeout
        const response = await fetch(endpoint, {
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request took too long');
        } else {
          setError(err.message);
        }
      }
    }
    fetchWithTimeout();
    return () => {
      controller.abort();
    };
  }, [endpoint]);
  return (
    <div>
      {error && <div>Error: {error}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```
---


## Optimistic Updates
```javascript
function OptimisticUpdate({ postId }) {
  const [post, setPost] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const handleLike = async () => {
    // Optimistic update
    setPost(prev => ({
      ...prev,
      likes: prev.likes + 1,
      isLiked: true
    }));
    try {
      setIsLiking(true);
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch (error) {
      // Rollback on error
      setPost(prev => ({
        ...prev,
        likes: prev.likes - 1,
        isLiked: false
      }));
      console.error('Like failed:', error);
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <div>
      <button onClick={handleLike} disabled={isLiking || post?.isLiked}>
        Like ({post?.likes})
      </button>
    </div>
  );
}
```
---


## Pagination with Fetch
```javascript
function PaginatedData({ endpoint }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      try {
        const response = await fetch(`${endpoint}?page=${page}`);
        const json = await response.json();
        setData(prev => [...prev, ...json.items]);
        setHasMore(json.hasMore);
      } catch (error) {
        console.error('Load error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [endpoint, page]);
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      {loading && <div>Loading...</div>}
      {hasMore && (
        <button onClick={() => setPage(p => p + 1)}>
          Load More
        </button>
      )}
    </div>
  );
}
```
---


## Custom Hooks for Data Fetching


### useFetch Hook (Advanced)
```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = await response.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [url, retryCount]);
  const retry = () => setRetryCount(c => c + 1);
  return { data, loading, error, retry };
}
```


### useMutation Hook
```javascript
function useMutation(endpoint) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const mutate = async (options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json = await response.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { mutate, loading, error, data };
}
```
---


## Loading States UX


### Loading Skeletons
```javascript
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <div>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-name"></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <img src={user.avatar} alt={user.name} />
          <div>{user.name}</div>
        </div>
      ))}
    </div>
  );
}
```


### Loading Progress
```javascript
function DownloadWithProgress() {
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchWithProgress = async () => {
      const response = await fetch('/api/large-file');
      const reader = response.body.getReader();
      const contentLength = parseInt(response.headers.get('Content-Length'));
      let receivedLength = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedLength += value.length;
        setProgress((receivedLength / contentLength) * 100);
      }
      const text = await response.text();
      setData(text);
    };
    fetchWithProgress();
  }, []);
  return (
    <div>
      <div>Progress: {progress.toFixed(1)}%</div>
      <progress value={progress} max={100} />
      {data && <div>{data}</div>}
    </div>
  );
}
```
---


## Error Boundary Pattern
```javascript
function ErrorBoundaryExample({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error);
    };
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  if (hasError) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <p>{error?.message}</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    );
  }
  return children;
}
```
---


## More Real-World Applications


### Weather App (Complete Example)
```javascript
function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    try {
      const API_KEY = 'your_api_key';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeather(city);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Search</button>
      </form>
      {loading && <div>Loading weather...</div>}
      {error && <div>Error: {error}</div>}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <div>Temperature: {weather.main.temp}°C</div>
          <div>Description: {weather.weather[0].description}</div>
          <div>Humidity: {weather.main.humidity}%</div>
        </div>
      )}
    </div>
  );
}
```


### GitHub User Fetcher
```javascript
function GitHubUser({ username }) {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!username) return;
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos`)
        ]);
        if (!userRes.ok) {
          throw new Error('User not found');
        }
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        setUser(userData);
        setRepos(reposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);
  if (loading) return <div>Loading GitHub user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Enter a GitHub username</div>;
  return (
    <div>
      <h1>{user.name}</h1>
      <img src={user.avatar_url} alt={user.name} />
      <p>Followers: {user.followers}</p>
      <p>Repos: {repos.length}</p>
      <ul>
        {repos.map(repo => (
          <li key={repo.id}>
            <a href={repo.html_url}>{repo.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```


### TODO List with API
```javascript
function TodoListWithAPI() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  useEffect(() => {
    loadTodos();
  }, []);
  const loadTodos = async () => {
    setLoading(true);
    const data = await fetch('/api/todos').then(r => r.json());
    setTodos(data);
    setLoading(false);
  };
  const addTodo = async (text) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const todo = await response.json();
    setTodos(prev => [...prev, todo]);
  };
  const toggleTodo = async (id) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH'
    });
    const updated = await response.json();
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  };
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(prev => prev.filter(t => t.id !== id));
  };
  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(newTodo);
        setNewTodo('');
      }}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="New todo"
        />
        <button type="submit">Add</button>
      </form>
      {loading && <div>Loading...</div>}
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
---


## Caching Strategies


### Local Storage Cache
```javascript
function CachedFetch({ endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const cacheKey = `cache_${endpoint}`;
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const age = Date.now() - parsed.timestamp;
      // Use cache if less than 5 minutes old
      if (age < 300000) {
        setData(parsed.data);
        return;
      }
    }
    // Fetch fresh data
    async function fetchData() {
      setLoading(true);
      const response = await fetch(endpoint);
      const json = await response.json();
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        data: json,
        timestamp: Date.now()
      }));
      setData(json);
      setLoading(false);
    }
    fetchData();
  }, [endpoint]);
  return loading ? <div>Loading...</div> : <div>{JSON.stringify(data)}</div>;
}
```


### In-Memory Cache
```javascript
const cache = new Map();
function CachedComponent({ endpoint }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (cache.has(endpoint)) {
      setData(cache.get(endpoint));
      return;
    }
    fetch(endpoint)
      .then(r => r.json())
      .then(json => {
        cache.set(endpoint, json);
        setData(json);
      });
  }, [endpoint]);
  return <div>{JSON.stringify(data)}</div>;
}
```
---


## Advanced Error States


### Error Recovery UI
```javascript
function ErrorRecovery() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const fetchData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError({
        message: err.message,
        canRetry: retryCount < 3
      });
    }
  };
  useEffect(() => {
    fetchData();
  }, [retryCount]);
  return (
    <div>
      {error ? (
        <div>
          <div>Error: {error.message}</div>
          {error.canRetry && (
            <button onClick={() => setRetryCount(c => c + 1)}>
              Retry ({retryCount}/3)
            </button>
          )}
        </div>
      ) : (
        <div>{JSON.stringify(data)}</div>
      )}
    </div>
  );
}
```
---


## Best Practices Summary


### ✅ DO
1. Always handle loading and error states
2. Use async/await for cleaner code
3. Cancel requests on unmount
4. Implement retry logic for network errors
5. Use proper error messages
6. Cache data when appropriate
7. Provide optimistic updates for better UX
8. Test all error scenarios


### ❌ DON'T
1. Don't set state on unmounted components
2. Don't forget to cleanup async operations
3. Don't ignore error states
4. Don't skip loading indicators
5. Don't create infinite loops
6. Don't forget to handle network errors
7. Don't expose API keys
---


## Interview Preparation


### Common Questions About Fetching Data


#### Q1: How do you handle errors in fetch?
**Answer**: Use try/catch blocks, check response.ok, and handle different error types (network, HTTP status, parse errors).


#### Q2: What's the difference between parallel and sequential fetching?
**Answer**: Parallel fetches multiple requests at once (Promise.all). Sequential waits for each to complete before starting next.


#### Q3: How do you prevent memory leaks with fetch?
**Answer**: Use AbortController or cancellation flags to cancel requests on unmount.


#### Q4: When should you cache data?
**Answer**: When data doesn't change often, is expensive to fetch, or needs to be available offline.


#### Q5: How do you implement optimistic updates?
**Answer**: Update UI immediately, then sync with server. Rollback if server update fails.
---


## Resources & Further Reading


### Official Documentation
- [Fetching Data](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- [useEffect Hook](https://react.dev/reference/react/useEffect)


### MDN References
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Async Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
---


## Key Takeaways


### ✅ What You Learned Today
1. **Fetch API**: Use for data fetching with async/await
2. **Loading States**: Show progress to users
3. **Error States**: Handle all error types gracefully
4. **Custom Hooks**: Reusable data fetching logic
5. **Optimistic Updates**: Better UX with instant feedback
6. **Caching**: Reduce network requests
7. **Retry Logic**: Handle network failures
8. **Pagination**: Load data in chunks


### 🎯 Key Concepts
- Always handle loading and error states
- Use async/await for cleaner code
- Cancel requests on unmount
- Create custom hooks for reuse
- Provide good UX with loading indicators
- Cache data when appropriate
- Implement retry logic
- Handle all error scenarios


### 📚 Next Steps
Congratulations on completing Day 10! Tomorrow you'll learn:
- React Developer Tools
- Debugging React applications
- Performance profiling
- Component inspection
---
**Great work! 🎉 You've mastered data fetching patterns!**
**You're now ready to learn debugging tools! 🚀**
---


## Data Fetching Patterns Summary


### Quick Reference
| Pattern | When to Use | Example |
|---------|-------------|---------|
| **Basic Fetch** | Simple data load | `fetch('/api/data')` |
| **Parallel Fetch** | Multiple independent APIs | `Promise.all([...])` |
| **Sequential Fetch** | Dependent APIs | Sequential await |
| **Retry Logic** | Network failures | Loop with retry |
| **Caching** | Expensive/static data | localStorage/cache |
| **Optimistic Update** | Better UX | Update UI, sync later |


### Loading State Template
```javascript
function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  return <DataDisplay data={data} />;
}
```


### Error Handling Template
```javascript
function ErrorHandlingExample() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const handleError = (err) => {
    if (err.name === 'AbortError') {
      setError('Request cancelled');
    } else if (err.name === 'TypeError') {
      setError('Network error');
    } else {
      setError(err.message);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/data', { signal: controller.signal })
      .then(r => r.json())
      .then(setData)
      .catch(handleError);
    return () => controller.abort();
  }, []);
  return <div>{error || JSON.stringify(data)}</div>;
}
```
---


## Complete Weather App Implementation
```javascript
function WeatherAppComplete() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const searchWeather = async (cityName) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const API_KEY = 'your_api_key';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      if (response.status === 404) {
        throw new Error('City not found');
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setWeather(data);
      setSearchHistory(prev => [...prev, cityName]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    searchWeather(city);
  };
  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && (
        <div className="error">
          {error}
          <button onClick={() => searchWeather(city)}>Retry</button>
        </div>
      )}
      {weather && (
        <div className="weather-display">
          <h2>{weather.name}</h2>
          <div className="temp">{weather.main.temp}°C</div>
          <div className="description">
            {weather.weather[0].description}
          </div>
          <div className="details">
            <div>Humidity: {weather.main.humidity}%</div>
            <div>Wind: {weather.wind.speed} m/s</div>
          </div>
        </div>
      )}
      {searchHistory.length > 0 && (
        <div className="history">
          <h3>Search History</h3>
          <ul>
            {searchHistory.map((city, i) => (
              <li key={i}>{city}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```
---


## Data Fetching Best Practices Checklist
- [ ] Handle loading state
- [ ] Handle error state  
- [ ] Handle empty state
- [ ] Cancel requests on unmount
- [ ] Implement retry logic
- [ ] Show user-friendly error messages
- [ ] Use proper HTTP methods
- [ ] Set appropriate headers
- [ ] Handle network errors
- [ ] Cache when appropriate
- [ ] Implement timeout
- [ ] Test all error scenarios
---
**Complete! You've mastered data fetching from basics to production patterns! 🎯**
---


## More Data Fetching Applications


### REST API Client
```javascript
function APIClient() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);
  // Fetch posts when user selected
  useEffect(() => {
    if (selectedUser) {
      fetchPosts(selectedUser.id);
    }
  }, [selectedUser]);
  const fetchUsers = async () => {
    setLoading(true);
    const data = await fetch('/api/users').then(r => r.json());
    setUsers(data);
    setLoading(false);
  };
  const fetchPosts = async (userId) => {
    setLoading(true);
    const data = await fetch(`/api/users/${userId}/posts`).then(r => r.json());
    setPosts(data);
    setLoading(false);
  };
  return (
    <div>
      <div>
        {users.map(user => (
          <button key={user.id} onClick={() => setSelectedUser(user)}>
            {user.name}
          </button>
        ))}
      </div>
      {selectedUser && (
        <div>
          <h2>{selectedUser.name}'s Posts</h2>
          {loading ? <div>Loading...</div> : (
            <ul>
              {posts.map(post => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
```


### Image Gallery with Lazy Loading
```javascript
function ImageGallery({ images }) {
  const [loadedImages, setLoadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const loadImage = async (src) => {
      const img = new Image();
      img.src = src;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      return img.src;
    };
    const loadNextBatch = async () => {
      const batch = images.slice(loadedImages.length, loadedImages.length + 3);
      for (const src of batch) {
        try {
          await loadImage(src);
          setLoadedImages(prev => [...prev, src]);
        } catch (err) {
          console.error('Failed to load:', src);
        }
      }
    };
    loadNextBatch();
  }, [loadedImages.length, images]);
  return (
    <div>
      <img src={loadedImages[currentIndex]} alt={`Image ${currentIndex}`} />
      <div>
        {loadedImages.map((src, i) => (
          <img
            key={i}
            src={src}
            onClick={() => setCurrentIndex(i)}
            style={{ width: '100px' }}
          />
        ))}
      </div>
    </div>
  );
}
```


### Real-time Stock Prices
```javascript
function StockPrices() {
  const [prices, setPrices] = useState({});
  const [symbols, setSymbols] = useState(['AAPL', 'GOOGL', 'MSFT']);
  useEffect(() => {
    const fetchPrices = async () => {
      const promises = symbols.map(async (symbol) => {
        const response = await fetch(`/api/stocks/${symbol}`);
        const data = await response.json();
        return { symbol, price: data.price };
      });
      const results = await Promise.all(promises);
      const priceMap = {};
      results.forEach(({ symbol, price }) => {
        priceMap[symbol] = price;
      });
      setPrices(priceMap);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, [symbols]);
  return (
    <div>
      {symbols.map(symbol => (
        <div key={symbol}>
          {symbol}: ${prices[symbol]?.toFixed(2) || 'Loading...'}
        </div>
      ))}
    </div>
  );
}
```


### Multi-step Form with Validation
```javascript
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const validateStep = async (stepData) => {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stepData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      setErrors(errorData);
      return false;
    }
    return true;
  };
  const handleNext = async () => {
    const isValid = await validateStep(formData);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div>
      <div>Step {step} of 3</div>
      {step === 1 && <Step1 formData={formData} onChange={setFormData} />}
      {step === 2 && <Step2 formData={formData} onChange={setFormData} />}
      {step === 3 && <Step3 formData={formData} onChange={setFormData} />}
      <div>
        {step > 1 && <button onClick={() => setStep(prev => prev - 1)}>Back</button>}
        {step < 3 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
}
```
---


## Advanced Error Handling


### Retry with Exponential Backoff
```javascript
function useFetchWithRetry(url, options = {}) {
  const { maxRetries = 3, delay = 1000 } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let retryCount = 0;
    let cancelled = false;
    const fetchWithRetry = async () => {
      while (retryCount <= maxRetries && !cancelled) {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const json = await response.json();
          if (!cancelled) {
            setData(json);
            setLoading(false);
          }
          return;
        } catch (err) {
          retryCount++;
          if (retryCount > maxRetries) {
            if (!cancelled) {
              setError(err.message);
              setLoading(false);
            }
            return;
          }
          // Exponential backoff: 1s, 2s, 4s
          const backoff = delay * Math.pow(2, retryCount - 1);
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    };
    fetchWithRetry();
    return () => {
      cancelled = true;
    };
  }, [url, maxRetries, delay]);
  return { data, loading, error };
}
```


### Error Boundary with Fallback
```javascript
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error);
      event.preventDefault();
    };
    window.addEventListener('error', handleError);
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  if (hasError) {
    return (
      <div className="error-boundary">
        <h2>Something went wrong</h2>
        <p>{error?.message}</p>
        <button onClick={() => {
          setHasError(false);
          setError(null);
        }}>
          Try Again
        </button>
      </div>
    );
  }
  return children;
}
```
---


## Data Fetching with FormData
```javascript
function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        }
      });
      const data = await response.json();
      setUploadedUrl(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading || !file}>
        Upload
      </button>
      {uploading && (
        <div>
          <div>Progress: {progress.toFixed(1)}%</div>
          <progress value={progress} max={100} />
        </div>
      )}
      {uploadedUrl && (
        <div>
          <a href={uploadedUrl} target="_blank">View uploaded file</a>
        </div>
      )}
    </div>
  );
}
```
---


## Complete State Management for Fetching
```javascript
function useAsyncDataFetcher(fetcher, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetcher();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: err.message
          }));
        }
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, dependencies);
  const retry = () => {
    fetchData();
  };
  return { ...state, retry };
}
// Usage
function UserList() {
  const { data, loading, error, retry } = useAsyncDataFetcher(
    () => fetch('/api/users').then(r => r.json()),
    []
  );
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error} <button onClick={retry}>Retry</button></div>;
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```
---


## More Complete Examples


### E-commerce Product Fetcher
```javascript
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```
---


## Summary Cheat Sheet


### All Fetch Patterns at a Glance
```javascript
// 1. Basic
fetch(url).then(r => r.json()).then(setData);
// 2. With error handling
fetch(url).then(r => r.json()).then(setData).catch(setError);
// 3. Async/await
const data = await fetch(url).then(r => r.json());
// 4. With cleanup
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);
// 5. Parallel
Promise.all([fetch(url1), fetch(url2)]).then(...);
// 6. Sequential
const a = await fetch(url1);
const b = await fetch(url2, { body: JSON.stringify(a) });
// 7. With retry
for (let i = 0; i < 3; i++) {
  try {
    const data = await fetch(url);
    break; // Success
  } catch (err) {
    await delay(1000 * i);
  }
}
```


### Loading State Template
```javascript
if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;
return <DataDisplay data={data} />;
```
---
**Complete! You've mastered data fetching from basics to production patterns! 🎯**
