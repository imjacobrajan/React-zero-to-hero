# Day 16: Custom Hooks - Part 1 - Creating Reusable Logic
## Introduction
Welcome to Day 16! Today you'll master **custom hooks** - React's powerful pattern for extracting and reusing stateful logic across components. By the end of today, you'll:
- ✅ Understand what custom hooks are
- ✅ Create custom hooks from scratch
- ✅ Follow proper hook naming conventions
- ✅ Extract reusable logic effectively
- ✅ Build useToggle and useLocalStorage hooks
- ✅ Share logic across multiple components
- ✅ Test custom hooks properly
- ✅ Apply best practices
---


## What are Custom Hooks?


### Understanding Custom Hooks
**Custom hooks** are JavaScript functions that:
1. Start with "use" (naming convention)
2. Can call other hooks
3. Allow you to extract component logic into reusable functions
**Analogy**: Think of custom hooks as **reusable toolkits**:
- Each toolkit contains specific tools (hooks) for a job
- Instead of buying new tools every time, you grab your toolkit
- You can share toolkits between different projects
- Each toolkit has its own specialized purpose


### Why Use Custom Hooks?
```javascript
// ❌ BAD: Logic duplicated in multiple components
function Component1() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);
  // ... component logic
}
function Component2() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);
  // ... same logic duplicated!
}
function Component3() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);
  // ... same logic duplicated again!
}
// ✅ GOOD: Logic extracted into custom hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(prev => !prev);
  return [value, toggle];
}
function Component1() {
  const [isOpen, toggle] = useToggle(); // Reuse!
}
function Component2() {
  const [isOpen, toggle] = useToggle(); // Reuse!
}
function Component3() {
  const [isOpen, toggle] = useToggle(); // Reuse!
}
```
---


## Creating Custom Hooks


### Basic Custom Hook Structure
```javascript
function useCustomHook(initialValue) {
  // Can use any React hooks
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    // Side effects
  }, []);
  // Return values, functions, or objects
  return [state, setState];
}
```


### Example 1: useToggle Hook
```javascript
import { useState, useCallback } from 'react';
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
// Usage
function Modal() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);
  return (
    <div>
      {isOpen && <div>Modal Content</div>}
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Open</button>
      <button onClick={setFalse}>Close</button>
    </div>
  );
}
```


### Example 2: useLocalStorage Hook
```javascript
import { useState, useEffect, useCallback } from 'react';
function useLocalStorage(key, initialValue) {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  // Set value in state and localStorage
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  // Remove value
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  // Sync with storage events (from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);
  return [storedValue, setValue, removeValue];
}
// Usage
function App() {
  const [name, setName, removeName] = useLocalStorage('name', 'Guest');
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={() => setName('Guest')}>Reset</button>
      <button onClick={removeName}>Remove</button>
      <p>Welcome, {name}!</p>
    </div>
  );
}
```
---


## Hook Naming Conventions


### Rules for Custom Hook Names
1. **Must start with "use"**
   ```javascript
   ✅ useToggle
   ✅ useLocalStorage
   ✅ useAuth
   ❌ toggle
   ❌ localStorage
   ❌ auth
   ```
2. **Follow camelCase**
   ```javascript
   ✅ useLocalStorage
   ✅ useToggleTheme
   ✅ useFetchData
   ❌ useLocalStorage
   ❌ use_toggle
   ```
3. **Be descriptive**
   ```javascript
   ✅ useDebounce
   ✅ useWindowResize
   ✅ useOnlineStatus
   ❌ useD
   ❌ useW
   ❌ useO
   ```


### Naming Patterns
```javascript
// Pattern: use + What it does
function useDebounce(value, delay) { /* ... */ }
function useThrottle(value, limit) { /* ... */ }
function useFetch(url) { /* ... */ }
// Pattern: use + State/Feature name
function useTheme() { /* ... */ }
function useAuth() { /* ... */ }
function useCart() { /* ... */ }
// Pattern: use + Utility action
function useToggle() { /* ... */ }
function useCounter() { /* ... */ }
function usePrevious(value) { /* ... */ }
```
---


## Extracting Reusable Logic


### Before: Duplicated Logic
```javascript
function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {products.map(product => <li key={product.id}>{product.name}</li>)}
    </ul>
  );
}
// Same logic duplicated!
```


### After: Extracted Hook
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  return { data, loading, error };
}
function UsersList() {
  const { data: users, loading, error } = useFetch('/api/users');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
function ProductsList() {
  const { data: products, loading, error } = useFetch('/api/products');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <ul>
      {products.map(product => <li key={product.id}>{product.name}</li>)}
    </ul>
  );
}
```
---


## Common Custom Hooks


### 1. usePrevious Hook
```javascript
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
      <p>Difference: {count - (prevCount || 0)}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```


### 2. useDebounce Hook
```javascript
function useDebounce(value, delay = 500) {
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
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
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


### 3. useWindowSize Hook
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
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}
// Usage
function ResponsiveComponent() {
  const { width, height } = useWindowSize();
  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width && width < 768 && <MobileView />}
      {width && width >= 768 && <DesktopView />}
    </div>
  );
}
```


### 4. useOnlineStatus Hook
```javascript
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
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
function App() {
  const isOnline = useOnlineStatus();
  return (
    <div>
      {isOnline ? (
        <div>You are online</div>
      ) : (
        <div>You are offline</div>
      )}
    </div>
  );
}
```
---


## Advanced Patterns


### Pattern 1: Composed Custom Hooks
```javascript
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setErrors(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  };
  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    reset
  };
}
// Usage
function LoginForm() {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    email: '',
    password: ''
  });
  const onSubmit = async (values) => {
    await api.login(values);
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onSubmit); }}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange('email')}
      />
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange('password')}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```
---


## Best Practices


### ✅ DO
1. **Name hooks starting with "use"**
2. **Return consistent values**
3. **Handle edge cases**
4. **Document complex hooks**
5. **Test your hooks**


### ❌ DON'T
1. **Don't call hooks conditionally**
2. **Don't nest hooks too deeply**
3. **Don't forget dependencies**
4. **Don't mutate state directly**
---


## Interview Preparation


### Common Questions


#### Q1: What is a custom hook?
**Answer**: A JavaScript function that uses React hooks and starts with "use". It lets you extract and reuse stateful logic across components.


#### Q2: What are the rules for creating custom hooks?
**Answer**: Must start with "use", can call other hooks, and return values/functions for components to use.


#### Q3: When should you create a custom hook?
**Answer**: When you find yourself duplicating logic across components, or when you want to extract complex logic for reusability.
---


## Practice Exercise


### Requirements:
- ✅ Create useToggle hook
- ✅ Create useLocalStorage hook
- ✅ Extract reusable logic
- ✅ Follow naming conventions
- ✅ Handle edge cases
See practice file: `day-16/practice/custom-hooks.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **Custom Hooks**: Extract reusable logic
2. **Naming**: Start with "use"
3. **Reusability**: Share logic across components
4. **Common Hooks**: useToggle, useLocalStorage, etc.
5. **Best Practices**: Follow conventions and test


### 🎯 Key Concepts
- Custom hooks start with "use"
- Extract repeated logic
- Return consistent values
- Follow naming conventions
- Test your hooks


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ useFetch custom hook
- ✅ useDebounce implementation
- ✅ useWindowSize hook
- ✅ More common patterns
---
**Great work! 🎉 You've mastered custom hooks!**
**You're now ready for Custom Hooks Part 2! 🚀**
---
---


## useToggle Hook - Complete Implementation
```javascript
import { useState, useCallback } from 'react';
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
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  return {
    value,
    toggle,
    setTrue,
    setFalse,
    reset,
    isTrue: value === true,
    isFalse: value === false
  };
}
// Usage Examples
function ModalExample() {
  const { value: isOpen, toggle, setTrue, setFalse } = useToggle();
  return (
    <div>
      {isOpen && <div className="modal">Modal Content</div>}
      <button onClick={toggle}>Toggle Modal</button>
      <button onClick={setTrue}>Open</button>
      <button onClick={setFalse}>Close</button>
    </div>
  );
}
function AccordionExample() {
  const { value: isExpanded, toggle } = useToggle();
  return (
    <div>
      <button onClick={toggle}>
        {isExpanded ? '▼' : '▶'} Click me
      </button>
      {isExpanded && <div>Expanded content</div>}
    </div>
  );
}
function ControlledToggleExample() {
  const { value, toggle } = useToggle();
  const [count, setCount] = useState(0);
  const handleToggle = () => {
    toggle();
    setCount(prev => prev + 1);
  };
  return (
    <div>
      <button onClick={handleToggle}>Toggle</button>
      <p>Value: {value ? 'ON' : 'OFF'}</p>
      <p>Toggled: {count} times</p>
    </div>
  );
}
```
---


## useLocalStorage Hook - Complete Implementation
```javascript
import { useState, useEffect, useCallback } from 'react';
function useLocalStorage(key, initialValue) {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  // Set value in state and localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function for functional updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  // Clear all localStorage
  const clearAll = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [initialValue]);
  // Sync with storage events (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key]);
  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
    isInitialValue: storedValue === initialValue
  };
}
// Usage Examples
function ThemePersistor() {
  const { value: theme, setValue: setTheme } = useLocalStorage('theme', 'light');
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
function UserPreferences() {
  const { value: preferences, setValue: setPreferences } = useLocalStorage('preferences', {
    notifications: true,
    sounds: true,
    darkMode: false
  });
  const toggleNotification = () => {
    setPreferences(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preferences.notifications}
          onChange={toggleNotification}
        />
        Enable Notifications
      </label>
    </div>
  );
}
```
---


## More Common Custom Hooks


### 5. useClickOutside Hook
```javascript
function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref, callback]);
}
// Usage
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));
  return (
    <div ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)}>Open</button>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}
```


### 6. useInterval Hook
```javascript
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
// Usage
function Clock() {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count + 1);
  }, 1000);
  return <div>Time: {count}s</div>;
}
```


### 7. useCounter Hook
```javascript
function useCounter(initialValue = 0, min = -Infinity, max = Infinity) {
  const [count, setCount] = useState(initialValue);
  const increment = useCallback(() => {
    setCount(prev => Math.min(prev + 1, max));
  }, [max]);
  const decrement = useCallback(() => {
    setCount(prev => Math.max(prev - 1, min));
  }, [min]);
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  const setValue = useCallback((value) => {
    if (value >= min && value <= max) {
      setCount(value);
    }
  }, [min, max]);
  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
    canIncrement: count < max,
    canDecrement: count > min
  };
}
// Usage
function CounterComponent() {
  const { count, increment, decrement, canIncrement, canDecrement } = useCounter(0, 0, 10);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={decrement} disabled={!canDecrement}>Decrement</button>
      <button onClick={increment} disabled={!canIncrement}>Increment</button>
    </div>
  );
}
```
---


## Advanced Custom Hook Patterns


### Pattern 1: Hook Composition
```javascript
function useFormInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  return {
    value,
    onChange: handleChange,
    reset,
    isEmpty: value.trim() === ''
  };
}
function useForm(fields) {
  const formFields = {};
  Object.keys(fields).forEach(fieldName => {
    formFields[fieldName] = useFormInput(fields[fieldName]);
  });
  const getValues = () => {
    const values = {};
    Object.keys(formFields).forEach(key => {
      values[key] = formFields[key].value;
    });
    return values;
  };
  const reset = () => {
    Object.keys(formFields).forEach(key => {
      formFields[key].reset();
    });
  };
  const isValid = Object.keys(formFields).every(key => !formFields[key].isEmpty);
  return {
    fields: formFields,
    getValues,
    reset,
    isValid
  };
}
// Usage
function UserForm() {
  const { fields, getValues, reset, isValid } = useForm({
    name: '',
    email: '',
    message: ''
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(getValues());
    reset();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input {...fields.name} placeholder="Name" />
      <input {...fields.email} type="email" placeholder="Email" />
      <textarea {...fields.message} placeholder="Message" />
      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  );
}
```
---


## Testing Custom Hooks


### Testing with renderHook
```javascript
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';
describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });
  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
  });
});
```
---


## Real-World Hook Libraries


### Popular Custom Hook Libraries
1. **react-use** - Collection of 100+ hooks
2. **ahooks** - Advanced React Hooks library
3. **usehooks-ts** - TypeScript-friendly hooks
---


## Edge Cases and Gotchas


### Edge Case 1: Stale Closures
```javascript
// ❌ BAD: Stale closure
function useTimer(initialCount) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1); // Stale count!
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);
}
// ✅ GOOD: Functional update
function useTimer(initialCount) {
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1); // Always fresh!
    }, 1000);
    return () => clearInterval(timer);
  }, []); // No dependencies needed
}
```
---


### 8. useHover Hook
```javascript
function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return [ref, isHovered];
}
// Usage
function HoverableButton() {
  const [ref, isHovered] = useHover();
  return (
    <button 
      ref={ref}
      style={{
        backgroundColor: isHovered ? '#007bff' : '#cccccc',
        color: isHovered ? 'white' : 'black'
      }}
    >
      {isHovered ? 'Hovered!' : 'Hover over me'}
    </button>
  );
}
```


### 9. useScrollPosition Hook
```javascript
function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.pageYOffset);
    };
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  return scrollPosition;
}
// Usage
function ScrollIndicator() {
  const scrollPosition = useScrollPosition();
  return (
    <div>
      <div>Scroll position: {scrollPosition}px</div>
      <progress value={scrollPosition} max={document.body.scrollHeight} />
    </div>
  );
}
```


### 10. useAsync Hook
```javascript
function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);
    return asyncFunction()
      .then(response => {
        setValue(response);
        setStatus('success');
        return response;
      })
      .catch(error => {
        setError(error);
        setStatus('error');
        throw error;
      });
  }, [asyncFunction]);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);
  return { execute, status, value, error, isIdle: status === 'idle', isLoading: status === 'pending', isSuccess: status === 'success', isError: status === 'error' };
}
// Usage
function DataComponent() {
  const fetchData = async () => {
    const response = await fetch('/api/data');
    return response.json();
  };
  const { execute, value, error, isLoading } = useAsync(fetchData);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (value) return <div>{JSON.stringify(value)}</div>;
  return <button onClick={execute}>Fetch Data</button>;
}
```


### 11. useGeolocation Hook
```javascript
function useGeolocation() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const getPosition = useCallback(() => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);
  return { location, error, loading, getPosition };
}
// Usage
function LocationComponent() {
  const { location, error, loading, getPosition } = useGeolocation();
  return (
    <div>
      <button onClick={getPosition} disabled={loading}>
        Get Location
      </button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {location.latitude && (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
}
```


### 12. useCopyToClipboard Hook
```javascript
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  }, []);
  return { copied, error, copy };
}
// Usage
function CopyButton({ text }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```
---


## Custom Hook Best Practices


### ✅ DO
1. **Always start with "use"**
2. **Return consistent values**
3. **Document complex hooks**
4. **Handle edge cases**
5. **Memoize callbacks with useCallback**
6. **Use useMemo for expensive computations**
7. **Provide sensible defaults**
8. **Test your hooks**


### ❌ DON'T
1. **Don't call hooks conditionally**
2. **Don't use in loops**
3. **Don't mutate state directly**
4. **Don't forget dependencies**
5. **Don't create hooks that are too complex**
---


## Summary of Common Custom Hooks
| Hook | Purpose | Returns |
|------|---------|---------|
| `useToggle` | Boolean toggle | `[value, { toggle, setTrue, setFalse }]` |
| `useLocalStorage` | Persist data | `{ value, setValue, removeValue }` |
| `usePrevious` | Previous value | `previous value` |
| `useDebounce` | Delay execution | `debounced value` |
| `useWindowSize` | Window dimensions | `{ width, height }` |
| `useOnlineStatus` | Network status | `isOnline` |
| `useClickOutside` | Detect outside clicks | none |
| `useInterval` | Repeating timer | none |
| `useCounter` | Increment/decrement | `{ count, increment, decrement }` |
| `useHover` | Hover state | `[ref, isHovered]` |
| `useAsync` | Async operations | `{ execute, status, value, error }` |
| `useGeolocation` | Get user location | `{ location, error, getPosition }` |
| `useCopyToClipboard` | Copy text | `{ copied, copy }` |
---


## Summary Cheat Sheet


### Custom Hooks Quick Reference
```javascript
// 1. Basic structure
function useCustomHook() {
  const [state, setState] = useState();
  useEffect(() => {}, []);
  return { state, setState };
}
// 2. useToggle
const [value, { toggle, setTrue, setFalse }] = useToggle();
// 3. useLocalStorage
const [value, setValue, removeValue] = useLocalStorage('key', initialValue);
// 4. usePrevious
const prevValue = usePrevious(value);
// 5. useDebounce
const debouncedValue = useDebounce(value, 500);
// 6. useWindowSize
const { width, height } = useWindowSize();
// 7. useOnlineStatus
const isOnline = useOnlineStatus();
// 8. useClickOutside
useClickOutside(ref, callback);
// 9. useInterval
useInterval(callback, delay);
// 10. useAsync
const { execute, status, value, error } = useAsync(fn, immediate);
```


### Hook Naming Patterns
```
✅ useToggle, useModal, useCounter
✅ useAuth, useTheme, useCart
✅ useDebounce, useThrottle, useFetch
✅ useLocalStorage, useSessionStorage, useMediaQuery
✅ useWindowResize, useOnlineStatus, useGeolocation
```


### Common Patterns
| Pattern | Hook | Use Case |
|---------|------|----------|
| Boolean state | useToggle | Modal, accordion |
| Persistent state | useLocalStorage | Settings, preferences |
| Previous value | usePrevious | Compare, diff |
| Delayed value | useDebounce | Search, validation |
| Window info | useWindowSize | Responsive |
| Network status | useOnlineStatus | Offline mode |
| Outside clicks | useClickOutside | Dropdown, modal |
| Timers | useInterval | Slideshow, poll |
| Counter | useCounter | Quantity, rating |
| Hover state | useHover | Tooltip, highlight |
| Async ops | useAsync | Data fetching |
| Clipboard | useCopyToClipboard | Share, duplicate |
---
---


## More Advanced Custom Hooks


### 13. useReducer Hook Pattern
```javascript
function useToggle(initialValue = false) {
  return useReducer((state) => !state, initialValue);
}
// Usage
function Component() {
  const [isOpen, toggle] = useToggle();
  return <button onClick={toggle}>{isOpen ? 'Open' : 'Closed'}</button>;
}
```


### 14. useFetch Hook with Cache
```javascript
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  useEffect(() => {
    if (cacheRef.current.has(url)) {
      setData(cacheRef.current.get(url));
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(url)
      .then(res => res.json())
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


### 15. useForm Hook with Validation
```javascript
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate[name]?.(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  const handleBlur = (name) => () => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate[name]?.(values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  const isValid = Object.keys(errors).every(key => !errors[key]);
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    isValid
  };
}
```
---


## Hook Composition Patterns


### Pattern: Combining Multiple Hooks
```javascript
function useUserProfile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [preferences, setPreferences] = useLocalStorage('preferences', {});
  const updatePreferences = useCallback((updates) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, [setPreferences]);
  const isDarkMode = theme === 'dark';
  const displayName = user?.name || 'Guest';
  return {
    user,
    preferences,
    updatePreferences,
    isDarkMode,
    displayName
  };
}
// Usage
function Profile() {
  const { user, preferences, isDarkMode, displayName } = useUserProfile();
  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <h1>{displayName}</h1>
      <p>Theme: {isDarkMode ? 'Dark' : 'Light'}</p>
    </div>
  );
}
```
---
---


## Custom Hook Design Patterns


### Pattern 1: Dependency Injection
```javascript
function useAPI(fetcher = fetch) {
  // Allows injecting different fetch implementations for testing
  const [data, setData] = useState(null);
  useEffect(() => {
    fetcher('/api/data')
      .then(r => r.json())
      .then(setData);
  }, [fetcher]);
  return data;
}
// Easy to test
const mockFetch = async () => ({ json: async () => ({ mock: true }) });
const data = useAPI(mockFetch);
```


### Pattern 2: Configuration Hooks
```javascript
function useConfig(options) {
  const {
    defaultValue = '',
    validate,
    transform,
    debounceMs = 300
  } = options;
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebounce(value, debounceMs);
  const transformed = useMemo(() => {
    return transform ? transform(debounced) : debounced;
  }, [debounced, transform]);
  const isValid = useMemo(() => {
    return validate ? validate(transformed) : true;
  }, [transformed, validate]);
  return {
    value,
    setValue,
    transformed,
    isValid,
    debounced
  };
}
```


### Pattern 3: Hook Chains
```javascript
function useFormWithAutoSave(formKey, initialValues) {
  const [values, setValues] = useState(initialValues);
  const [preferences] = useLocalStorage('preferences', {});
  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(formKey, JSON.stringify(values));
  }, [values, formKey]);
  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);
  return { values, setValues, reset };
}
```
---
---


## Testing Custom Hooks


### Testing with renderHook
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useToggle } from './useToggle';
describe('useToggle', () => {
  it('should initialize with false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });
  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle());
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
  });
  it('should set true', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);
  });
});
```


### Testing useLocalStorage
```javascript
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('should return initial value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current.value).toBe('default');
  });
  it('should return stored value from localStorage', () => {
    localStorage.setItem('key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current.value).toBe('stored');
  });
  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    act(() => {
      result.current.setValue('new value');
    });
    expect(localStorage.getItem('key')).toBe(JSON.stringify('new value'));
  });
});
```
---


## Advanced Hook Patterns


### Pattern 4: Hook Factories
```javascript
function createUseLocalStorage(key, initialValue) {
  return function() {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch {
        return initialValue;
      }
    });
    const setValue = (value) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(error);
      }
    };
    return [storedValue, setValue];
  };
}
// Usage
const useTheme = createUseLocalStorage('theme', 'light');
const useUserPrefs = createUseLocalStorage('prefs', {});
```


### Pattern 5: Hook with Subscriptions
```javascript
function useSubscription(subscribe, unsubscribe, getValue) {
  const [value, setValue] = useState(() => getValue());
  useEffect(() => {
    const handleChange = () => {
      setValue(getValue());
    };
    const unsubscribe = subscribe(handleChange);
    return () => {
      unsubscribe();
    };
  }, [subscribe, getValue]);
  return value;
}
// Usage with EventEmitter
function useEventValue(emitter, event) {
  return useSubscription(
    (handler) => emitter.on(event, handler),
    (handler) => emitter.off(event, handler),
    () => emitter.getValue(event)
  );
}
```
---


## SSR-Safe Custom Hooks


### Avoiding Window Errors in SSR
```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, isMounted]);
  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') return;
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key]);
  return [storedValue, setValue];
}
```
---


## Hook Libraries Comparison


### Popular Hook Collections
**react-use** (GitHub: streamich/react-use)
- 100+ hooks
- Well-tested
- TypeScript support
- Active maintenance
**ahooks** (GitHub: alibaba/hooks)
- 90+ hooks
- Enterprise-ready
- Excellent docs
- Large community
**usehooks-ts** (GitHub: juliencrn/usehooks-ts)
- TypeScript-first
- Modern patterns
- Good documentation


### When to Use Library vs Custom
**Use Library when:**
- ✅ Common use cases (useToggle, useDebounce)
- ✅ Need tested, production-ready code
- ✅ Quick prototyping
- ✅ Team uses same library
**Build Custom when:**
- ✅ Very specific requirements
- ✅ Need complete control
- ✅ Learning/testing
- ✅ Simple, one-off hooks
---


## Complete Reference Guide


### Complete Hook Templates
```javascript
// Template for state hooks
function use[State]Hook(initialValue) {
  const [value, setValue] = useState(initialValue);
  const update = useCallback((newValue) => {
    setValue(newValue);
  }, []);
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  return [value, update, reset];
}
// Template for effect hooks
function use[Effect]Hook(dependency) {
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependency]);
}
// Template for computed hooks
function use[Computed]Hook(input) {
  return useMemo(() => {
    // Computation
    return processedValue;
  }, [input]);
}
```
---


## Complete! You've mastered Custom Hooks Part 1 from basics to advanced patterns! 🎯
