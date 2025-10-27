# Day 1 Interview Questions: React Basics

## JavaScript & React Fundamentals

### 1. What is JSX?
**Answer:** JSX (JavaScript XML) is a syntax extension for JavaScript that lets you write HTML-like code in JavaScript. It's used by React to describe the UI.

```javascript
const element = <h1>Hello, World!</h1>;
```

### 2. What is the difference between JSX and HTML?
**Answer:**
- JSX uses `className` instead of `class`
- JSX uses `htmlFor` instead of `for`
- JSX uses camelCase for attributes
- JSX requires self-closing tags to have a slash
- JSX allows embedding JavaScript expressions with `{}`

### 3. What is a React Component?
**Answer:** A React component is a reusable piece of code that returns JSX. It's like a JavaScript function that returns HTML.

```javascript
function MyComponent() {
  return <div>Hello</div>;
}
```

### 4. What is a React Element?
**Answer:** A React element is the smallest building block in React. It's what a component returns.

### 5. What are Props?
**Answer:** Props (short for properties) are read-only inputs to a component. They are passed from parent to child components.

```javascript
<Component name="John" age={25} />
```

### 6. Can props be modified?
**Answer:** No, props are immutable (read-only) and cannot be modified inside the component.

### 7. What is the difference between props and state?
**Answer:**
- Props are passed from parent to child (downward flow)
- Props are immutable
- State is managed within the component
- State can be changed (mutable)

### 8. What is a Fragment?
**Answer:** A fragment lets you group multiple elements without adding an extra DOM node.

```javascript
<>
  <h1>Title</h1>
  <p>Content</p>
</>
```

### 9. What is the purpose of keys in React?
**Answer:** Keys help React identify which items have changed, are added, or removed. They should be unique and stable.

### 10. What is Virtual DOM?
**Answer:** Virtual DOM is a JavaScript representation of the real DOM. React uses it to improve performance by minimizing direct DOM manipulation.

## Coding Questions

### Q1: Create a component that takes a name prop and displays a greeting.
```javascript
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Q2: Create a UserCard component with name, email, and age.
```javascript
function UserCard({ name, email, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <p>Age: {age}</p>
    </div>
  );
}
```

### Q3: Fix this code:
```javascript
// ❌ WRONG
function Component() {
  return <div class="container">Content</div>;
}

// ✅ CORRECT
function Component() {
  return <div className="container">Content</div>;
}
```

## Practical Scenarios

### Scenario 1: You need to display a user profile
How would you structure the component?

**Answer:** Create a UserProfile component that accepts user data as props and displays it.

### Scenario 2: You need to show different content based on a condition
How would you handle this?

**Answer:** Use conditional rendering with ternary operators or logical AND operator.

```javascript
{isLoggedIn ? <Dashboard /> : <Login />}
{error && <ErrorMessage error={error} />}
```

## Common Mistakes to Avoid

1. Using `class` instead of `className`
2. Modifying props directly
3. Returning multiple elements without a wrapper
4. Not using keys in lists
5. Missing closing tags in JSX
