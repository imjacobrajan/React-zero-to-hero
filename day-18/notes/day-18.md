# Day 18: Component Composition - Building Flexible UIs

## 📋 Table of Contents
- [Introduction](#introduction)
- [Container/Presentational Pattern](#containerpresentational-pattern)
- [Composition vs Inheritance](#composition-vs-inheritance)
- [Children Prop Usage](#children-prop-usage)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Learn component composition patterns to build flexible, reusable UIs.

---

## Container/Presentational Pattern

### Container Components

```javascript
function TodoContainer() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  return <TodoList todos={todos} onAddTodo={addTodo} />;
}
```

### Presentational Components

```javascript
function TodoList({ todos, onAddTodo }) {
  return (
    <div>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      <AddTodoForm onSubmit={onAddTodo} />
    </div>
  );
}
```

---

## Children Prop

```javascript
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Card title="Profile">
      <p>Content here</p>
    </Card>
  );
}
```

---

## Practice Exercise

Refactor TodoApp into container and presentational components.

See practice file: `day-18/practice/component-composition.jsx`

---

## Key Takeaways

- Separate logic from presentation
- Use composition over inheritance
- Leverage children prop

**See you tomorrow for Day 19: Compound Components!**

