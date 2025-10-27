# Day 14: Context API - Part 1 - Mastering Global State Management
## Introduction
Welcome to Day 14! Today you'll master **Context API** - React's powerful solution for sharing state globally across components without prop drilling. By the end of today, you'll:
- ✅ Understand the Context API and its purpose
- ✅ Know when to use Context vs props vs state management
- ✅ Create and use Context
- ✅ Use the Provider pattern effectively
- ✅ Build a complete theme switcher
- ✅ Understand useContext hook
- ✅ Avoid common Context pitfalls
- ✅ Optimize Context performance
---


## What is Context API?


### Understanding Context
**Context** provides a way to pass data through the component tree without passing props at every level.
**Analogy**: Think of Context as a **global bulletin board**:
- One person posts a notice on the board (Provider sets value)
- Anyone in the building can read it (Consumer/useContext reads value)
- No need to pass messages through every person in between
- Efficient and direct communication


### Core Concept
```javascript
// Create context
const ThemeContext = createContext('light');
// Provide value
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>
// Consume value
const theme = useContext(ThemeContext);
```
**Key Points:**
- Avoids prop drilling
- Shares data globally
- Provider wraps components
- Consumer/useContext reads value
- Updates trigger re-renders
---


## The Problem: Prop Drilling


### What is Prop Drilling?
**Prop drilling** is passing props through multiple levels of components just to reach a deeply nested child that needs them.


### Example of Prop Drilling
```javascript
// ❌ BAD: Prop drilling
function App() {
  const theme = 'dark';
  return <Header theme={theme} />;
}
function Header({ theme }) {
  return <Navigation theme={theme} />;
}
function Navigation({ theme }) {
  return <NavLink theme={theme} />;
}
function NavLink({ theme }) {
  // Finally uses theme!
  return <div className={theme === 'dark' ? 'dark' : 'light'}>Link</div>;
}
```
**Problems:**
- Passing props through components that don't use them
- Makes code harder to maintain
- Difficult to refactor
- Breaks component encapsulation


### Solution with Context
```javascript
// ✅ GOOD: Context
const ThemeContext = createContext();
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}
function Header() {
  return <Navigation />; // No props needed!
}
function Navigation() {
  return <NavLink />; // No props needed!
}
function NavLink() {
  const theme = useContext(ThemeContext); // Direct access!
  return <div className={theme === 'dark' ? 'dark' : 'light'}>Link</div>;
}
```
**Benefits:**
- No prop drilling
- Direct access to data
- Cleaner component API
- Easy to refactor
---


## Creating Context


### Basic Context Creation
```javascript
import { createContext } from 'react';
// Create context with default value
const ThemeContext = createContext('light');
// Export for use in other components
export default ThemeContext;
```


### Context with Default Value
```javascript
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});
```


### Complete Example
```javascript
import { createContext } from 'react';
export const ThemeContext = createContext('light');
export const UserContext = createContext(null);
export const LanguageContext = createContext('en');
```
---


## Provider and Consumer


### Using Provider
```javascript
import { ThemeContext } from './context';
function App() {
  const theme = 'dark';
  return (
    <ThemeContext.Provider value={theme}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  );
}
```


### Multiple Providers
```javascript
function App() {
  const theme = 'dark';
  const user = { name: 'John' };
  const language = 'en';
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <LanguageContext.Provider value={language}>
          <Content />
        </LanguageContext.Provider>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
```


### Consumer Pattern (Old Way)
```javascript
function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme}>
          Click me
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
```


### useEffect Hook (Modern Way)
```javascript
import { useContext } from 'react';
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button className={theme}>
      Click me
    </button>
  );
}
```
---


## useContext Hook


### Basic Usage
```javascript
import { useContext } from 'react';
import { ThemeContext } from './context';
function Component() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Content</div>;
}
```


### Multiple Contexts
```javascript
function Component() {
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);
  const language = useContext(LanguageContext);
  return (
    <div className={theme}>
      <p>User: {user.name}</p>
      <p>Language: {language}</p>
    </div>
  );
}
```


### Without Provider
```javascript
function Component() {
  // Gets default value when no Provider above
  const theme = useContext(ThemeContext); // Returns 'light'
  return <div>Theme: {theme}</div>;
}
```
---


## Context Patterns


### Pattern 1: Basic Theme Context
```javascript
import { createContext, useContext, useState } from 'react';
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const value = { theme, toggleTheme };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
// Usage
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
    </ThemeProvider>
  );
}
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className={theme}>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </header>
  );
}
```


### Pattern 2: Custom Hook Pattern
```javascript
// Custom hook for context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
// Usage
function Component() {
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  return <div>{user.name}</div>;
}
```


### Pattern 3: Context with State Management
```javascript
import { createContext, useContext, useState, useCallback } from 'react';
const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);
  const value = {
    user,
    login,
    logout,
    updateUser,
    loading
  };
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
// Usage
function LoginButton() {
  const { login, loading } = useUser();
  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```
---


## Theme Switcher Example


### Complete Theme Switcher Implementation
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
// Context
const ThemeContext = createContext();
// Provider Component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);
  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const value = {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
// Custom hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
// Theme Toggle Button
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
// Themed Component
function ThemedCard({ children }) {
  const { theme } = useTheme();
  return (
    <div className={`card ${theme}`}>
      {children}
    </div>
  );
}
// Usage
function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <header>
          <h1>My App</h1>
          <ThemeToggle />
        </header>
        <main>
          <ThemedCard>
            <h2>Welcome</h2>
            <p>This app has a theme switcher!</p>
          </ThemedCard>
        </main>
      </div>
    </ThemeProvider>
  );
}
```


### Advanced Theme Switcher
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#007bff',
    secondary: '#6c757d'
  },
  dark: {
    background: '#212529',
    text: '#ffffff',
    primary: '#0d6efd',
    secondary: '#6c757d'
  },
  blue: {
    background: '#0d6efd',
    text: '#ffffff',
    primary: '#ffffff',
    secondary: '#000000'
  }
};
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('light');
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setThemeName(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('theme', themeName);
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--bg-color', theme.background);
    document.documentElement.style.setProperty('--text-color', theme.text);
    document.documentElement.style.setProperty('--primary-color', theme.primary);
  }, [themeName]);
  const theme = themes[themeName];
  const value = {
    themeName,
    theme,
    setTheme: setThemeName,
    themes: Object.keys(themes)
  };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
function ThemeSelector() {
  const { themeName, setTheme, themes: themeNames } = useTheme();
  return (
    <select value={themeName} onChange={(e) => setTheme(e.target.value)}>
      {themeNames.map(name => (
        <option key={name} value={name}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </option>
      ))}
    </select>
  );
}
```
---


## Advanced Patterns


### Pattern 1: Multiple Contexts
```javascript
// Settings Context
const SettingsContext = createContext();
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: true,
    language: 'en'
  });
  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);
  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
export function useSettings() {
  return useContext(SettingsContext);
}
// Cart Context
const CartContext = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const addItem = useCallback((product) => {
    setItems(prev => [...prev, product]);
  }, []);
  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  return useContext(CartContext);
}
// Usage
function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <Header />
        <Main />
      </CartProvider>
    </SettingsProvider>
  );
}
function Header() {
  const { settings } = useSettings();
  const { total } = useCart();
  return (
    <header>
      <div>Language: {settings.language}</div>
      <div>Cart Total: ${total}</div>
    </header>
  );
}
```


### Pattern 2: Optimized Context
```javascript
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  // Memoize callback functions
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  // Memoize value object
  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  }), [user, login, logout, loading]);
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}
```


### Pattern 3: Context with Reducer
```javascript
import { createContext, useContext, useReducer } from 'react';
const CartContext = createContext();
// Actions
const cartActions = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY'
};
function cartReducer(state, action) {
  switch (action.type) {
    case cartActions.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    case cartActions.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case cartActions.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case cartActions.CLEAR_CART:
      return { items: [] };
    default:
      return state;
  }
}
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const addItem = (item) => dispatch({ type: cartActions.ADD_ITEM, payload: item });
  const removeItem = (id) => dispatch({ type: cartActions.REMOVE_ITEM, payload: id });
  const clearCart = () => dispatch({ type: cartActions.CLEAR_CART });
  const updateQuantity = (id, quantity) => dispatch({
    type: cartActions.UPDATE_QUANTITY,
    payload: { id, quantity }
  });
  const value = {
    ...state,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    total: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0)
  };
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
// Usage
function Product({ product }) {
  const { addItem } = useCart();
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>Add to Cart</button>
    </div>
  );
}
function Cart() {
  const { items, total, removeItem } = useCart();
  return (
    <div>
      <h2>Cart</h2>
      {items.map(item => (
        <div key={item.id}>
          {item.name} - {item.quantity}x ${item.price}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total}</p>
    </div>
  );
}
```
---


## Common Pitfalls


### Pitfall 1: Creating Context Inside Component
```javascript
// ❌ BAD: Context created inside component
function App() {
  const MyContext = createContext(); // Creates new context each render!
  return (
    <MyContext.Provider value="value">
      <Child />
    </MyContext.Provider>
  );
}
// ✅ GOOD: Context created outside
const MyContext = createContext();
function App() {
  return (
    <MyContext.Provider value="value">
      <Child />
    </MyContext.Provider>
  );
}
```


### Pitfall 2: Value Object Recreated Every Render
```javascript
// ❌ BAD: New object every render
function Provider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
// ✅ GOOD: Memoize value
function Provider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
```


### Pitfall 3: Not Using Custom Hook Error Checking
```javascript
// ❌ BAD: No error checking
function Component() {
  const context = useContext(ThemeContext);
  // context might be undefined!
  return <div>{context.theme}</div>;
}
// ✅ GOOD: Error checking in custom hook
function Component() {
  const { theme } = useTheme(); // Custom hook throws error if no provider
  return <div>{theme}</div>;
}
```
---


## Best Practices


### ✅ DO
1. **Create context outside component**
   ```javascript
   const ThemeContext = createContext();
   ```
2. **Use custom hooks for context**
   ```javascript
   export function useTheme() {
     const context = useContext(ThemeContext);
     if (!context) throw new Error('useTheme must be used in Provider');
     return context;
   }
   ```
3. **Memoize context value**
   ```javascript
   const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
   ```
4. **Combine with useCallback**
   ```javascript
   const toggle = useCallback(() => {}, []);
   ```


### ❌ DON'T
1. **Don't create context inside component**
2. **Don't forget to memoize context values**
3. **Don't use context for local state**
4. **Don't create too many contexts**
---


## Real-World Applications


### Application 1: Language/Locale Context
```javascript
const LanguageContext = createContext();
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const translations = {
    en: {
      welcome: 'Welcome',
      goodbye: 'Goodbye'
    },
    es: {
      welcome: 'Bienvenido',
      goodbye: 'Adiós'
    }
  };
  const translate = (key) => translations[lang][key] || key;
  const value = {
    lang,
    setLang,
    translate,
    translations: translations[lang]
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
// Usage
function WelcomeMessage() {
  const { translate } = useLanguage();
  return <h1>{translate('welcome')}</h1>;
}
```


### Application 2: Notification System
```javascript
const NotificationContext = createContext();
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const addNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  }, []);
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  const value = {
    notifications,
    addNotification,
    removeNotification
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
export function useNotifications() {
  return useContext(NotificationContext);
}
// Usage
function MyComponent() {
  const { addNotification } = useNotifications();
  const handleSave = async () => {
    try {
      await saveData();
      addNotification('Data saved successfully!', 'success');
    } catch (error) {
      addNotification('Failed to save data', 'error');
    }
  };
  return <button onClick={handleSave}>Save</button>;
}
```
---


## Interview Preparation


### Common Questions


#### Q1: What is Context API and when should you use it?
**Answer**: Context API allows passing data through component tree without prop drilling. Use it for global state that many components need (theme, user, language, etc.), but not for local component state.


#### Q2: What's the difference between Context and Redux?
**Answer**: Context is built-in to React and simpler, good for small-medium apps. Redux is more powerful with middleware, debugging tools, and better for complex state management in large apps.


#### Q3: How do you prevent unnecessary re-renders with Context?
**Answer**: Memoize context value with useMemo and useCallback for functions, split contexts by concern, and use React.memo for children that consume context.


#### Q4: What happens if you use useContext without a Provider?
**Answer**: Returns the default value passed to createContext. If no default, returns undefined. Custom hooks can throw errors to catch this early.


#### Q5: When should you NOT use Context?
**Answer**: Don't use Context for local component state, data that changes frequently, or when simple prop passing works fine. Consider Redux or Zustand for complex state.
---


## Practice Exercise


### Requirements:
- ✅ Build a complete theme switcher
- ✅ Use Context API for theme management
- ✅ Implement light/dark mode toggle
- ✅ Save theme preference to localStorage
- ✅ Apply theme to all components


### Solution:
See practice file: `day-14/practice/theme-switcher.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **Context API**: Global state management without prop drilling
2. **Provider Pattern**: Wrapping components to provide context
3. **useContext Hook**: Modern way to consume context
4. **Custom Hooks**: Creating reusable context hooks
5. **Theme Switcher**: Real-world example
6. **Best Practices**: Memoization and optimization
7. **Common Pitfalls**: Creating context inside components


### 🎯 Key Concepts
- Context avoids prop drilling
- Provider supplies context value
- useContext consumes context
- Memoize context values
- Use custom hooks for safety
- Split contexts by concern
- Don't overuse Context


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Multiple contexts and composition
- ✅ Context splitting strategies
- ✅ Avoiding prop drilling
- ✅ Context API Part 2
---
**Great work! 🎉 You've mastered Context API!**
**You're now ready for Context API Part 2! 🚀**
---


## Summary Cheat Sheet


### Context API Quick Reference
```javascript
// Create context
const MyContext = createContext(defaultValue);
// Provide context
<MyContext.Provider value={value}>
  {children}
</MyContext.Provider>
// Consume context
const value = useContext(MyContext);
// Custom hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Use in Provider');
  return context;
}
```


### When to Use Context
| Scenario | Solution |
|----------|----------|
| Global theme | ✅ Context |
| User data | ✅ Context |
| Language | ✅ Context |
| Local form state | ❌ useState |
| Component state | ❌ useState |
| Complex state logic | 🟡 Consider Redux |
---
**Complete! You've mastered Context API from basics to advanced patterns! 🎯**
