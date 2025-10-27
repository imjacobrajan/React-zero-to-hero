# Day 14: Context API - Part 1 - Managing Global State

## 📋 Table of Contents
- [Introduction](#introduction)
- [What is Context API?](#what-is-context-api)
- [The Problem: Prop Drilling](#the-problem-prop-drilling)
- [Creating Context](#creating-context)
- [Provider and Consumer](#provider-and-consumer)
- [useContext Hook](#useeffect-hook)
- [Using Context](#using-context)
- [Context Patterns](#context-patterns)
- [Practice Exercise: Theme Switcher](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 14! Today you'll master **Context API** - React's powerful solution for sharing state globally across components. By the end of today, you'll:
- ✅ Understand the Context API
- ✅ Know when to use Context vs props
- ✅ Create and use Context
- ✅ Use the Provider pattern
- ✅ Build a theme switcher
- ✅ Avoid prop drilling

---

## What is Context API?

### Understanding Context

**Context** provides a way to pass data through the component tree without passing props at every level.

**Analogy**: Think of Context as a **magic bulletin board**:
- One person posts a notice (Provider sets value)
- Anyone can read it (Consumer/useContext reads value)
- No need to pass notes through every person in between

### Before Context: Prop Drilling

```javascript
// ❌ Prop drilling - passing props through every level
function App() {
  const theme = 'dark';
  return <Header theme={theme} />;
}

function Header({ theme }) {
  return <Navigation theme={theme} />;
}

function Navigation({ theme }) {
  return <UserMenu theme={theme} />;
}

function UserMenu({ theme }) {
  return <Button theme={theme} />;
}
```

### With Context: Direct Access

```javascript
// ✅ With Context - direct access without drilling
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  return <Navigation />;
}

function Navigation() {
  return <UserMenu />;
}

function UserMenu() {
  return <Button />;
}

function Button() {
  const theme = useContext(ThemeContext); // Direct access!
  return <button className={theme}>Click</button>;
}
```

---

## The Problem: Prop Drilling

### What is Prop Drilling?

**Prop drilling** occurs when you pass data through multiple component levels that don't use it, just to get it to a deeply nested component.

### Example of Prop Drilling

```javascript
// App passes theme through many levels
function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <div>
      <Header theme={theme} setTheme={setTheme} />
    </div>
  );
}

function Header({ theme, setTheme }) {
  return (
    <div>
      <Navigation theme={theme} setTheme={setTheme} />
    </div>
  );
}

function Navigation({ theme, setTheme }) {
  return (
    <div>
      <UserMenu theme={theme} setTheme={setTheme} />
    </div>
  );
}

function UserMenu({ theme, setTheme }) {
  return <ThemeButton theme={theme} setTheme={setTheme} />;
}

function ThemeButton({ theme, setTheme }) {
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme}
    </button>
  );
}
// Problem: Header, Navigation, UserMenu don't use theme but must pass it!
```

---

## Creating Context

### Basic Context Creation

```javascript
import { createContext } from 'react';

// Create a context
const ThemeContext = createContext();

export default ThemeContext;
```

### Context with Default Value

```javascript
import { createContext } from 'react';

const ThemeContext = createContext('light'); // Default value

export default ThemeContext;
```

### Context with Multiple Values

```javascript
import { createContext } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export default ThemeContext;
```

---

## Provider and Consumer

### Provider Pattern

```javascript
import { createContext } from 'react';

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div>
        <Header />
      </div>
    </ThemeContext.Provider>
  );
}

function Header() {
  return <UserMenu />;
}

function UserMenu() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### Consumer Pattern (Old Way)

```javascript
// Old Consumer pattern (less common now)
function UserMenu() {
  return (
    <ThemeContext.Consumer>
      {({ theme, setTheme }) => (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme}
        </button>
      )}
    </ThemeContext.Consumer>
  );
}
```

---

## useContext Hook

### Basic Usage

```javascript
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Component() {
  const theme = useContext(ThemeContext);
  
  return <div className={theme}>Content</div>;
}
```

### Destructuring from Context

```javascript
function Component() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## Using Context

### Complete Theme Switcher Example

```javascript
// ThemeContext.js
import { createContext, useState } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// App.js
import { ThemeProvider } from './ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <Main />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

// Header.js
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header className={`header-${theme}`}>
      <h1>My App</h1>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </header>
  );
}
```

---

## Context Patterns

### Pattern 1: Custom Provider Component

```javascript
// UserContext.js
import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const login = async (credentials) => {
    setIsLoading(true);
    const user = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }).then(res => res.json());
    setUser(user);
    setIsLoading(false);
  };
  
  const logout = () => {
    setUser(null);
  };
  
  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Usage
function App() {
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
}
```

### Pattern 2: Nested Contexts

```javascript
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <Routes />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

---

## Practice Exercise

### Build a Theme Switcher

**Requirements:**
- ✅ Create ThemeContext
- ✅ Provider component
- ✅ Multiple components using theme
- ✅ Toggle button
- ✅ Persist theme to localStorage

See practice file: `day-14/practice/theme-switcher.jsx`

---

## Key Takeaways

### ✅ What You Learned Today

1. **Context API**: Share state without prop drilling
2. **Provider**: Wrap components to provide context
3. **useContext**: Hook to consume context
4. **Patterns**: Custom providers, multiple contexts
5. **When to Use**: Avoid prop drilling

### 🎯 Key Concepts

- Context solves prop drilling
- Provider wraps components
- useContext reads context
- Use for global state
- Combine multiple contexts

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ Multiple contexts
- ✅ Context composition
- ✅ AuthContext example
- ✅ Advanced Context patterns

---

**Great work! 🎉 See you tomorrow for Day 15: Context API - Part 2!**

