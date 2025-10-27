# Day 15: Context API - Part 2 - Advanced Patterns & Multiple Contexts

## 📋 Table of Contents
- [Introduction](#introduction)
- [Multiple Contexts](#multiple-contexts)
- [Context Composition](#context-composition)
- [Avoiding Prop Drilling](#avoiding-prop-drilling)
- [Context Best Practices](#context-best-practices)
- [Performance Considerations](#performance-considerations)
- [Practice Exercise: AuthContext](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 15! Today you'll master **advanced Context patterns** including multiple contexts, context composition, and building production-ready context systems. By the end of today, you'll:
- ✅ Use multiple contexts together
- ✅ Compose contexts effectively
- ✅ Avoid prop drilling completely
- ✅ Build AuthContext for authentication
- ✅ Optimize context performance
- ✅ Apply best practices

---

## Multiple Contexts

### Using Multiple Contexts

```javascript
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { UserContext } from './UserContext';
import { LanguageContext } from './LanguageContext';

function MyComponent() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  
  return (
    <div className={`${theme} ${language}`}>
      <p>Welcome, {user.name}</p>
    </div>
  );
}
```

### Providing Multiple Contexts

```javascript
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

---

## Context Composition

### Creating a Master Provider

```javascript
function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```

---

## Avoiding Prop Drilling

### Before Context

```javascript
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  
  return (
    <Layout 
      theme={theme} 
      setTheme={setTheme}
      user={user}
      setUser={setUser}
    />
  );
}
```

### After Context

```javascript
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Layout />
      </UserProvider>
    </ThemeProvider>
  );
}
```

---

## Context Best Practices

### 1. Separate Context Files

```javascript
// ThemeContext.js
export const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  // Provider logic
}

// UserContext.js
export const UserContext = createContext();
export function UserProvider({ children }) {
  // Provider logic
}
```

### 2. Custom Hooks for Context

```javascript
// hooks/useTheme.js
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## Performance Considerations

### Split Contexts for Performance

```javascript
// Good: Split contexts
const ThemeContext = createContext();
const DispatchContext = createContext();

// Only state changes trigger re-renders
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={theme}>
      <DispatchContext.Provider value={setTheme}>
        {children}
      </DispatchContext.Provider>
    </ThemeContext.Provider>
  );
}
```

---

## Practice Exercise

### Create AuthContext for User Authentication

**Requirements:**
- ✅ Login/logout functionality
- ✅ Protected routes
- ✅ User state management
- ✅ Loading states

See practice file: `day-15/practice/auth-context.jsx`

---

## Key Takeaways

- Use multiple contexts for different concerns
- Compose contexts for clean architecture
- Split contexts for performance
- Create custom hooks for context
- Follow best practices

**See you tomorrow for Day 16: Custom Hooks!**

