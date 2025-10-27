# Day 5: Event Handling

## 📋 Table of Contents
- [Introduction](#introduction)
- [Understanding Events in React](#understanding-events-in-react)
- [onClick, onChange, onSubmit Events](#onclick-onchange-onsubmit-events)
- [Event Object and preventDefault](#event-object-and-preventdefault)
- [Passing Arguments to Handlers](#passing-arguments-to-handlers)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 5! Today you'll learn how to handle user interactions in React. By the end of today, you'll:
- ✅ Handle click, change, and submit events
- ✅ Use the event object effectively
- ✅ Pass arguments to event handlers
- ✅ Prevent default browser behavior
- ✅ Build interactive components

---

## Understanding Events in React

### What are Events?

**Events** are actions that occur in the browser (clicks, typing, submitting forms). In React, you handle these with **event handlers**.

**Analogy**: Think of events like **buttons on a remote control**:
- The button is the element (button, input, form)
- Pressing the button triggers an event
- The event handler is the action that happens (turns on TV, changes channel)

### React's Synthetic Events

React wraps native browser events in **SyntheticEvent** objects for cross-browser compatibility.

```javascript
// Native DOM
button.addEventListener('click', handler);

// React
<button onClick={handler}>Click</button>
```

---

## onClick, onChange, onSubmit Events

### onClick Event

Handle clicks on elements.

```javascript
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

**Inline Handler:**
```javascript
function Button() {
  return <button onClick={() => console.log('Clicked!')}>Click</button>;
}
```

### onChange Event

Handle input changes.

```javascript
function Input() {
  const handleChange = (e) => {
    console.log('Value:', e.target.value);
  };
  
  return <input onChange={handleChange} />;
}
```

### onSubmit Event

Handle form submissions.

```javascript
function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Complete Example

```javascript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Event Object and preventDefault

### The Event Object

Event handlers receive an event object with useful information:

```javascript
function Button() {
  const handleClick = (e) => {
    console.log('Event:', e);
    console.log('Target:', e.target);
    console.log('Type:', e.type);
    console.log('Time:', e.timeStamp);
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

### preventDefault()

Prevents default browser behavior.

```javascript
function Link() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('Link clicked but navigation prevented');
  };
  
  return <a href="/page" onClick={handleClick}>Click me</a>;
}
```

### stopPropagation()

Stops event from bubbling up.

```javascript
function Parent() {
  const handleParentClick = () => console.log('Parent clicked');
  
  return (
    <div onClick={handleParentClick}>
      <button onClick={(e) => {
        e.stopPropagation();
        console.log('Button clicked');
      }}>
        Click
      </button>
    </div>
  );
}
```

---

## Passing Arguments to Handlers

### Method 1: Arrow Functions

```javascript
function ItemList({ items }) {
  const handleClick = (itemId) => {
    console.log('Clicked item:', itemId);
  };
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button onClick={() => handleClick(item.id)}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Method 2: bind()

```javascript
function ItemList({ items }) {
  const handleClick = function(itemId) {
    console.log('Clicked item:', itemId);
  };
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button onClick={handleClick.bind(null, item.id)}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Method 3: Data Attributes

```javascript
function ItemList({ items }) {
  const handleClick = (e) => {
    const itemId = e.target.dataset.id;
    console.log('Clicked item:', itemId);
  };
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button data-id={item.id} onClick={handleClick}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Practice Exercise: Interactive Button

Create a button that changes color and tracks clicks.

### Requirements:
- ✅ Changes color on click
- ✅ Tracks click count
- ✅ Resets on double-click
- ✅ Shows last click time

```javascript
import { useState } from 'react';

function InteractiveButton() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(null);
  const [colors] = useState(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  
  const handleClick = (e) => {
    // Increment count
    setClickCount(count => count + 1);
    
    // Update last click time
    setLastClick(new Date().toLocaleTimeString());
    
    // Change color
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(randomColor);
  };
  
  const handleDoubleClick = () => {
    setClickCount(0);
    setLastClick(null);
    setCurrentColor(colors[0]);
  };
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        style={{
          backgroundColor: currentColor,
          color: 'white',
          padding: '15px 30px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        Click me!
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <p>Clicks: {clickCount}</p>
        {lastClick && <p>Last click: {lastClick}</p>}
        <p>Double-click to reset</p>
      </div>
    </div>
  );
}

export default InteractiveButton;
```

---

## Key Takeaways

### ✅ What You Learned Today

1. **Event Handling**: onClick, onChange, onSubmit
2. **Event Object**: Access event data and properties
3. **preventDefault**: Stop default browser behavior
4. **Passing Arguments**: Multiple methods to pass data
5. **Event Propagation**: Controlling event bubbling

### 🎯 Key Concepts

- Use camelCase for React events (onClick, not onclick)
- Event handlers receive an event object
- Use preventDefault() to stop form submissions
- Arrow functions are common for passing arguments
- Synthetic events provide cross-browser compatibility

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ Controlled vs uncontrolled components
- ✅ Form handling
- ✅ Input validation
- ✅ Building forms with validation

---

**Great work! 🎉 See you tomorrow for Day 6: Forms & Controlled Components!**

