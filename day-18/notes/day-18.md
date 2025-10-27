# Day 18: Component Composition - Mastering Flexible UI Patterns
## Introduction
Welcome to Day 18! Today you'll master **Component Composition** - one of React's most powerful concepts. By the end of today, you'll understand:
- ✅ How to use the children prop effectively
- ✅ Container/Presentational pattern architecture
- ✅ Composition vs inheritance philosophy
- ✅ Flexible component design patterns
- ✅ Building reusable, composable UIs
- ✅ Refactoring monolithic components
- ✅ Real-world composition strategies
---


## The Children Prop


### Basic Children Usage
```javascript
function Card({ children }) {
  return <div className="card">{children}</div>;
}
// Usage
function App() {
  return (
    <Card>
      <h2>Card Title</h2>
      <p>Card content goes here</p>
    </Card>
  );
}
```


### Multiple Children Slots
```javascript
function Layout({ header, sidebar, main, footer }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <div className="body">
        <aside>{sidebar}</aside>
        <main>{main}</main>
      </div>
      <footer>{footer}</footer>
    </div>
  );
}
// Usage
function App() {
  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
      main={<MainContent />}
      footer={<Footer />}
    />
  );
}
```


### Conditional Children
```javascript
function ConditionalWrapper({ condition, wrapper, children }) {
  return condition ? wrapper(children) : children;
}
// Usage
function App() {
  const isLoggedIn = true;
  return (
    <ConditionalWrapper
      condition={isLoggedIn}
      wrapper={children => <div className="authenticated">{children}</div>}
    >
      <Dashboard />
    </ConditionalWrapper>
  );
}
```


### Children with Props
```javascript
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="tabs">
      <div className="tab-list">
        {children.map((child, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={index === activeTab ? 'active' : ''}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
}
// Usage
function App() {
  return (
    <Tabs>
      <div label="First">Content 1</div>
      <div label="Second">Content 2</div>
      <div label="Third">Content 3</div>
    </Tabs>
  );
}
```
---


## Container/Presentational Pattern


### Basic Pattern
```javascript
// Container Component (Smart Component)
function TodoContainer() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  const toggleTodo = (id) => {
    setTodos(todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  return (
    <TodoList
      todos={filteredTodos}
      onAddTodo={addTodo}
      onToggleTodo={toggleTodo}
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}
// Presentational Component (Dumb Component)
function TodoList({ todos, onAddTodo, onToggleTodo, filter, onFilterChange }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTodo(input);
      setInput('');
    }
  };
  return (
    <div className="todo-app">
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>
      <div className="filters">
        <button onClick={() => onFilterChange('all')} className={filter === 'all' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => onFilterChange('active')} className={filter === 'active' ? 'active' : ''}>
          Active
        </button>
        <button onClick={() => onFilterChange('completed')} className={filter === 'completed' ? 'active' : ''}>
          Completed
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => onToggleTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
}
function TodoItem({ todo, onToggle }) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
      />
      <span>{todo.text}</span>
    </li>
  );
}
```


### Advanced Container Pattern
```javascript
// Custom Hook for Logic
function useTodos() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  }, []);
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }, []);
  const removeTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);
  return {
    todos: filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    removeTodo,
    setFilter,
    stats: {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    }
  };
}
// Container Component
function TodoContainer() {
  const todosData = useTodos();
  return <TodoList {...todosData} />;
}
// Presentational Component
function TodoList({ todos, addTodo, toggleTodo, removeTodo, filter, setFilter, stats }) {
  return (
    <div className="todo-app">
      <TodoForm onSubmit={addTodo} />
      <TodoFilters filter={filter} onFilterChange={setFilter} stats={stats} />
      <TodoListItems todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
    </div>
  );
}
function TodoForm({ onSubmit }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
function TodoFilters({ filter, onFilterChange, stats }) {
  return (
    <div className="filters">
      <span>Total: {stats.total}</span>
      <button className={filter === 'all' ? 'active' : ''} onClick={() => onFilterChange('all')}>
        All
      </button>
      <button className={filter === 'active' ? 'active' : ''} onClick={() => onFilterChange('active')}>
        Active ({stats.active})
      </button>
      <button className={filter === 'completed' ? 'active' : ''} onClick={() => onFilterChange('completed')}>
        Completed ({stats.completed})
      </button>
    </div>
  );
}
function TodoListItems({ todos, onToggle, onRemove }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span>{todo.text}</span>
          <button onClick={() => onRemove(todo.id)}>×</button>
        </li>
      ))}
    </ul>
  );
}
```
---


## Composition vs Inheritance


### React Philosophy: Composition
**React favors composition over inheritance.**


### Component Composition Example
```javascript
// Base button
function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
// Composed buttons
function IconButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      <span className="icon">{icon}</span>
      {children}
    </Button>
  );
}
function LinkButton({ href, children, ...props }) {
  return (
    <a href={href} className="btn-link">
      <Button {...props}>{children}</Button>
    </a>
  );
}
// Usage
function App() {
  return (
    <div>
      <Button>Primary</Button>
      <IconButton icon="🔍">Search</IconButton>
      <LinkButton href="/about" variant="secondary">About</LinkButton>
    </div>
  );
}
```


### HOC Pattern
```javascript
function withLoading(Component) {
  return function LoadingWrapper({ loading, ...props }) {
    if (loading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}
function withError(Component) {
  return function ErrorWrapper({ error, ...props }) {
    if (error) {
      return <div>Error: {error}</div>;
    }
    return <Component {...props} />;
  };
}
function UserProfile({ user }) {
  return <div>{user.name}</div>;
}
const UserProfileWithLoading = withLoading(UserProfile);
const UserProfileWithErrorAndLoading = withError(withLoading(UserProfile));
// Usage
function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  return <UserProfileWithErrorAndLoading loading={loading} error={error} user={user} />;
}
```


### Render Props Pattern
```javascript
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(prev => !prev);
  return children({ on, toggle });
}
// Usage
function App() {
  return (
    <Toggle>
      {({ on, toggle }) => (
        <div>
          <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
          {on && <div>Toggle is ON</div>}
        </div>
      )}
    </Toggle>
  );
}
```
---


## Compound Components


### Tabs Component
```javascript
function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || 0);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
function TabList({ children }) {
  const { setActiveTab } = useContext(TabsContext);
  return (
    <div className="tab-list">
      {React.Children.map(children, (child, index) => (
        <div onClick={() => setActiveTab(index)}>
          {child}
        </div>
      ))}
    </div>
  );
}
function TabPanels({ children }) {
  const { activeTab } = useContext(TabsContext);
  return (
    <div className="tab-panels">
      {React.Children.map(children, (child, index) => (
        <div hidden={index !== activeTab}>
          {child}
        </div>
      ))}
    </div>
  );
}
function Tab({ children }) {
  return <div className="tab">{children}</div>;
}
function TabPanel({ children }) {
  return <div className="tab-panel">{children}</div>;
}
// Usage
function App() {
  return (
    <Tabs defaultTab={0}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Content 1</TabPanel>
        <TabPanel>Content 2</TabPanel>
        <TabPanel>Content 3</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
```
---


## Advanced Composition Patterns


### Function as Children (FaaC)
```javascript
function Counter({ children }) {
  const [count, setCount] = useState(0);
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  return children({ count, increment, decrement, reset });
}
// Usage
function App() {
  return (
    <Counter>
      {({ count, increment, decrement, reset }) => (
        <div>
          <div>Count: {count}</div>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </Counter>
  );
}
```
---


## Best Practices


### ✅ DO
1. **Use composition over inheritance**
2. **Keep components small and focused**
3. **Separate logic from presentation**
4. **Use the children prop flexibly**
5. **Create reusable, composable components**
6. **Use custom hooks for shared logic**


### ❌ DON'T
1. **Don't create deeply nested compositions**
2. **Don't over-abstract too early**
3. **Don't mix concerns in components**
4. **Don't create complex prop drilling**
---


## Interview Preparation


### Common Questions


#### Q1: Explain the Container/Presentational pattern
**Answer**: Split logic (Container) from presentation (Presentational). Containers manage state and data fetching; presentational components receive props and render UI.


#### Q2: How do you handle complex layouts?
**Answer**: Break them into smaller components, use composition with the children prop, and create compound components for related UI elements.


#### Q3: When would you use Render Props?
**Answer**: When you need to share stateful logic between components but want flexible rendering. The consumer controls rendering while the provider manages logic.
---


## Practice Exercise


### Requirements:
- ✅ Refactor TodoApp into container/presentational components
- ✅ Extract logic into custom hooks
- ✅ Use composition patterns
- ✅ Create reusable components


### Solution:
See practice file: `day-18/practice/todo-refactored.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **Children Prop**: Flexible composition
2. **Container/Presentational**: Clear separation
3. **Composition**: Building from smaller pieces
4. **Compound Components**: Related UI elements
5. **Render Props**: Flexible logic sharing


### 🎯 Key Concepts
- React favors composition over inheritance
- Container components manage logic
- Presentational components render UI
- Children prop enables flexible composition
- Custom hooks extract reusable logic


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Compound components pattern
- ✅ Building flexible components
- ✅ Advanced composition strategies
- ✅ Creating component APIs
---
**Great work! 🎉 You've mastered Component Composition!**
**You're now ready to learn Compound Components! 🚀**
---


## Summary Cheat Sheet


### Component Composition Patterns
```javascript
// Children prop
<Container>{children}</Container>
// Multiple slots
<Layout header={...} main={...} footer={...} />
// Container/Presentational
<ContainerComponent />
  → <PresentationalComponent data={...} />
// Render props
<Toggle>{({ on, toggle }) => <Button onClick={toggle}>ON</Button>}</Toggle>
// Compound components
<Tabs>
  <TabList><Tab>One</Tab></TabList>
  <TabPanels><TabPanel>Content</TabPanel></TabPanels>
</Tabs>
```
---
---


## Real-World Examples: Complete Applications


### Example 1: Modal Component
```javascript
// Container/Presentational Modal
function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const openModal = (modalContent) => {
    setContent(modalContent);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300); // Wait for animation
  };
  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalDialog onClick={e => e.stopPropagation()}>
            {content}
          </ModalDialog>
        </ModalOverlay>
      )}
    </ModalContext.Provider>
  );
}
function ModalOverlay({ children, onClick }) {
  return (
    <div className="modal-overlay" onClick={onClick}>
      {children}
    </div>
  );
}
function ModalDialog({ children, onClick }) {
  return (
    <div className="modal-dialog" onClick={onClick}>
      {children}
    </div>
  );
}
function useModal() {
  return useContext(ModalContext);
}
// Usage
function App() {
  const { openModal } = useModal();
  return (
    <button onClick={() => openModal(<div>Modal Content</div>)}>
      Open Modal
    </button>
  );
}
function Root() {
  return (
    <ModalProvider>
      <App />
    </ModalProvider>
  );
}
```


### Example 2: Data Table Component
```javascript
// Container for data management
function DataTableContainer({ data, columns, onRowClick }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterValue, setFilterValue] = useState('');
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [data, sortConfig]);
  const filteredData = useMemo(() => {
    if (!filterValue) return sortedData;
    return sortedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  }, [sortedData, filterValue]);
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  return (
    <DataTable
      data={filteredData}
      columns={columns}
      sortConfig={sortConfig}
      onSort={handleSort}
      filterValue={filterValue}
      onFilterChange={setFilterValue}
      onRowClick={onRowClick}
    />
  );
}
// Presentational components
function DataTable({ data, columns, sortConfig, onSort, filterValue, onFilterChange, onRowClick }) {
  return (
    <div className="data-table">
      <TableFilter value={filterValue} onChange={onFilterChange} />
      <table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableHeader
                key={col.key}
                column={col}
                sortConfig={sortConfig}
                onSort={onSort}
              />
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <TableData key={col.key} value={row[col.key]} />
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}
function TableHeader({ column, sortConfig, onSort }) {
  const isSorted = sortConfig.key === column.key;
  return (
    <th
      onClick={() => onSort(column.key)}
      className={isSorted ? `sorted-${sortConfig.direction}` : ''}
    >
      {column.label}
      {isSorted && <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}
```


### Example 3: Form Component with Validation
```javascript
// Form container
function FormContainer({ onSubmit, validation, children }) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] && validation[name]) {
      const error = validation[name](value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validation[name]?.(values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = {};
    Object.keys(validation).forEach(name => {
      const error = validation[name](values[name]);
      if (error) {
        formErrors[name] = error;
      }
    });
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) {
      onSubmit(values);
    }
  };
  return children({
    values,
    errors,
    setValue,
    handleBlur,
    handleSubmit
  });
}
// Usage
function LoginForm() {
  const handleSubmit = (values) => {
    console.log('Submitted:', values);
  };
  const validation = {
    email: (value) => {
      if (!value) return 'Email required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email';
      return null;
    },
    password: (value) => {
      if (!value) return 'Password required';
      if (value.length < 6) return 'Password too short';
      return null;
    }
  };
  return (
    <Form validation={validation} onSubmit={handleSubmit}>
      {({ values, errors, setValue, handleBlur, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <FormField
            name="email"
            type="email"
            value={values.email || ''}
            onChange={e => setValue('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
          />
          <FormField
            name="password"
            type="password"
            value={values.password || ''}
            onChange={e => setValue('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={errors.password}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </Form>
  );
}
```
---


## Advanced Composition: Higher-Order Components


### HOC for Authentication
```javascript
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <div>Please log in</div>;
    }
    return <Component {...props} user={user} />;
  };
}
// Usage
function Profile({ user }) {
  return <div>Welcome, {user.name}</div>;
}
const ProtectedProfile = withAuth(Profile);
function App() {
  return <ProtectedProfile />;
}
```


### HOC for Data Fetching
```javascript
function withData(url) {
  return function(Component) {
    return function DataComponent(props) {
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
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;
      return <Component {...props} data={data} />;
    };
  };
}
// Usage
function UserList({ data }) {
  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
const UserListWithData = withData('/api/users')(UserList);
```
---


## Composition Patterns Deep Dive


### Pattern 1: Slot Pattern
```javascript
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <header>Header</header>
      <aside>Sidebar</aside>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
function AppLayoutWithSlots({ header, sidebar, footer, children }) {
  return (
    <div className="app-layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
}
// Usage
function App() {
  return (
    <AppLayout>
      <h1>Main Content</h1>
    </AppLayout>
  );
}
function AppWithSlots() {
  return (
    <AppLayoutWithSlots
      header={<Header />}
      sidebar={<Sidebar />}
      footer={<Footer />}
    >
      <h1>Main Content</h1>
    </AppLayoutWithSlots>
  );
}
```


### Pattern 2: Flexible Component API
```javascript
function Button({ as: As = 'button', children, ...props }) {
  return <As {...props}>{children}</As>;
}
// Usage
function App() {
  return (
    <div>
      <Button>Regular Button</Button>
      <Button as="a" href="/link">Link Button</Button>
      <Button as={RouterLink} to="/about">Router Link</Button>
    </div>
  );
}
```


### Pattern 3: Compound Components with Context
```javascript
const CardContext = createContext({});
function Card({ children }) {
  const [selected, setSelected] = useState(false);
  return (
    <CardContext.Provider value={{ selected, setSelected }}>
      <div className={`card ${selected ? 'selected' : ''}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}
function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}
function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}
function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}
function CardToggle() {
  const { selected, setSelected } = useContext(CardContext);
  return (
    <button onClick={() => setSelected(!selected)}>
      {selected ? 'Selected' : 'Select'}
    </button>
  );
}
// Usage
function App() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <CardBody>Content</CardBody>
      <CardFooter>
        <CardToggle />
      </CardFooter>
    </Card>
  );
}
```
---


## Real-World Refactoring Example


### Before: Monolithic Component
```javascript
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };
  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });
  return (
    <div className="todo-app">
      <form onSubmit={e => { e.preventDefault(); addTodo(); }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```


### After: Composed Components
```javascript
// 1. Custom hook for business logic
function useTodos() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  }, []);
  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);
  const filteredTodos = useMemo(() => {
    return todos.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });
  }, [todos, filter]);
  return {
    todos: filteredTodos,
    filter,
    addTodo,
    toggleTodo,
    setFilter
  };
}
// 2. Container component
function TodoContainer() {
  const { todos, filter, addTodo, toggleTodo, setFilter } = useTodos();
  return (
    <TodoApp
      todos={todos}
      filter={filter}
      onAddTodo={addTodo}
      onToggleTodo={toggleTodo}
      onFilterChange={setFilter}
    />
  );
}
// 3. Presentational components
function TodoApp({ todos, filter, onAddTodo, onToggleTodo, onFilterChange }) {
  return (
    <div className="todo-app">
      <TodoInput onSubmit={onAddTodo} />
      <TodoFilters filter={filter} onFilterChange={onFilterChange} />
      <TodoList todos={todos} onToggle={onToggleTodo} />
    </div>
  );
}
function TodoInput({ onSubmit }) {
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
}
function TodoFilters({ filter, onFilterChange }) {
  return (
    <div className="filters">
      <FilterButton active={filter === 'all'} onClick={() => onFilterChange('all')}>
        All
      </FilterButton>
      <FilterButton active={filter === 'active'} onClick={() => onFilterChange('active')}>
        Active
      </FilterButton>
      <FilterButton active={filter === 'completed'} onClick={() => onFilterChange('completed')}>
        Completed
      </FilterButton>
    </div>
  );
}
function FilterButton({ active, onClick, children }) {
  return (
    <button className={active ? 'active' : ''} onClick={onClick}>
      {children}
    </button>
  );
}
function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={() => onToggle(todo.id)} />
      ))}
    </ul>
  );
}
function TodoItem({ todo, onToggle }) {
  return (
    <li className={todo.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
      />
      <span>{todo.text}</span>
    </li>
  );
}
```
---


## Common Pitfalls and Solutions


### Pitfall 1: Over-Abstraction
**Problem:**
```javascript
// ❌ Too abstract, hard to understand
function AbstractContainer({ children, logic, render }) {
  return children(logic(render()));
}
```
**Solution:**
```javascript
// ✅ Clear and specific
function TodoContainer() {
  const { todos, addTodo } = useTodos();
  return <TodoList todos={todos} onAdd={addTodo} />;
}
```


### Pitfall 2: Prop Drilling
**Problem:**
```javascript
// ❌ Passing props through multiple levels
<App>
  <Layout user={user} theme={theme}>
    <Header user={user} theme={theme}>
      <Profile user={user} theme={theme} />
    </Header>
  </Layout>
</App>
```
**Solution:**
```javascript
// ✅ Use context or composition
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    <App>
      <Layout>
        <Header>
          <Profile />
        </Header>
      </Layout>
    </App>
  </ThemeContext.Provider>
</UserContext.Provider>
```
---


## Interview Questions with Answers


### Q1: When would you use HOC vs Render Props vs Hooks?
**Answer:**
- **HOC**: When you need to enhance a component with cross-cutting concerns (auth, data fetching)
- **Render Props**: When you need flexible rendering of logic
- **Hooks**: Preferred modern approach for reusable logic, combines better with composition


### Q2: How do you prevent prop drilling?
**Answer:**
1. **Context API**: For global/shared state
2. **Composition**: Pass components as props
3. **Custom hooks**: Extract and share logic
4. **State management**: Redux, Zustand for complex state
---


## Additional Composition Patterns


### Pattern 4: Render Props with Multiple Values
```javascript
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
// Usage
function App() {
  return (
    <Mouse>
      {({ x, y }) => (
        <div>
          Mouse position: {x}, {y}
        </div>
      )}
    </Mouse>
  );
}
```


### Pattern 5: Function as Children with State
```javascript
function CounterWithSteps({ children }) {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  const increment = () => {
    setCount(prev => {
      const newCount = prev + 1;
      setHistory(h => [...h, newCount]);
      return newCount;
    });
  };
  const decrement = () => {
    setCount(prev => {
      const newCount = prev - 1;
      setHistory(h => [...h, newCount]);
      return newCount;
    });
  };
  return children({ count, increment, decrement, history });
}
// Usage
function App() {
  return (
    <CounterWithSteps>
      {({ count, increment, decrement, history }) => (
        <div>
          <div>Count: {count}</div>
          <button onClick={increment}>+</button>
          <button onClick={decrement}>-</button>
          <div>History: {history.join(', ')}</div>
        </div>
      )}
    </CounterWithSteps>
  );
}
```
---


## Advanced Children Patterns


### Pattern 6: React.Children Utilities
```javascript
function ToggleGroup({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const childrenArray = React.Children.toArray(children);
  return (
    <div className="toggle-group">
      {React.Children.map(children, (child, index) => 
        React.cloneElement(child, {
          isActive: index === activeIndex,
          onClick: () => setActiveIndex(index)
        })
      )}
    </div>
  );
}
// Usage
function App() {
  return (
    <ToggleGroup>
      <div>Tab 1</div>
      <div>Tab 2</div>
      <div>Tab 3</div>
    </ToggleGroup>
  );
}
```


### Pattern 7: Slot Pattern with Named Children
```javascript
function Layout({ children }) {
  const slots = {};
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.props.slot) {
      slots[child.props.slot] = child.props.children;
    }
  });
  return (
    <div className="layout">
      <header>{slots.header}</header>
      <main>{slots.main}</main>
      <footer>{slots.footer}</footer>
    </div>
  );
}
// Usage
function App() {
  return (
    <Layout>
      <div slot="header">Header</div>
      <div slot="main">Main Content</div>
      <div slot="footer">Footer</div>
    </Layout>
  );
}
```
---


## State Management Patterns


### Pattern 8: Lift State Up
```javascript
// Before: State in child
function TemperatureInput() {
  const [temperature, setTemperature] = useState('');
  return (
    <input
      type="text"
      value={temperature}
      onChange={e => setTemperature(e.target.value)}
    />
  );
}
// After: State lifted up
function Calculator() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const handleCelsiusChange = (value) => {
    setCelsius(value);
    setFahrenheit(value ? (parseFloat(value) * 9/5 + 32).toFixed(2) : '');
  };
  const handleFahrenheitChange = (value) => {
    setFahrenheit(value);
    setCelsius(value ? ((parseFloat(value) - 32) * 5/9).toFixed(2) : '');
  };
  return (
    <div>
      <TemperatureInput
        value={celsius}
        onChange={handleCelsiusChange}
        scale="celsius"
      />
      <TemperatureInput
        value={fahrenheit}
        onChange={handleFahrenheitChange}
        scale="fahrenheit"
      />
    </div>
  );
}
```


### Pattern 9: State Management with Context
```javascript
const CounterContext = createContext();
function CounterProvider({ children }) {
  const [count, setCount] = useState(0);
  const value = {
    count,
    increment: () => setCount(prev => prev + 1),
    decrement: () => setCount(prev => prev - 1),
    reset: () => setCount(0)
  };
  return (
    <CounterContext.Provider value={value}>
      {children}
    </CounterContext.Provider>
  );
}
function useCounter() {
  return useContext(CounterContext);
}
function Counter() {
  const { count } = useCounter();
  return <div>Count: {count}</div>;
}
function IncrementButton() {
  const { increment } = useCounter();
  return <button onClick={increment}>+</button>;
}
function App() {
  return (
    <CounterProvider>
      <Counter />
      <IncrementButton />
    </CounterProvider>
  );
}
```
---


## Performance Optimization Patterns


### Pattern 10: Memoized Children
```javascript
const ExpensiveChild = React.memo(function({ data }) {
  // Expensive rendering
  return <div>{JSON.stringify(data)}</div>;
});
function Parent({ items }) {
  const [filter, setFilter] = useState('all');
  const filteredItems = useMemo(() => {
    return items.filter(item => filter === 'all' || item.type === filter);
  }, [items, filter]);
  return (
    <div>
      <button onClick={() => setFilter('all')}>All</button>
      <button onClick={() => setFilter('active')}>Active</button>
      {filteredItems.map(item => (
        <ExpensiveChild key={item.id} data={item} />
      ))}
    </div>
  );
}
```
---


## Real-World Application Structure


### E-Commerce Application Structure
```javascript
// 1. Container: Product Management
function ProductContainer() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };
  return (
    <ProductProvider value={{ products, addToCart }}>
      <ProductList products={products} />
      <ShoppingCart cart={cart} />
    </ProductProvider>
  );
}
// 2. Presentational: Product List
function ProductList({ products }) {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
function ProductCard({ product }) {
  const { addToCart } = useProduct();
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
  );
}
// 3. Shopping Cart Component
function ShoppingCart({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.name} - ${item.price}</li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```


### Dashboard Application Structure
```javascript
// Container: Dashboard Layout
function DashboardContainer({ user }) {
  const [widgets, setWidgets] = useState(['sales', 'revenue', 'orders']);
  return (
    <DashboardLayout
      user={user}
      widgets={widgets}
      onAddWidget={(widget) => setWidgets(prev => [...prev, widget])}
      onRemoveWidget={(widget) => setWidgets(prev => prev.filter(w => w !== widget))}
    />
  );
}
// Layout Component
function DashboardLayout({ user, widgets, onAddWidget, onRemoveWidget }) {
  return (
    <div className="dashboard">
      <DashboardHeader user={user} />
      <DashboardBody>
        {widgets.map(widget => (
          <DashboardWidget key={widget} name={widget} onRemove={() => onRemoveWidget(widget)} />
        ))}
        <AddWidget onAdd={onAddWidget} />
      </DashboardBody>
      <DashboardFooter />
    </div>
  );
}
function DashboardHeader({ user }) {
  return (
    <header>
      <h1>Dashboard</h1>
      <div>Welcome, {user.name}</div>
    </header>
  );
}
function DashboardBody({ children }) {
  return <div className="dashboard-body">{children}</div>;
}
function DashboardWidget({ name, onRemove }) {
  return (
    <div className="widget">
      <button onClick={onRemove}>×</button>
      <div>Widget: {name}</div>
    </div>
  );
}
function AddWidget({ onAdd }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <button onClick={() => setShowForm(true)}>+ Add Widget</button>
      {showForm && (
        <form onSubmit={(e) => { e.preventDefault(); onAdd(e.target.widget.value); setShowForm(false); }}>
          <input name="widget" placeholder="Widget name" />
          <button type="submit">Add</button>
        </form>
      )}
    </div>
  );
}
function DashboardFooter() {
  return <footer>© 2024 Dashboard</footer>;
}
```
---


## Composition vs Inheritance: Complete Comparison


### Inheritance Approach (Not Recommended in React)
```javascript
// ❌ Inheritance-based (Java/C# style)
class BaseComponent {
  render() {
    return <div>Base</div>;
  }
}
class DerivedComponent extends BaseComponent {
  render() {
    return <div>Derived: {super.render()}</div>;
  }
}
```


### Composition Approach (React's Way)
```javascript
// ✅ Composition-based (React style)
function BaseComponent({ children }) {
  return <div className="base">{children}</div>;
}
function DerivedComponent({ children }) {
  return (
    <BaseComponent>
      <div className="derived">
        {children}
      </div>
    </BaseComponent>
  );
}
// Or using props
function Button({ variant, children, ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };
  return (
    <button className={`btn ${variants[variant] || ''}`} {...props}>
      {children}
    </button>
  );
}
```
---


## Final Examples: Building a Complete Feature


### Complete Modal System
```javascript
const ModalContext = createContext();
function ModalProvider({ children }) {
  const [modals, setModals] = useState([]);
  const openModal = useCallback((content, id = Date.now()) => {
    setModals(prev => [...prev, { id, content }]);
  }, []);
  const closeModal = useCallback((id) => {
    setModals(prev => prev.filter(m => m.id !== id));
  }, []);
  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);
  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modals.map(modal => (
        <Modal key={modal.id} onClose={() => closeModal(modal.id)}>
          {modal.content}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
}
function useModal() {
  return useContext(ModalContext);
}
function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}
// Usage
function App() {
  const { openModal } = useModal();
  return (
    <div>
      <button onClick={() => openModal(<div>Hello Modal</div>)}>
        Open Modal
      </button>
      <button onClick={() => openModal(<form><input /><button>Submit</button></form>)}>
        Open Form Modal
      </button>
    </div>
  );
}
function Root() {
  return (
    <ModalProvider>
      <App />
    </ModalProvider>
  );
}
```
---


## Summary: Key Takeaways


### ✅ Composition Best Practices
1. **Start with simple components**
2. **Compose larger components from smaller ones**
3. **Use children prop for flexibility**
4. **Extract logic to custom hooks**
5. **Separate concerns: logic vs presentation**
6. **Avoid deep nesting**
7. **Use context for shared state**
8. **Memoize expensive computations**
9. **Test components in isolation**
10. **Refactor when patterns emerge**


### 🎯 When to Use Each Pattern
- **Container/Presentational**: Business logic separation
- **Render Props**: Flexible rendering control
- **Compound Components**: Related UI elements
- **HOC**: Cross-cutting concerns (auth, data fetching)
- **Custom Hooks**: Reusable logic extraction
- **Context**: Shared state across tree
---
**Complete! You've mastered Component Composition from basics to advanced patterns! 🎯**
