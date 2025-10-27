# Day 15: Context API - Part 2 - Advanced Patterns & Multiple Contexts
## Introduction
Welcome to Day 15! Today you'll master **advanced Context API patterns** including multiple contexts, context composition, and building production-ready authentication systems. By the end of today, you'll:
- ✅ Use multiple contexts together effectively
- ✅ Compose contexts for clean architecture
- ✅ Split contexts for optimal performance
- ✅ Build a complete AuthContext for user authentication
- ✅ Apply advanced context patterns
- ✅ Optimize context performance
- ✅ Avoid common context pitfalls
- ✅ Implement context testing strategies
---


## Multiple Contexts


### Using Multiple Contexts Together
When building complex applications, you often need multiple contexts for different concerns (theme, user, language, notifications, etc.).
```javascript
import { useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import { UserContext } from './contexts/UserContext';
import { LanguageContext } from './contexts/LanguageContext';
function MyComponent() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, login, logout } = useContext(UserContext);
  const { language, changeLanguage } = useContext(LanguageContext);
  return (
    <div className={`${theme} ${language}`}>
      <p>Welcome, {user?.name}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={logout}>Logout</button>
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
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```


### Complete Multi-Context Setup
```javascript
import { createContext, useContext, useState, useCallback } from 'react';
// Theme Context
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  const setLight = useCallback(() => setTheme('light'), []);
  const setDark = useCallback(() => setTheme('dark'), []);
  const value = useMemo(() => ({
    theme,
    toggleTheme,
    setLight,
    setDark,
    isDark: theme === 'dark'
  }), [theme, toggleTheme, setLight, setDark]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
// User Context
const UserContext = createContext();
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(() => {
    setUser(null);
  }, []);
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
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
// Language Context
const LanguageContext = createContext();
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const translations = {
    en: { welcome: 'Welcome', good: 'Good' },
    es: { welcome: 'Bienvenido', good: 'Bueno' },
    fr: { welcome: 'Bienvenue', good: 'Bon' }
  };
  const t = useCallback((key) => {
    return translations[language][key] || key;
  }, [language]);
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }, []);
  const value = useMemo(() => ({
    language,
    changeLanguage,
    translations: translations[language],
    t
  }), [language, changeLanguage, t]);
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
```


### Using Multiple Contexts in Components
```javascript
function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const { language, changeLanguage, t } = useLanguage();
  return (
    <header className={theme}>
      <div>
        <h1>{t('welcome')}, {user?.name}</h1>
      </div>
      <div>
        <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
        <button onClick={toggleTheme}>Toggle Theme</button>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <Header />
          <Main />
          <Footer />
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
```
---


## Context Composition


### The Problem with Multiple Nested Providers
```javascript
// ❌ BAD: Too many nested providers
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <NotificationProvider>
            <ModalProvider>
              <ToasterProvider>
                <AppContent />
              </ToasterProvider>
            </ModalProvider>
          </NotificationProvider>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
// Messy nesting!
```


### Solution: Composed Provider
```javascript
// ✅ GOOD: Composed provider
function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <NotificationProvider>
            <ModalProvider>
              <ToasterProvider>
                {children}
              </ToasterProvider>
            </ModalProvider>
          </NotificationProvider>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
```


### Advanced Provider Composition
```javascript
// providers/index.js
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <LanguageProvider>
          <NotificationProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </NotificationProvider>
        </LanguageProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
// App.js
import { AppProviders } from './providers';
function App() {
  return (
    <AppProviders>
      <Routes />
    </AppProviders>
  );
}
```


### Conditional Provider Composition
```javascript
function AppProviders({ children }) {
  const [features, setFeatures] = useState({
    analytics: true,
    monitoring: true,
    logging: false
  });
  return (
    <ThemeProvider>
      <UserProvider>
        {features.analytics && <AnalyticsProvider>}
          {features.monitoring && <MonitoringProvider>}
            {features.logging && <LoggingProvider>}
              {children}
            {features.logging && </LoggingProvider>}
          {features.monitoring && </MonitoringProvider>}
        {features.analytics && </AnalyticsProvider>}
      </UserProvider>
    </ThemeProvider>
  );
}
```
---


## Context Splitting Strategies


### Why Split Contexts?
When a context value changes, **all consumers re-render**. By splitting state and dispatch into separate contexts, you can prevent unnecessary re-renders.


### Pattern 1: State and Dispatch Split
```javascript
// ❌ BAD: Single context triggers all re-renders
const AppContext = createContext();
function AppProvider({ children }) {
  const [state, setState] = useState({ count: 0, name: 'John' });
  const value = { state, setState }; // Changing count re-renders everything!
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
// ✅ GOOD: Split contexts
const CountContext = createContext();
const CountDispatchContext = createContext();
const NameContext = createContext();
const NameDispatchContext = createContext();
function AppProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');
  return (
    <CountContext.Provider value={count}>
      <CountDispatchContext.Provider value={setCount}>
        <NameContext.Provider value={name}>
          <NameDispatchContext.Provider value={setName}>
            {children}
          </NameDispatchContext.Provider>
        </NameContext.Provider>
      </CountDispatchContext.Provider>
    </CountContext.Provider>
  );
}
// Hooks
function useCount() {
  return useContext(CountContext);
}
function useCountDispatch() {
  return useContext(CountDispatchContext);
}
function useName() {
  return useContext(NameContext);
}
function useNameDispatch() {
  return useContext(NameDispatchContext);
}
// Usage: Only re-renders when relevant value changes!
function CountDisplay() {
  const count = useCount(); // Only re-renders when count changes
  return <div>Count: {count}</div>;
}
function NameDisplay() {
  const name = useName(); // Only re-renders when name changes
  return <div>Name: {name}</div>;
}
```


### Pattern 2: Granular Context Splitting
```javascript
// Split by feature/concern
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();
const AuthLoadingContext = createContext();
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={{ login, logout }}>
        <AuthLoadingContext.Provider value={loading}>
          {children}
        </AuthLoadingContext.Provider>
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}
export function useAuth() {
  const user = useContext(AuthStateContext);
  const dispatch = useContext(AuthDispatchContext);
  const loading = useContext(AuthLoadingContext);
  return { user, ...dispatch, loading };
}
```


### Pattern 3: Context with Separate State and Actions
```javascript
const ThemeStateContext = createContext();
const ThemeActionsContext = createContext();
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  // Actions don't change, stable reference
  const actions = useMemo(() => ({
    toggle: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark')
  }), []); // No dependencies
  return (
    <ThemeStateContext.Provider value={theme}>
      <ThemeActionsContext.Provider value={actions}>
        {children}
      </ThemeActionsContext.Provider>
    </ThemeStateContext.Provider>
  );
}
function useThemeState() {
  return useContext(ThemeStateContext);
}
function useThemeActions() {
  return useContext(ThemeActionsContext);
}
// Component only re-renders when theme changes, not when actions do
function ThemeDisplay() {
  const theme = useThemeState(); // Only subscribes to theme changes
  const { toggle } = useThemeActions(); // Actions never change
  return (
    <div className={theme}>
      Current theme: {theme}
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```
---


## Performance Optimization


### Problem: Unnecessary Re-renders
```javascript
// ❌ BAD: All consumers re-render on any state change
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [notifications, setNotifications] = useState([]);
  const value = {
    user,
    preferences,
    notifications,
    setUser,
    setPreferences,
    setNotifications
  };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```


### Solution: Memoized Context Value
```javascript
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [notifications, setNotifications] = useState([]);
  // Memoize the value object
  const value = useMemo(() => ({
    user,
    preferences,
    notifications,
    setUser,
    setPreferences,
    setNotifications
  }), [user, preferences, notifications]);
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```


### Solution 2: Separate Contexts by Concern
```javascript
// Better: Separate contexts
const UserContext = createContext();
const PreferencesContext = createContext();
const NotificationsContext = createContext();
function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [notifications, setNotifications] = useState([]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <PreferencesContext.Provider value={{ preferences, setPreferences }}>
        <NotificationsContext.Provider value={{ notifications, setNotifications }}>
          {children}
        </NotificationsContext.Provider>
      </PreferencesContext.Provider>
    </UserContext.Provider>
  );
}
```
---


## AuthContext Implementation


### Complete AuthContext with Authentication
```javascript
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);
  // Update user
  const updateUser = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);
  // Check auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }
  }, []);
  // Memoize context value
  const value = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    loading,
    error,
    isAuthenticated: !!user
  }), [user, login, logout, updateUser, loading, error]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```


### Protected Route Component
```javascript
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}
```


### Login Component
```javascript
function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect handled by AuthProvider
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```
---


## Advanced Patterns


### Pattern 1: Context with Token Refresh
```javascript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // Refresh token automatically
  useEffect(() => {
    if (!token) return;
    const refreshTimer = setInterval(async () => {
      try {
        const response = await fetch('/api/refresh', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        const { newToken } = await response.json();
        setToken(newToken);
        localStorage.setItem('token', newToken);
      } catch (err) {
        logout();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(refreshTimer);
  }, [token]);
  const refreshToken = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const { newToken } = await response.json();
      setToken(newToken);
    } catch (err) {
      logout();
    }
  }, [token]);
  const value = useMemo(() => ({
    user,
    token,
    loading,
    refreshToken,
    isAuthenticated: !!user && !!token
  }), [user, token, loading, refreshToken]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```


### Pattern 2: Context with Role-Based Access
```javascript
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  // Check permission
  const hasPermission = useCallback((permission) => {
    return user?.permissions?.includes(permission);
  }, [user]);
  // Check role
  const hasRole = useCallback((role) => {
    return roles.includes(role);
  }, [roles]);
  // Check multiple roles
  const hasAnyRole = useCallback((roleList) => {
    return roleList.some(role => roles.includes(role));
  }, [roles]);
  const value = useMemo(() => ({
    user,
    roles,
    hasPermission,
    hasRole,
    hasAnyRole,
    isAdmin: roles.includes('admin'),
    isUser: roles.includes('user'),
    isGuest: roles.length === 0
  }), [user, roles, hasPermission, hasRole, hasAnyRole]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
// Usage
function AdminPanel() {
  const { hasPermission, isAdmin } = useAuth();
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }
  return <div>Admin Panel</div>;
}
function EditButton() {
  const { hasPermission } = useAuth();
  if (!hasPermission('edit')) {
    return null;
  }
  return <button>Edit</button>;
}
```
---


## Real-World Applications


### Application 1: Multi-Tenant Context
```javascript
const TenantContext = createContext();
export function TenantProvider({ children }) {
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const switchTenant = useCallback(async (tenantId) => {
    setLoading(true);
    try {
      const tenant = await fetchTenant(tenantId);
      setCurrentTenant(tenant);
      localStorage.setItem('currentTenant', tenantId);
    } finally {
      setLoading(false);
    }
  }, []);
  const value = useMemo(() => ({
    currentTenant,
    tenants,
    switchTenant,
    loading
  }), [currentTenant, tenants, switchTenant, loading]);
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within TenantProvider');
  return context;
}
```
---


## Common Pitfalls


### Pitfall 1: Not Memoizing Context Value
```javascript
// ❌ BAD: New object every render
function Provider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <Context.Provider value={{ user, setUser }}>
      {children}
    </Context.Provider>
  );
}
// ✅ GOOD: Memoized value
function Provider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```


### Pitfall 2: All Context Values in Single Context
```javascript
// ❌ BAD: Everything in one context
const AppContext = createContext();
function Provider({ children }) {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const value = { theme, user, settings, setTheme, setUser, setSettings };
  // Changing theme re-renders everything!
}
// ✅ GOOD: Separate contexts
const ThemeContext = createContext();
const UserContext = createContext();
const SettingsContext = createContext();
```
---


## Best Practices


### ✅ DO
1. **Split contexts by concern**
2. **Memoize context values**
3. **Use custom hooks**
4. **Separate state and dispatch**
5. **Validate context usage**


### ❌ DON'T
1. **Don't create contexts inside components**
2. **Don't include all state in one context**
3. **Don't forget to memoize**
4. **Don't overuse Context**
---


## Interview Preparation


### Common Questions


#### Q1: How do you avoid unnecessary re-renders with Context?
**Answer**: Split contexts by concern, memoize context values with useMemo, separate state and dispatch into different contexts, and use React.memo for components.


#### Q2: When should you split a context into multiple contexts?
**Answer**: When different parts of the context change at different rates, or when some consumers need some data but not all of it.


#### Q3: How do you test Context-based components?
**Answer**: Create mock providers, test custom hooks with renderHook, and test context providers and consumers separately.
---


## Practice Exercise


### Requirements:
- ✅ Create complete AuthContext
- ✅ Implement login/logout
- ✅ Protected routes
- ✅ User state persistence
- ✅ Loading and error states
- ✅ Token refresh mechanism
See practice file: `day-15/practice/auth-context.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **Multiple Contexts**: Using multiple contexts together
2. **Context Composition**: Composing providers cleanly
3. **Context Splitting**: Performance optimization strategies
4. **AuthContext**: Complete authentication system
5. **Performance**: Memoization and optimization
6. **Best Practices**: Production-ready patterns


### 🎯 Key Concepts
- Split contexts for performance
- Memoize context values
- Use custom hooks
- Separate state and dispatch
- Test contexts thoroughly


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Custom hooks creation
- ✅ useToggle hook
- ✅ useLocalStorage hook
- ✅ Extracting reusable logic
---
**Great work! 🎉 You've mastered advanced Context patterns!**
**You're now ready to learn Custom Hooks! 🚀**
---
---


## Complete AuthContext Implementation
```javascript
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Check for stored token on mount
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);
  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      const { user: userData, token } = data;
      setUser(userData);
      localStorage.setItem('auth_token', token);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  // Signup
  const signup = useCallback(async (email, password, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      const { user: userData, token } = data;
      setUser(userData);
      localStorage.setItem('auth_token', token);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    localStorage.removeItem('auth_token');
  }, []);
  // Update user
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);
  // Refresh user data
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error('Refresh failed:', err);
    }
  }, []);
  // Context value
  const value = useMemo(() => ({
    user,
    login,
    logout,
    signup,
    updateUser,
    refreshUser,
    loading,
    error,
    isAuthenticated: !!user
  }), [user, login, logout, signup, updateUser, refreshUser, loading, error]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```
---


## Protected Route Component
```javascript
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
// Usage
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```
---


## Login Component
```javascript
function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const from = location.state?.from?.pathname || '/';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```
---


## Context Testing Strategies


### Testing Context with Mock Provider
```javascript
function createMockAuthProvider(defaultValue = {}) {
  return function MockAuthProvider({ children }) {
    return (
      <AuthContext.Provider value={defaultValue}>
        {children}
      </AuthContext.Provider>
    );
  };
}
// Test component using context
test('should render with authenticated user', () => {
  const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
  render(
    <MockAuthProvider value={{ user: mockUser, isAuthenticated: true }}>
      <ProtectedComponent />
    </MockAuthProvider>
  );
  expect(screen.getByText('Welcome, John')).toBeInTheDocument();
});
```
---


## Migration from Prop Drilling


### Before: Prop Drilling
```javascript
function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  return (
    <Layout 
      user={user} 
      setUser={setUser}
      theme={theme}
      setTheme={setTheme}
    />
  );
}
function Layout({ user, setUser, theme, setTheme }) {
  return (
    <Header 
      user={user} 
      setUser={setUser}
      theme={theme}
      setTheme={setTheme}
    />
    <Main user={user} theme={theme} />
  );
}
function Header({ user, setUser, theme, setTheme }) {
  // User and theme used here
  return (
    <nav>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme}
      </button>
      <div>{user?.name}</div>
    </nav>
  );
}
```


### After: Context
```javascript
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </ThemeProvider>
  );
}
function Layout() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}
function Header() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  // Direct access without props!
  return (
    <nav>
      <button onClick={toggleTheme}>{theme}</button>
      <div>{user?.name}</div>
    </nav>
  );
}
```
---
---


## Real-World Context Applications


### Application 1: E-commerce Cart Context
```javascript
const CartContext = createContext();
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // Add item to cart
  const addItem = useCallback((product) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);
  // Remove item from cart
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);
  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);
  // Clear cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total, itemCount: items.length };
  }, [items]);
  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen,
    ...totals
  }), [items, addItem, removeItem, updateQuantity, clearCart, isOpen, totals]);
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
```
---


### Application 2: Toast Notification Context
```javascript
const ToastContext = createContext();
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);
  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    clearAll,
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration)
  }), [toasts, addToast, removeToast, clearAll]);
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
// Toast Container Component
function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div 
          key={toast.id} 
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
```
---


## Summary Cheat Sheet


### Context API Quick Reference
```javascript
// 1. Creating context
const MyContext = createContext(defaultValue);
// 2. Providing value
<MyContext.Provider value={value}>
  {children}
</MyContext.Provider>
// 3. Consuming value
const value = useContext(MyContext);
// 4. Custom hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) throw new Error('Use in Provider');
  return context;
}
// 5. Multiple contexts
function App() {
  return (
    <Context1.Provider>
      <Context2.Provider>
        <Context3.Provider>
          <AppContent />
        </Context3.Provider>
      </Context2.Provider>
    </Context1.Provider>
  );
}
// 6. Split contexts for performance
<StateContext.Provider value={state}>
  <DispatchContext.Provider value={dispatch}>
    {children}
  </DispatchContext.Provider>
</StateContext.Provider>
// 7. Memoized value
const value = useMemo(() => ({ ... }), [deps]);
```


### When to Use Context vs Props vs Redux
| Scenario | Solution |
|----------|----------|
| Global theme | ✅ Context |
| User data | ✅ Context |
| Language | ✅ Context |
| Local state | ❌ useState |
| Shared state between few components | ❌ Props |
| Complex state with middleware | 🟡 Redux/Zustand |


### Best Practices Checklist
- [ ] Created context outside component
- [ ] Memoized context value with useMemo
- [ ] Used custom hook for context
- [ ] Split contexts by concern
- [ ] Separated state and dispatch
- [ ] Tested context implementation
- [ ] Documented custom hooks
- [ ] Handled edge cases
---
---


## Context Performance Deep Dive


### Measuring Context Performance
```javascript
function ProfiledProvider({ children }) {
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  console.log('Provider rendered:', renderCount);
  const [value, setValue] = useState('value');
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
}
// In consumer component
function Consumer() {
  const value = useContext(MyContext);
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    console.log('Consumer rendered:', renderCount.current);
  });
  return <div>{value}</div>;
}
```


### Context Re-render Patterns
```javascript
// Pattern 1: Every provider change re-renders all consumers
function BadPattern() {
  const [state, setState] = useState({ a: 1, b: 2, c: 3 });
  return (
    <Context.Provider value={state}>
      <ConsumerA /> {/* Re-renders on any state change */}
      <ConsumerB /> {/* Re-renders on any state change */}
      <ConsumerC /> {/* Re-renders on any state change */}
    </Context.Provider>
  );
}
// Pattern 2: Split consumers only subscribe to their context
function GoodPattern() {
  return (
    <ContextA.Provider value={stateA}>
      <ContextB.Provider value={stateB}>
        <ContextC.Provider value={stateC}>
          <ConsumerA /> {/* Only re-renders on stateA change */}
          <ConsumerB /> {/* Only re-renders on stateB change */}
          <ConsumerC /> {/* Only re-renders on stateC change */}
        </ContextC.Provider>
      </ContextB.Provider>
    </ContextA.Provider>
  );
}
```


### Advanced Context Optimization
```javascript
// Context with selector pattern
const StateContext = createContext();
const DispatchContext = createContext();
function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
// Selector hook to prevent unnecessary re-renders
function useSelector(selector) {
  const state = useContext(StateContext);
  return useMemo(() => selector(state), [state, selector]);
}
// Usage - only re-renders if specific slice changes
function ComponentA() {
  const user = useSelector(state => state.user); // Only re-renders when user changes
  return <div>{user.name}</div>;
}
function ComponentB() {
  const count = useSelector(state => state.count); // Only re-renders when count changes
  return <div>{count}</div>;
}
```
---
---


## Context vs Alternatives Comparison


### Context vs Redux vs Zustand
| Feature | Context | Redux Toolkit | Zustand |
|---------|---------|---------------|---------|
| Setup | ✅ Simple | ⚠️ Moderate | ✅ Simple |
| Boilerplate | ✅ Minimal | ⚠️ Some | ✅ Minimal |
| DevTools | ❌ Limited | ✅ Excellent | ✅ Good |
| Middleware | ❌ No | ✅ Yes | ✅ Yes |
| Learning Curve | ✅ Easy | ⚠️ Moderate | ✅ Easy |
| Re-renders | ⚠️ Can cause many | ✅ Controlled | ✅ Controlled |
| Performance | ⚠️ Needs optimization | ✅ Optimized | ✅ Optimized |
| Best For | Small-medium apps | Large apps | Medium apps |


### When to Choose What?
**Choose Context when:**
- Building small to medium apps
- Need simple global state
- Don't need middleware
- Want minimal setup
- Prototyping quickly
**Choose Redux when:**
- Building large apps
- Need time-travel debugging
- Complex state logic
- Multiple developers
- Need middleware
**Choose Zustand when:**
- Want Redux features without complexity
- Need small bundle size
- Medium-sized apps
- Simple learning curve
---
---


## Context Testing Strategies


### Testing Context Providers
```javascript
import { render } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';
test('should provide theme value to children', () => {
  const { getByText } = render(
    <ThemeProvider>
      <div>Theme provider</div>
    </ThemeProvider>
  );
  expect(getByText('Theme provider')).toBeInTheDocument();
});
```


### Testing Components Using Context
```javascript
function MockAuthProvider({ children, value = {} }) {
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
test('should render user when authenticated', () => {
  const user = { id: 1, name: 'John' };
  render(
    <MockAuthProvider value={{ user, isAuthenticated: true }}>
      <UserProfile />
    </MockAuthProvider>
  );
  expect(screen.getByText('John')).toBeInTheDocument();
});
```


### Testing Hook Access to Context
```javascript
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
test('useTheme should return theme value', () => {
  const wrapper = ({ children }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('light');
});
```
---


## SSR Considerations with Context


### Server-Side Rendering Context Setup
```javascript
// Ensure context works on server
function useTheme() {
  const context = useContext(ThemeContext);
  // Handle SSR case
  if (typeof window === 'undefined') {
    return context || { theme: 'light' }; // Default for SSR
  }
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```


### Hydration Safety
```javascript
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light'; // SSR default
    }
    return localStorage.getItem('theme') || 'light';
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);
  // Rest of implementation...
}
```
---


## Debugging Context Issues


### Common Context Problems
```javascript
// Problem 1: Provider missing
// Symptom: "Context value is undefined"
// Solution: Wrap component in Provider
// Problem 2: Re-rendering too often
// Symptom: All consumers re-render on any state change
// Solution: Split contexts, memoize values
// Problem 3: Stale closures
// Symptom: Old values used instead of new
// Solution: Use useCallback, check dependencies
// Problem 4: Infinite loops
// Symptom: Component re-renders infinitely
// Solution: Memoize context value properly
```


### Debugging Tools
```javascript
// Add logging to context
function DebuggedProvider({ children }) {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    console.log('Context state changed:', state);
  }, [state]);
  const value = useMemo(() => ({ state, setState }), [state]);
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```
---


## Production-Ready Context Patterns


### Complete App Context Setup
```javascript
// contexts/index.js
export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { LanguageProvider, useLanguage } from './LanguageContext';
export { ToastProvider, useToast } from './ToastContext';
// App.js
import { 
  AuthProvider, 
  ThemeProvider, 
  LanguageProvider, 
  ToastProvider 
} from './contexts';
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AppProviders>
  );
}
```
---


## Complete! You've mastered Context API Part 2 from basics to advanced patterns! 🎯
