# Day 20: Render Props Pattern - Maximizing Component Flexibility
## Introduction
Welcome to Day 20! Today you'll master the **Render Props Pattern** - a powerful pattern for sharing code and increasing component flexibility. By the end of today, you'll understand:
- ✅ What render props are
- ✅ Function as children pattern
- ✅ Sharing logic between components
- ✅ Maximum rendering flexibility
- ✅ Real-world applications
- ✅ Advanced patterns and techniques
---


## What are Render Props?


### Definition
**Render props** is a pattern where a component receives a **function as a prop** (often called `render`) that it calls to render content. This pattern allows sharing code between components.


### Key Characteristics
1. **Function prop** for rendering
2. **Shared logic** in parent
3. **Flexible rendering** by consumer
4. **Separation** of logic and presentation
5. **Reusability** across different UIs


### Basic Example
```javascript
// Component with render prop
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return render(position);
}
// Usage
function App() {
  return (
    <Mouse
      render={({ x, y }) => (
        <div>
          Mouse is at {x}, {y}
        </div>
      )}
    />
  );
}
```
---


## Basic Render Props


### Example 1: Data Fetching
```javascript
function DataFetcher({ url, render }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);
  return render({ data, loading, error });
}
// Usage
function App() {
  return (
    <DataFetcher
      url="/api/users"
      render={({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!data) return null;
        return (
          <ul>
            {data.map(user => <li key={user.id}>{user.name}</li>)}
          </ul>
        );
      }}
    />
  );
}
```


### Example 2: Toggle Logic
```javascript
function Toggle({ render }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  return render({ on, toggle });
}
// Usage
function App() {
  return (
    <Toggle
      render={({ on, toggle }) => (
        <div>
          <button onClick={toggle}>
            {on ? 'ON' : 'OFF'}
          </button>
          {on && <div>The button is on!</div>}
        </div>
      )}
    />
  );
}
```


### Example 3: Local Storage
```javascript
function LocalStorage({ key, render }) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  });
  const updateValue = (newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Failed to update localStorage:', error);
    }
  };
  return render({ value, setValue: updateValue });
}
// Usage
function App() {
  return (
    <LocalStorage
      key="theme"
      render={({ value: theme, setValue: setTheme }) => (
        <div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Current theme: {theme || 'light'}
          </button>
        </div>
      )}
    />
  );
}
```
---


## Function as Children


### Pattern Overview
Instead of using a `render` prop, you can use **children as a function**:
```javascript
// Using children as function
function Mouse({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return children(position);
}
// Usage - cleaner syntax
function App() {
  return (
    <Mouse>
      {({ x, y }) => (
        <div>
          Mouse is at {x}, {y}
        </div>
      )}
    </Mouse>
  );
}
```


### Data Fetching with Children
```javascript
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  return children({ data, loading, error });
}
// Usage
function App() {
  return (
    <DataFetcher url="/api/users">
      {({ data, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>Error: {error}</div>;
        return <UserList users={data} />;
      }}
    </DataFetcher>
  );
}
```
---


## Advanced Render Props


### Advanced Example: Mouse Tracker
```javascript
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseEnter = () => setIsInside(true);
    const handleMouseLeave = () => setIsInside(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return children({
    position,
    isInside,
    distance: Math.sqrt(position.x ** 2 + position.y ** 2)
  });
}
// Usage
function App() {
  return (
    <MouseTracker>
      {({ position, isInside, distance }) => (
        <div>
          <p>Position: ({position.x}, {position.y})</p>
          <p>Inside: {isInside ? 'Yes' : 'No'}</p>
          <p>Distance from origin: {distance.toFixed(2)}</p>
        </div>
      )}
    </MouseTracker>
  );
}
```


### Advanced Example: Form Management
```javascript
function Form({ initialValues, onSubmit, children }) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };
  const setFieldTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };
  return children({
    values,
    setValue,
    errors,
    setError,
    touched,
    setFieldTouched,
    handleSubmit
  });
}
// Usage
function LoginForm() {
  const handleSubmit = (values) => {
    console.log('Submitted:', values);
  };
  return (
    <Form initialValues={{ email: '', password: '' }} onSubmit={handleSubmit}>
      {({ values, setValue, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={values.email}
            onChange={e => setValue('email', e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={values.password}
            onChange={e => setValue('password', e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      )}
    </Form>
  );
}
```
---


## Real-World Examples


### Example 1: Scroll Tracker
```javascript
function ScrollTracker({ children }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [direction, setDirection] = useState('down');
  const prevPosition = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      setScrollPosition(currentPosition);
      setDirection(currentPosition > prevPosition.current ? 'down' : 'up');
      prevPosition.current = currentPosition;
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return children({
    scrollPosition,
    direction,
    isAtTop: scrollPosition === 0,
    isScrolling: direction !== null
  });
}
// Usage
function App() {
  return (
    <ScrollTracker>
      {({ scrollPosition, direction }) => (
        <div className={`header ${direction === 'up' ? 'show' : 'hide'}`}>
          Scrolled: {scrollPosition}px ({direction})
        </div>
      )}
    </ScrollTracker>
  );
}
```


### Example 2: Online Status Tracker
```javascript
function OnlineStatus({ children }) {
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
  return children({
    isOnline,
    isOffline: !isOnline
  });
}
// Usage
function App() {
  return (
    <OnlineStatus>
      {({ isOnline, isOffline }) => (
        <div className={`status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
        </div>
      )}
    </OnlineStatus>
  );
}
```


### Example 3: Window Size Tracker
```javascript
function WindowSize({ children }) {
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return children({
    width: size.width,
    height: size.height,
    isMobile: size.width < 768,
    isTablet: size.width >= 768 && size.width < 1024,
    isDesktop: size.width >= 1024
  });
}
// Usage
function App() {
  return (
    <WindowSize>
      {({ width, height, isMobile, isDesktop }) => (
        <div>
          {isMobile ? <MobileLayout /> : null}
          {isDesktop ? <DesktopLayout /> : null}
          <p>Size: {width}x{height}</p>
        </div>
      )}
    </WindowSize>
  );
}
```
---


## Render Props vs Hooks


### Comparison
```javascript
// Using Render Props
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return children(position);
}
// Using Custom Hook
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return position;
}
// Usage: Render Props
<MouseTracker>
  {position => <div>Mouse at {position.x}, {position.y}</div>}
</MouseTracker>
// Usage: Hook
function App() {
  const position = useMouse();
  return <div>Mouse at {position.x}, {position.y}</div>;
}
```


### When to Use Each
- **Render Props**: When you need flexible rendering or multiple render outputs
- **Hooks**: When you need to share logic between components (preferred)
- **Both**: Can work together for maximum flexibility
---


## Best Practices


### ✅ DO
1. **Use descriptive names** for render functions
2. **Destructure complex values** in the render function
3. **Provide default implementations** when possible
4. **Memoize render functions** to prevent unnecessary re-renders
5. **Document expected structure** of render function parameters
6. **Handle edge cases** gracefully


### ❌ DON'T
1. **Don't create render functions inside render**
2. **Don't ignore React warnings** about render props
3. **Don't over-nest** render props
4. **Don't forget to handle loading/error states**
5. **Don't create unnecessary re-renders**
---


## Common Pitfalls


### Pitfall 1: Creating Functions in Render
```javascript
// ❌ Creates new function on every render
function App() {
  return (
    <MouseTracker>
      {position => (
        <Component
          onClick={() => handleClick(position)} // New function every render
        />
      )}
    </MouseTracker>
  );
}
// ✅ Extract function outside render
function App() {
  const handleMouseClick = useCallback((position) => {
    console.log('Clicked at', position);
  }, []);
  return (
    <MouseTracker>
      {position => (
        <Component onClick={() => handleMouseClick(position)} />
      )}
    </MouseTracker>
  );
}
```


### Pitfall 2: Not Handling Loading States
```javascript
// ❌ No loading state
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return children(data); // data might be null
}
// ✅ Handle all states
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);
  return children({ data, loading, error });
}
```
---


## Interview Preparation


### Common Questions


#### Q1: What are render props?
**Answer**: Render props is a pattern where a component receives a function as a prop and calls it to render content, allowing code sharing between components.


#### Q2: When would you use render props?
**Answer**: Use render props when you need flexible rendering, want to share logic between components, or when you need maximum customization of the render output.


#### Q3: Difference between render props and custom hooks?
**Answer**: Render props provide logic through a function prop, while hooks are functions that return values and can be called directly in components. Hooks are generally preferred for simple logic reuse.
---


## Practice Exercise


### Requirements:
- ✅ Create a MouseTracker component with render props
- ✅ Track position, velocity, and direction
- ✅ Provide multiple render outputs
- ✅ Handle edge cases


### Solution:
See practice file: `day-20/practice/mouse-tracker.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **Render Props**: Sharing code through function props
2. **Function as Children**: Using children as function
3. **Flexibility**: Maximum control over rendering
4. **Separation of Concerns**: Logic vs presentation
5. **Real Applications**: Mouse tracking, data fetching, form management


### 🎯 Key Concepts
- Function prop for rendering
- Shared logic in provider
- Consumer controls rendering
- Alternative to hooks
- Maximum flexibility


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Higher-Order Components (HOCs)
- ✅ HOC concepts and use cases
- ✅ Enhancing components with HOCs
- ✅ HOC patterns and best practices
---
**Great work! 🎉 You've mastered Render Props!**
**You're now ready to learn Higher-Order Components! 🚀**
---


## Summary Cheat Sheet


### Render Props Quick Reference
```javascript
// Basic pattern
function Component({ render }) {
  // Logic here
  return render({ /* values */ });
}
// Usage
<Component render={({ value }) => <div>{value}</div>} />
// Children as function
function Component({ children }) {
  // Logic here
  return children({ /* values */ });
}
// Usage
<Component>
  {({ value }) => <div>{value}</div>}
</Component>
```
---


## Advanced Render Props Patterns


### Pattern 1: Multiple Render Prop Patterns
```javascript
function Resource({ url, loading, error, data }) {
  const [resource, setResource] = useState({
    data: null,
    loading: true,
    error: null
  });
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setResource({ data, loading: false, error: null }))
      .catch(error => setResource({ data: null, loading: false, error }));
  }, [url]);
  // Use different render props for different states
  if (loading && resource.loading) {
    return loading();
  }
  if (error && resource.error) {
    return error(resource.error);
  }
  if (data && resource.data) {
    return data(resource.data);
  }
  return null;
}
// Usage
function App() {
  return (
    <Resource
      url="/api/users"
      loading={() => <div>Loading...</div>}
      error={(error) => <div>Error: {error}</div>}
      data={(data) => <UserList users={data} />}
    />
  );
}
```


### Pattern 2: Composing Render Props
```javascript
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).finally(() => setLoading(false));
  }, [url]);
  return children({ data, loading });
}
function withMouseTracking(Component) {
  return function MouseTrackedComponent({ children, ...props }) {
    return (
      <MouseTracker>
        {mouseProps => (
          <Component {...props} {...mouseProps}>
            {children}
          </Component>
        )}
      </MouseTracker>
    );
  };
}
// Usage
function App() {
  return (
    <DataFetcher url="/api/users">
      {({ data, loading }) => (
        <MouseTracker>
          {({ position }) => (
            <div>
              {loading ? 'Loading...' : <UserList users={data} />}
              <p>Mouse at {position.x}, {position.y}</p>
            </div>
          )}
        </MouseTracker>
      )}
    </DataFetcher>
  );
}
```
---


## Complete Examples


### Complete Mouse Tracker with Advanced Features
```javascript
function AdvancedMouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [acceleration, setAcceleration] = useState({ ax: 0, ay: 0 });
  const prevPosition = useRef({ x: 0, y: 0 });
  const prevVelocity = useRef({ vx: 0, vy: 0 });
  const lastTime = useRef(Date.now());
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = (now - lastTime.current) / 1000;
      const currentPosition = { x: e.clientX, y: e.clientY };
      const currentVelocity = {
        vx: (currentPosition.x - prevPosition.current.x) / dt,
        vy: (currentPosition.y - prevPosition.current.y) / dt
      };
      const currentAcceleration = {
        ax: (currentVelocity.vx - prevVelocity.current.vx) / dt,
        ay: (currentVelocity.vy - prevVelocity.current.vy) / dt
      };
      setPosition(currentPosition);
      setVelocity(currentVelocity);
      setAcceleration(currentAcceleration);
      prevPosition.current = currentPosition;
      prevVelocity.current = currentVelocity;
      lastTime.current = now;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const speed = Math.sqrt(velocity.vx ** 2 + velocity.vy ** 2);
  const direction = Math.atan2(velocity.vy, velocity.vx) * (180 / Math.PI);
  return children({
    position,
    velocity,
    acceleration,
    speed,
    direction
  });
}
// Usage
function App() {
  return (
    <AdvancedMouseTracker>
      {({ position, speed, direction }) => (
        <div>
          <p>Position: ({position.x.toFixed(0)}, {position.y.toFixed(0)})</p>
          <p>Speed: {speed.toFixed(2)} px/s</p>
          <p>Direction: {direction.toFixed(1)}°</p>
        </div>
      )}
    </AdvancedMouseTracker>
  );
}
```


### Complete Data Fetcher with Cache
```javascript
function CachedDataFetcher({ url, children, cacheTime = 5000 }) {
  const cacheRef = useRef(new Map());
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
    cached: false
  });
  useEffect(() => {
    // Check cache first
    const cached = cacheRef.current.get(url);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setState({
        data: cached.data,
        loading: false,
        error: null,
        cached: true
      });
      return;
    }
    // Fetch new data
    setState(prev => ({ ...prev, loading: true, cached: false }));
    fetch(url)
      .then(res => res.json())
      .then(data => {
        cacheRef.current.set(url, { data, timestamp: Date.now() });
        setState({ data, loading: false, error: null, cached: false });
      })
      .catch(error => {
        setState({ data: null, loading: false, error: error.message, cached: false });
      });
  }, [url, cacheTime]);
  return children(state);
}
// Usage
function App() {
  return (
    <CachedDataFetcher url="/api/users">
      {({ data, loading, error, cached }) => (
        <div>
          {loading && <div>Loading...</div>}
          {error && <div>Error: {error}</div>}
          {data && (
            <div>
              {cached && <span>(Cached)</span>}
              <UserList users={data} />
            </div>
          )}
        </div>
      )}
    </CachedDataFetcher>
  );
}
```
---


## Testing Render Props
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import MouseTracker from './MouseTracker';
describe('MouseTracker', () => {
  it('tracks mouse position', async () => {
    render(
      <MouseTracker>
        {({ x, y }) => <div>Mouse at {x}, {y}</div>}
      </MouseTracker>
    );
    // Simulate mouse move
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    }));
    await waitFor(() => {
      expect(screen.getByText(/Mouse at 100, 200/)).toBeInTheDocument();
    });
  });
});
```
---


## Performance Optimization


### Memoizing Render Functions
```javascript
function OptimizedMouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  // Memoize the render output
  const renderOutput = useMemo(() => {
    return children(position);
  }, [children, position]);
  return renderOutput;
}
// Or memoize in parent
function App() {
  const renderContent = useCallback(({ x, y }) => (
    <div>Mouse at {x}, {y}</div>
  ), []);
  return (
    <MouseTracker>
      {renderContent}
    </MouseTracker>
  );
}
```
---


## Real-World Compositions


### Example: Search with Debounce
```javascript
function SearchWithDebounce({ debounceMs, children }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);
  return children({
    query,
    setQuery,
    debouncedQuery
  });
}
// Usage
function App() {
  return (
    <SearchWithDebounce debounceMs={500}>
      {({ query, setQuery, debouncedQuery }) => (
        <div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search..."
          />
          {debouncedQuery && <SearchResults query={debouncedQuery} />}
        </div>
      )}
    </SearchWithDebounce>
  );
}
```


### Example: Intersection Observer
```javascript
function IntersectionTracker({ children, options = {} }) {
  const ref = useRef();
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);
  return children({
    ref,
    isIntersecting: entry?.isIntersecting,
    intersectionRatio: entry?.intersectionRatio,
    boundingClientRect: entry?.boundingClientRect
  });
}
// Usage
function App() {
  return (
    <IntersectionTracker options={{ threshold: 0.5 }}>
      {({ ref, isIntersecting }) => (
        <div ref={ref} className={isIntersecting ? 'visible' : ''}>
          {isIntersecting ? 'In viewport' : 'Not in viewport'}
        </div>
      )}
    </IntersectionTracker>
  );
}
```
---


## Key Takeaways Recap


### ✅ Render Props Benefits
1. **Flexibility**: Complete control over rendering
2. **Reusability**: Share logic across components
3. **Separation**: Logic and presentation separated
4. **Composability**: Can be combined with other patterns
5. **Simplicity**: Easy to understand and use


### 🎯 When to Use
- Need flexible rendering output
- Sharing stateful logic
- Building reusable components
- When hooks aren't flexible enough
- Legacy React codebases


### 📚 Alternatives and Complements
- **Custom Hooks**: Preferred for simple logic reuse
- **Compound Components**: When needing related components
- **HOCs**: For cross-cutting concerns
- **Context**: For deeply nested state sharing
---
---


## Advanced Mouse Tracker Implementation
```javascript
function AdvancedMouseTracker({ children, options = {} }) {
  const { 
    enableVelocity = false, 
    enableAcceleration = false,
    enableClick = false,
    enableDrag = false
  } = options;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [acceleration, setAcceleration] = useState({ ax: 0, ay: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [clicks, setClicks] = useState(0);
  const prevPosition = useRef({ x: 0, y: 0 });
  const prevVelocity = useRef({ vx: 0, vy: 0 });
  const lastTime = useRef(Date.now());
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = (now - lastTime.current) / 1000;
      const currentPosition = { x: e.clientX, y: e.clientY };
      if (enableVelocity) {
        const currentVelocity = {
          vx: (currentPosition.x - prevPosition.current.x) / dt,
          vy: (currentPosition.y - prevPosition.current.y) / dt
        };
        setVelocity(currentVelocity);
        if (enableAcceleration) {
          const currentAcceleration = {
            ax: (currentVelocity.vx - prevVelocity.current.vx) / dt,
            ay: (currentVelocity.vy - prevVelocity.current.vy) / dt
          };
          setAcceleration(currentAcceleration);
          prevVelocity.current = currentVelocity;
        }
      }
      setPosition(currentPosition);
      prevPosition.current = currentPosition;
      lastTime.current = now;
    };
    const handleClick = () => {
      if (enableClick) {
        setClicks(prev => prev + 1);
      }
    };
    const handleMouseDown = () => {
      if (enableDrag) {
        setIsDragging(true);
      }
    };
    const handleMouseUp = () => {
      if (enableDrag) {
        setIsDragging(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    if (enableClick) window.addEventListener('click', handleClick);
    if (enableDrag) {
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (enableClick) window.removeEventListener('click', handleClick);
      if (enableDrag) {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [enableVelocity, enableAcceleration, enableClick, enableDrag]);
  const speed = Math.sqrt(velocity.vx ** 2 + velocity.vy ** 2);
  const direction = Math.atan2(velocity.vy, velocity.vx) * (180 / Math.PI);
  return children({
    position,
    velocity,
    acceleration,
    speed,
    direction,
    isDragging,
    clicks
  });
}
// Usage
function App() {
  return (
    <AdvancedMouseTracker
      options={{
        enableVelocity: true,
        enableAcceleration: true,
        enableClick: true,
        enableDrag: true
      }}
    >
      {({ position, speed, direction, isDragging, clicks }) => (
        <div>
          <p>Position: {position.x}, {position.y}</p>
          <p>Speed: {speed.toFixed(2)} px/s</p>
          <p>Direction: {direction.toFixed(1)}°</p>
          <p>Dragging: {isDragging ? 'Yes' : 'No'}</p>
          <p>Clicks: {clicks}</p>
        </div>
      )}
    </AdvancedMouseTracker>
  );
}
```
---


## Complex State Management with Render Props
```javascript
function StateMachine({ initialState, children }) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const updateState = useCallback((updates) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      setHistory(history => [...history, newState]);
      return newState;
    });
  }, []);
  const reset = useCallback(() => {
    setState(initialState);
    setHistory([initialState]);
  }, [initialState]);
  const undo = useCallback(() => {
    if (history.length > 1) {
      setHistory(history => {
        const newHistory = [...history];
        newHistory.pop();
        setState(newHistory[newHistory.length - 1]);
        return newHistory;
      });
    }
  }, [history]);
  return children({
    state,
    updateState,
    reset,
    undo,
    canUndo: history.length > 1
  });
}
// Usage
function App() {
  return (
    <StateMachine initialState={{ count: 0, name: '' }}>
      {({ state, updateState, reset, undo, canUndo }) => (
        <div>
          <p>Count: {state.count}</p>
          <p>Name: {state.name}</p>
          <button onClick={() => updateState({ count: state.count + 1 })}>
            Increment
          </button>
          <button onClick={() => updateState({ count: state.count - 1 })}>
            Decrement
          </button>
          <input
            value={state.name}
            onChange={e => updateState({ name: e.target.value })}
          />
          <button onClick={reset}>Reset</button>
          <button onClick={undo} disabled={!canUndo}>Undo</button>
        </div>
      )}
    </StateMachine>
  );
}
```
---


## Network Status Tracker
```javascript
function NetworkTracker({ children }) {
  const [status, setStatus] = useState({
    online: navigator.onLine,
    effectiveType: navigator.connection?.effectiveType || 'unknown',
    downlink: navigator.connection?.downlink || 0,
    rtt: navigator.connection?.rtt || 0
  });
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, online: true }));
    };
    const handleOffline = () => {
      setStatus(prev => ({ ...prev, online: false }));
    };
    const handleConnectionChange = () => {
      const connection = navigator.connection;
      if (connection) {
        setStatus({
          online: navigator.onLine,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      }
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (navigator.connection) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);
  return children(status);
}
// Usage
function App() {
  return (
    <NetworkTracker>
      {({ online, effectiveType, downlink, rtt }) => (
        <div>
          <p>Status: {online ? '🟢 Online' : '🔴 Offline'}</p>
          {online && (
            <>
              <p>Connection: {effectiveType}</p>
              <p>Downlink: {downlink} Mbps</p>
              <p>RTT: {rtt} ms</p>
            </>
          )}
        </div>
      )}
    </NetworkTracker>
  );
}
```
---


## Geolocation Tracker
```javascript
function GeolocationTracker({ children, options = {} }) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      options
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);
  return children({ location, error, loading });
}
// Usage
function App() {
  return (
    <GeolocationTracker options={{ enableHighAccuracy: true }}>
      {({ location, error, loading }) => {
        if (loading) return <div>Loading location...</div>;
        if (error) return <div>Error: {error}</div>;
        if (!location) return null;
        return (
          <div>
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
            <p>Accuracy: ±{location.accuracy.toFixed(2)}m</p>
            {location.altitude && (
              <p>Altitude: {location.altitude.toFixed(2)}m</p>
            )}
          </div>
        );
      }}
    </GeolocationTracker>
  );
}
```
---


## Media Query Tracker
```javascript
function MediaQueryTracker({ children, queries = {} }) {
  const [matches, setMatches] = useState({});
  useEffect(() => {
    const mediaQueries = {};
    const listeners = {};
    Object.keys(queries).forEach(key => {
      const query = queries[key];
      const mq = window.matchMedia(query);
      mediaQueries[key] = mq;
      const handler = (event) => {
        setMatches(prev => ({
          ...prev,
          [key]: event.matches
        }));
      };
      listeners[key] = handler;
      mq.addEventListener('change', handler);
      // Initial state
      setMatches(prev => ({
        ...prev,
        [key]: mq.matches
      }));
    });
    return () => {
      Object.keys(listeners).forEach(key => {
        mediaQueries[key].removeEventListener('change', listeners[key]);
      });
    };
  }, [queries]);
  return children(matches);
}
// Usage
function App() {
  return (
    <MediaQueryTracker
      queries={{
        mobile: '(max-width: 767px)',
        tablet: '(min-width: 768px) and (max-width: 1023px)',
        desktop: '(min-width: 1024px)',
        darkMode: '(prefers-color-scheme: dark)'
      }}
    >
      {({ mobile, tablet, desktop, darkMode }) => (
        <div className={darkMode ? 'dark' : 'light'}>
          {mobile && <div>Mobile View</div>}
          {tablet && <div>Tablet View</div>}
          {desktop && <div>Desktop View</div>}
        </div>
      )}
    </MediaQueryTracker>
  );
}
```
---


## Storage Tracker
```javascript
function StorageTracker({ children, type = 'localStorage' }) {
  const [storage, setStorage] = useState({});
  useEffect(() => {
    const getStorage = () => {
      const data = {};
      if (type === 'localStorage') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          data[key] = localStorage.getItem(key);
        }
      } else if (type === 'sessionStorage') {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          data[key] = sessionStorage.getItem(key);
        }
      }
      setStorage(data);
    };
    getStorage();
    const handleStorageChange = (e) => {
      if (e.storageArea === (type === 'localStorage' ? localStorage : sessionStorage)) {
        getStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    getStorage(); // Refresh on any storage event
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [type]);
  return children({
    storage,
    size: Object.keys(storage).length,
    keys: Object.keys(storage),
    getItem: (key) => storage[key] || null,
    hasItem: (key) => key in storage
  });
}
// Usage
function App() {
  return (
    <StorageTracker type="localStorage">
      {({ storage, size, keys, hasItem }) => (
        <div>
          <p>Storage items: {size}</p>
          <ul>
            {keys.map(key => (
              <li key={key}>
                {key}: {storage[key]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </StorageTracker>
  );
}
```
---


## Render Props Best Practices Summary


### ✅ DO
1. **Use descriptive names** - Make render functions clear
2. **Destructure parameters** - Improve readability
3. **Provide defaults** - Handle undefined gracefully
4. **Memoize when needed** - Prevent unnecessary re-renders
5. **Document the API** - Explain expected parameters
6. **Handle all states** - Loading, error, success


### ❌ DON'T
1. **Don't create functions in render** - Use useCallback
2. **Don't ignore states** - Handle loading/error
3. **Don't over-nest** - Keep it simple
4. **Don't forget cleanup** - Remove event listeners
5. **Don't re-render unnecessarily** - Optimize
---


## Migration Guide: Render Props to Hooks
```javascript
// Render Props Version
function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return children(position);
}
// Hook Version
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return position;
}
// Usage Comparison
// Render Props
<MouseTracker>
  {position => <div>Mouse at {position.x}, {position.y}</div>}
</MouseTracker>
// Hook
function Component() {
  const position = useMouse();
  return <div>Mouse at {position.x}, {position.y}</div>;
}
```
---


## Complete Application Example: Analytics Dashboard
```javascript
// Combine multiple render props for a dashboard
function Dashboard({ children }) {
  return (
    <WindowSize>
      {({ width, height, isMobile, isDesktop }) => (
        <NetworkTracker>
          {({ online, effectiveType }) => (
            <UserActivity>
              {({ sessionTime, actions }) => (
                <GeolocationTracker options={{ enableHighAccuracy: false }}>
                  {({ location, error: geoError }) => (
                    <Theming>
                      {({ theme, toggleTheme }) => (
                        children({
                          viewport: { width, height, isMobile, isDesktop },
                          network: { online, effectiveType },
                          user: { sessionTime, actions },
                          location: location ? { lat: location.latitude, lng: location.longitude } : null,
                          theme,
                          toggleTheme,
                          isReady: !geoError && location !== null
                        })
                      )}
                    </Theming>
                  )}
                </GeolocationTracker>
              )}
            </UserActivity>
          )}
        </NetworkTracker>
      )}
    </WindowSize>
  );
}
// Usage
function AnalyticsDashboard() {
  return (
    <Dashboard>
      {({ viewport, network, user, theme, toggleTheme, isReady }) => (
        <div className={theme}>
          {!isReady && <div>Loading dashboard...</div>}
          {isReady && (
            <>
              <div className="stats">
                <StatCard title="Viewport" value={`${viewport.width}x${viewport.height}`} />
                <StatCard title="Network" value={network.online ? 'Online' : 'Offline'} />
                <StatCard title="Session" value={`${user.sessionTime}s`} />
                <StatCard title="Actions" value={user.actions} />
              </div>
              <button onClick={toggleTheme}>Toggle Theme</button>
            </>
          )}
        </div>
      )}
    </Dashboard>
  );
}
```
---


## Summary: Render Props vs Alternatives


### Comparison Table
| Pattern | Best For | Complexity | Flexibility | Modern Approach |
|---------|----------|------------|-------------|----------------|
| Render Props | Multiple outputs, flexible rendering | Medium | Very High | ✅ Still Used |
| Custom Hooks | Simple logic reuse | Low | Medium | ✅ Preferred |
| Compound Components | Related UI elements | Medium | High | ✅ Preferred |
| HOCs | Cross-cutting concerns | High | Medium | ⚠️ Less Common |


### When to Use Each
**Render Props:**
- Need multiple rendering outputs
- Maximum flexibility in rendering
- Sharing complex stateful logic
- Legacy React codebases
**Custom Hooks:**
- Simple logic reuse
- Single value return
- Modern React development
- Most common pattern today
**Compound Components:**
- Building flexible component libraries
- Related UI elements
- Clear API with dot notation
**HOCs:**
- Cross-cutting concerns
- Authentication, data fetching
- Less preferred in modern React
---
**Complete! You've mastered Render Props from basics to advanced patterns! 🎯**
