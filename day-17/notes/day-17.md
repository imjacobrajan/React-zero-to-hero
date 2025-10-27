# Day 17: Custom Hooks - Part 2 - Advanced Hook Patterns
## Introduction
Welcome to Day 17! Today you'll master **advanced custom hook patterns** including data fetching, debouncing, window size tracking, and building production-ready hooks. By the end of today, you'll:
- ✅ Build a complete useFetch hook with error handling
- ✅ Implement useDebounce for performance
- ✅ Create useWindowSize for responsive UIs
- ✅ Build 3+ production-ready custom hooks
- ✅ Handle edge cases and errors
- ✅ Optimize hook performance
- ✅ Test custom hooks effectively
- ✅ Apply best practices
---


## useFetch Custom Hook


### Basic useFetch Implementation
```javascript
import { useState, useEffect } from 'react';
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [url]);
  return { data, loading, error };
}
// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
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


### Advanced useFetch with Abort Controller
```javascript
function useFetch(url, options = {}) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  useEffect(() => {
    const abortController = new AbortController();
    async function fetchData() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error: error.message });
        }
      }
    }
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [url]);
  return state;
}
```


### useFetch with Request Options
```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const execute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    execute();
  }, [url]);
  return { data, loading, error, refetch: execute };
}
// Usage with manual refetch
function DataDisplay({ url }) {
  const { data, loading, error, refetch } = useFetch(url);
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```
---


## useDebounce Implementation


### Basic Debounce Hook
```javascript
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
// Usage
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```


### Advanced useDebounce with Callback
```javascript
function useDebounce(callback, delay) {
  const latestCallback = useRef();
  const latestTimeout = useRef();
  useEffect(() => {
    latestCallback.current = callback;
  }, [callback]);
  const debouncedCallback = useCallback((...args) => {
    if (latestTimeout.current) {
      clearTimeout(latestTimeout.current);
    }
    latestTimeout.current = setTimeout(() => {
      latestCallback.current(...args);
    }, delay);
  }, [delay]);
  useEffect(() => {
    return () => {
      if (latestTimeout.current) {
        clearTimeout(latestTimeout.current);
      }
    };
  }, []);
  return debouncedCallback;
}
// Usage
function SearchComponent() {
  const [results, setResults] = useState([]);
  const searchAPI = async (query) => {
    const response = await fetch(`/api/search?q=${query}`);
    const data = await response.json();
    setResults(data);
  };
  const debouncedSearch = useDebounce(searchAPI, 500);
  const handleChange = (e) => {
    debouncedSearch(e.target.value);
  };
  return (
    <div>
      <input onChange={handleChange} placeholder="Search..." />
      <ul>
        {results.map(item => <li key={item.id}>{item.name}</li>)}
      </ul>
    </div>
  );
}
```


### useDebounceValue Hook
```javascript
function useDebounceValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
// Usage for API calls
function SearchResults({ query }) {
  const debouncedQuery = useDebounceValue(query, 300);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    const search = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${debouncedQuery}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [debouncedQuery]);
  return (
    <div>
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```
---


## useWindowSize Hook


### Basic Window Size Tracking
```javascript
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // Call immediately to get initial size
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}
// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  if (!width) return null;
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```


### Advanced useWindowSize with Breakpoints
```javascript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return {
    ...size,
    isMobile: size.width < 768,
    isTablet: size.width >= 768 && size.width < 1024,
    isDesktop: size.width >= 1024,
    isSmall: size.width < 576,
    isMedium: size.width >= 576 && size.width < 768,
    isLarge: size.width >= 768
  };
}
// Usage
function ResponsiveApp() {
  const { isMobile, isDesktop, width } = useWindowSize();
  return (
    <div>
      {isMobile && <MobileLayout />}
      {isDesktop && <DesktopLayout />}
      <div>Current width: {width}px</div>
    </div>
  );
}
```


### useWindowSize with Media Query Support
```javascript
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
}
function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmall: isMobile,
    isMedium: isTablet,
    isLarge: isDesktop
  };
}
// Usage
function Component() {
  const { isMobile, isDesktop } = useResponsive();
  return (
    <div>
      {isMobile ? 'Mobile View' : isDesktop ? 'Desktop View' : 'Tablet View'}
    </div>
  );
}
```
---


## Advanced Hook Patterns


### Pattern 1: useFetch with Cache
```javascript
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  useEffect(() => {
    // Check cache first
    if (cacheRef.current.has(url)) {
      setData(cacheRef.current.get(url));
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        cacheRef.current.set(url, data);
        setData(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
}
```


### Pattern 2: useFetch with Retry
```javascript
function useFetchWithRetry(url, maxRetries = 3) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const fetchData = async (attempt = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      setLoading(false);
      setRetryCount(0);
    } catch (err) {
      if (attempt < maxRetries) {
        setRetryCount(attempt);
        setTimeout(() => fetchData(attempt + 1), 1000 * attempt);
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);
  const retry = () => fetchData();
  return { data, loading, error, retry, retryCount };
}
// Usage
function DataComponent({ url }) {
  const { data, loading, error, retry, retryCount } = useFetchWithRetry(url);
  return (
    <div>
      {loading && <div>Loading... (attempt {retryCount + 1})</div>}
      {error && (
        <div>
          <div>Error: {error}</div>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```


### Pattern 3: useThrottle Hook
```javascript
function useThrottle(value, limit) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRun = useRef(Date.now());
  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= limit) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, limit - (Date.now() - lastRun.current));
    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);
  return throttledValue;
}
// Usage
function ScrollComponent() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const throttledScroll = useThrottle(scrollY, 200);
  return <div>Scroll position: {throttledScroll}</div>;
}
```
---


## Real-World Custom Hooks


### 1. useFetch with Auto-refresh
```javascript
function useFetch(url, options = {}) {
  const { refreshInterval = null, immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    if (immediate) fetchData();
  }, [immediate, fetchData]);
  useEffect(() => {
    if (!refreshInterval) return;
    const timer = setInterval(fetchData, refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval, fetchData]);
  return { data, loading, error, refetch: fetchData };
}
// Usage
function LiveDataDisplay({ url }) {
  const { data, loading } = useFetch(url, { refreshInterval: 5000 });
  return (
    <div>
      {loading && <div>Loading...</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}
```


### 2. useOnlineStatus Hook
```javascript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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
  return isOnline;
}
// Usage
function OnlineIndicator() {
  const isOnline = useOnlineStatus();
  return (
    <div className={isOnline ? 'online' : 'offline'}>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </div>
  );
}
```
---


## More Complete Hook Examples


### Complete useFetch with All Features
```javascript
function useFetch(url, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    cache = true,
    refreshInterval = null,
    retries = 0
  } = options;
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  const cacheKey = JSON.stringify({ url, method, body });
  const cacheRef = useRef(new Map());
  const fetchData = useCallback(async (attempt = 0) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      // Check cache
      if (cache && cacheRef.current.has(cacheKey) && attempt === 0) {
        const cached = cacheRef.current.get(cacheKey);
        setState({ data: cached, loading: false, error: null });
        return;
      }
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (cache) {
        cacheRef.current.set(cacheKey, data);
      }
      setState({ data, loading: false, error: null });
    } catch (error) {
      if (attempt < retries) {
        setTimeout(() => fetchData(attempt + 1), 1000 * (attempt + 1));
      } else {
        setState({ data: null, loading: false, error: error.message });
      }
    }
  }, [url, method, body, cache, cacheKey, retries]);
  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval) return;
    const timer = setInterval(() => fetchData(), refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval, fetchData]);
  return {
    ...state,
    refetch: () => fetchData()
  };
}
```
---


## Best Practices


### ✅ DO
1. **Use useCallback for functions**
2. **Memoize with useMemo**
3. **Handle cleanup**
4. **Return consistent values**
5. **Document edge cases**
6. **Test thoroughly**
7. **Name descriptively**
8. **Handle errors**


### ❌ DON'T
1. **Don't call hooks conditionally**
2. **Don't forget dependencies**
3. **Don't cause infinite loops**
4. **Don't mutate state directly**
5. **Don't over-complicate**
---


## Interview Preparation


### Common Questions


#### Q1: How would you implement useFetch?
**Answer**: Create a hook that manages loading, data, and error states, uses fetch API, handles cleanup with AbortController, and optionally supports caching and retry logic.


#### Q2: What's the difference between debounce and throttle?
**Answer**: Debounce delays execution until after inactivity. Throttle limits execution frequency. Debounce waits for quiet periods; throttle executes at regular intervals.


#### Q3: How do you handle SSR with useWindowSize?
**Answer**: Check if window is undefined, initialize with default values, and only set actual values after mount on the client side.
---


## Practice Exercise


### Requirements:
- ✅ Create useFetch custom hook
- ✅ Implement useDebounce
- ✅ Build useWindowSize hook
- ✅ Handle all edge cases
- ✅ Add error handling
- ✅ Test thoroughly


### Solution:
See practice file: `day-17/practice/custom-hooks.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **useFetch**: Complete data fetching hook
2. **useDebounce**: Delayed execution patterns
3. **useWindowSize**: Responsive UI tracking
4. **Advanced Patterns**: Cache, retry, throttle
5. **Best Practices**: Production-ready hooks


### 🎯 Key Concepts
- Debounce for search and input
- Throttle for scroll and resize
- useFetch for data fetching
- useWindowSize for responsive design
- Handle all edge cases
- Test custom hooks
- Follow hook conventions


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Component composition patterns
- ✅ Container/Presentational pattern
- ✅ Children prop usage
- ✅ Refactoring components
---
**Great work! 🎉 You've mastered advanced custom hooks!**
**You're now ready to learn Component Composition! 🚀**
---


## Summary Cheat Sheet


### Custom Hooks Quick Reference
```javascript
// useFetch
const { data, loading, error } = useFetch(url, { method: 'POST', body: {...} });
// useDebounce
const debounced = useDebounce(value, 500);
// useWindowSize
const { width, height, isMobile } = useWindowSize();
// useOnlineStatus
const isOnline = useOnlineStatus();
```
---
---


## More Complete Hook Implementations


### 1. usePrevious Hook (Complete)
```javascript
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
// Usage with comparison
function useWasChanged(value) {
  const prevValue = usePrevious(value);
  return value !== prevValue;
}
```


### 2. useIsFirstRender Hook
```javascript
function useIsFirstRender() {
  const isFirst = useRef(true);
  useEffect(() => {
    isFirst.current = false;
  });
  return isFirst.current;
}
// Usage
function Component() {
  const isFirst = useIsFirstRender();
  useEffect(() => {
    if (isFirst) {
      console.log('First render');
    }
  }, [isFirst]);
  return <div>Component</div>;
}
```


### 3. useDidMount Hook
```javascript
function useDidMount(callback) {
  useEffect(() => {
    callback();
  }, []);
}
// Usage
function Component() {
  useDidMount(() => {
    console.log('Component mounted');
  });
  return <div>Hello</div>;
}
```


### 4. useWillUnmount Hook
```javascript
function useWillUnmount(callback) {
  useEffect(() => {
    return () => {
      callback();
    };
  }, [callback]);
}
// Usage
function Component() {
  useWillUnmount(() => {
    console.log('Component unmounting');
  });
  return <div>Goodbye</div>;
}
```
---


## Advanced Debouncing Patterns


### Debounce with Cancel
```javascript
function useDebounceWithCancel(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);
  useEffect(() => {
    cancel();
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return cancel;
  }, [value, delay, cancel]);
  return { value: debouncedValue, cancel };
}
```


### useDebouncedCallback
```javascript
function useDebouncedCallback(callback, delay) {
  const timeoutRef = useRef();
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  return debouncedCallback;
}
// Usage
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedSearch = useDebouncedCallback(async (q) => {
    const response = await fetch(`/api/search?q=${q}`);
    const data = await response.json();
    setResults(data);
  }, 500);
  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```
---


## Complete Window Size Hook Collection


### useScrollPosition Hook
```javascript
function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset
      });
    };
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  return scrollPosition;
}
// Usage
function ScrollToTop() {
  const { y } = useScrollPosition();
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(y > 300);
  }, [y]);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  if (!show) return null;
  return (
    <button onClick={scrollToTop} style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
      ↑ Top
    </button>
  );
}
```


### useElementSize Hook
```javascript
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const updateSize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return [ref, size];
}
// Usage
function ResizableComponent() {
  const [ref, size] = useElementSize();
  return (
    <div ref={ref}>
      <p>Width: {size.width}px</p>
      <p>Height: {size.height}px</p>
    </div>
  );
}
```
---


## Complete useFetch with All Features


### Production-Ready useFetch
```javascript
function useFetch(url, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    cache = 'default',
    refreshInterval = null,
    retries = 0,
    retryDelay = 1000,
    timeout = null
  } = options;
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
    status: null
  });
  const controllerRef = useRef(null);
  const timeoutRef = useRef(null);
  const cacheRef = useRef(new Map());
  const retryCountRef = useRef(0);
  const execute = useCallback(async (attempt = 0) => {
    try {
      // Cancel previous request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      setState(prev => ({ ...prev, loading: true, error: null }));
      // Check cache
      const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;
      if (cacheRef.current.has(cacheKey) && cache === 'default') {
        const cached = cacheRef.current.get(cacheKey);
        setState({ data: cached, loading: false, error: null, status: 200 });
        return;
      }
      // Setup timeout
      if (timeout) {
        timeoutRef.current = setTimeout(() => {
          controllerRef.current.abort();
          throw new Error('Request timeout');
        }, timeout);
      }
      // Fetch
      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        signal: controllerRef.current.signal
      });
      clearTimeout(timeoutRef.current);
      setState(prev => ({ ...prev, status: response.status }));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      // Cache
      if (cache !== 'no-store') {
        cacheRef.current.set(cacheKey, data);
      }
      setState({ data, loading: false, error: null, status: response.status });
      retryCountRef.current = 0;
    } catch (error) {
      clearTimeout(timeoutRef.current);
      if (attempt < retries && error.name !== 'AbortError') {
        retryCountRef.current = attempt + 1;
        setTimeout(() => execute(attempt + 1), retryDelay * (attempt + 1));
      } else {
        setState({ 
          data: null, 
          loading: false, 
          error: error.message, 
          status: null 
        });
        retryCountRef.current = 0;
      }
    }
  }, [url, method, body, headers, cache, retries, retryDelay, timeout]);
  // Initial fetch
  useEffect(() => {
    execute();
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      clearTimeout(timeoutRef.current);
    };
  }, [execute]);
  // Auto-refresh
  useEffect(() => {
    if (!refreshInterval) return;
    const timer = setInterval(() => execute(), refreshInterval);
    return () => clearInterval(timer);
  }, [refreshInterval, execute]);
  return {
    ...state,
    refetch: () => execute(),
    retryCount: retryCountRef.current
  };
}
```
---


## Combined Hooks Example


### useDataFetching with Debounce and Window Size
```javascript
function useSmartSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { isOnline } = useOnlineStatus();
  const { data, loading, error } = useFetch(
    isOnline ? `/api/search?q=${debouncedQuery}` : null,
    { enabled: !!debouncedQuery && isOnline }
  );
  const fetchData = async () => {
    if (query) {
      // Trigger fetch
    }
  };
  return {
    query,
    setQuery,
    results: data,
    loading,
    error,
    isOnline
  };
}
// Usage
function SearchApp() {
  const { query, setQuery, results, loading, isOnline } = useSmartSearch();
  return (
    <div>
      {!isOnline && <div>🔴 Offline mode</div>}
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <div>Searching...</div>}
      <ul>
        {results?.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
}
```
---


## Testing Custom Hooks


### Complete Testing Example
```javascript
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';
global.fetch = jest.fn();
describe('useFetch', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it('should fetch data successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, name: 'John' })
    });
    const { result } = renderHook(() => useFetch('/api/users/1'));
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toEqual({ id: 1, name: 'John' });
    expect(result.current.error).toBe(null);
  });
  it('should handle errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    const { result } = renderHook(() => useFetch('/api/users/1'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe('Failed to fetch');
  });
});
```
---


## Performance Optimization for Hooks


### Memoizing Expensive Computations
```javascript
function useProcessedData(rawData) {
  return useMemo(() => {
    if (!rawData) return null;
    // Expensive processing
    return rawData.map(item => ({
      ...item,
      processed: expensiveTransform(item)
    }));
  }, [rawData]);
}
function useFilteredData(data, filterFn) {
  return useMemo(() => {
    return data.filter(filterFn);
  }, [data, filterFn]);
}
```
---


## Additional Production-Ready Hooks


### useClickOutside Hook
```javascript
function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
// Usage
function Dropdown({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```


### useLocalStorage Hook
```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
}
// Usage
function Component() {
  const [name, setName] = useLocalStorage('name', '');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```


### useToggle Hook
```javascript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}
// Usage
function ToggleComponent() {
  const { value, toggle } = useToggle();
  return (
    <div>
      <button onClick={toggle}>{value ? 'ON' : 'OFF'}</button>
    </div>
  );
}
```


### useCopyToClipboard Hook
```javascript
function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState(null);
  const copy = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  };
  return [copiedText, copy];
}
// Usage
function CopyButton({ text }) {
  const [copied, copy] = useCopyToClipboard();
  return (
    <button onClick={() => copy(text)}>
      {copied === text ? '✓ Copied!' : 'Copy'}
    </button>
  );
}
```


### useHover Hook
```javascript
function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return [ref, isHovered];
}
// Usage
function HoverableDiv() {
  const [ref, isHovered] = useHover();
  return (
    <div ref={ref} style={{ opacity: isHovered ? 0.8 : 1 }}>
      Hover me
    </div>
  );
}
```


### useIntersectionObserver Hook
```javascript
function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [options]);
  return [ref, entry];
}
// Usage
function LazyLoadComponent() {
  const [ref, entry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });
  const isVisible = entry?.isIntersecting;
  return (
    <div ref={ref}>
      {isVisible ? 'Content loaded' : 'Loading...'}
    </div>
  );
}
```


### useAsync Hook
```javascript
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction(...args);
      setValue(response);
      setStatus('success');
    } catch (err) {
      setError(err);
      setStatus('error');
    }
  }, [asyncFunction]);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);
  return { execute, status, value, error };
}
// Usage
function DataComponent() {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    return response.json();
  };
  const { status, value, error, execute } = useAsync(fetchData);
  if (status === 'idle') return null;
  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error}</div>;
  if (status === 'success') return <div>{value?.title}</div>;
}
```


### useCounter Hook
```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback(value => setCount(value), []);
  return { count, increment, decrement, reset, setValue };
}
// Usage
function Counter() {
  const { count, increment, decrement } = useCounter(0);
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
```


### useTimeout Hook
```javascript
function useTimeout(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const timer = setTimeout(() => {
        savedCallback.current();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);
}
// Usage
function DelayedAlert() {
  const [showAlert, setShowAlert] = useState(false);
  useTimeout(() => {
    setShowAlert(true);
  }, 5000);
  return showAlert ? <div>5 seconds passed!</div> : null;
}
```


### useInterval Hook
```javascript
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
// Usage
function Timer() {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, 1000);
  return <div>{count}</div>;
}
```


### useKeyPress Hook
```javascript
function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);
  return keyPressed;
}
// Usage
function EscapeHandler() {
  const isEscapePressed = useKeyPress('Escape');
  useEffect(() => {
    if (isEscapePressed) {
      console.log('Escape pressed!');
    }
  }, [isEscapePressed]);
  return <div>Press Escape</div>;
}
```


### useDarkMode Hook
```javascript
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);
  const toggle = useCallback(() => setIsDarkMode(prev => !prev), []);
  return { isDarkMode, toggle };
}
// Usage
function DarkModeToggle() {
  const { isDarkMode, toggle } = useDarkMode();
  return (
    <button onClick={toggle}>
      {isDarkMode ? '🌙' : '☀️'}
    </button>
  );
}
```
---


## Real-World Hook Combinations


### useForm Hook
```javascript
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate?.[name]?.(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [touched, validate]);
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate?.[name]?.(values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [values, validate]);
  const handleSubmit = useCallback((onSubmit) => {
    const formErrors = {};
    Object.keys(validate || {}).forEach(name => {
      const error = validate[name](values[name]);
      if (error) {
        formErrors[name] = error;
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      onSubmit(values);
    }
  }, [values, validate]);
  return { values, errors, touched, setValue, handleBlur, handleSubmit };
}
// Usage
function LoginForm() {
  const validate = {
    email: (value) => {
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
      return null;
    },
    password: (value) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return null;
    }
  };
  const { values, errors, setValue, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    validate
  );
  const onSubmit = (values) => {
    console.log('Submitted:', values);
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}>
      <input
        value={values.email}
        onChange={e => setValue('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email}</span>}
      <input
        type="password"
        value={values.password}
        onChange={e => setValue('password', e.target.value)}
        onBlur={() => handleBlur('password')}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```


### usePagination Hook
```javascript
function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  }, [items, currentPage, itemsPerPage]);
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}
// Usage
function PaginatedList({ items }) {
  const {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    hasNext,
    hasPrev
  } = usePagination(items, 10);
  return (
    <div>
      <ul>
        {paginatedItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <div>
        <button onClick={prevPage} disabled={!hasPrev}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={!hasNext}>Next</button>
      </div>
    </div>
  );
}
```
---


## Common Pitfalls and Solutions


### Pitfall 1: Infinite Loops
**Problem:**
```javascript
function useBadFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData);
  }, [data]); // ❌ Wrong dependency
  return data;
}
```
**Solution:**
```javascript
function useGoodFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData);
  }, [url]); // ✅ Correct dependency
  return data;
}
```


### Pitfall 2: Stale Closures
**Problem:**
```javascript
function useBadCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count + 1); // ❌ Uses stale count
    }, 1000);
    return () => clearInterval(interval);
  }, []); // Missing count in deps
}
```
**Solution:**
```javascript
function useGoodCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1); // ✅ Uses functional update
    }, 1000);
    return () => clearInterval(interval);
  }, []);
}
```
---


## Interview Questions with Answers


### Q1: Implement a custom useFetch hook with retry logic
**Answer:**
```javascript
function useFetchWithRetry(url, retries = 3) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    let attempt = 0;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        attempt++;
        if (attempt <= retries) {
          setTimeout(fetchData, 1000 * attempt);
        } else if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [url, retries]);
  return { data, loading, error };
}
```


### Q2: Difference between useDebounce and useThrottle?
**Answer:**
- **debounce**: Waits until the user stops performing actions, then executes once
- **throttle**: Executes at regular intervals while the action is happening
Debounce is good for search inputs, throttle for scroll events.
---
**Complete! You've mastered Custom Hooks Part 2 from basics to advanced patterns! 🎯**
