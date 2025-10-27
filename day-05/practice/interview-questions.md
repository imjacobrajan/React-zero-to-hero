# Day 5: Event Handling - Interview Questions

## Theory Questions from Top MNCs

### Q1: How are events handled in React? (Google, Meta)
**Answer**: React uses **Synthetic Events** - wrapper around native events for cross-browser compatibility.

```javascript
function handleClick(e) {
  e.preventDefault();
  console.log('Clicked');
}
```

### Q2: What is Synthetic Event? (Amazon, Microsoft)
**Answer**: SyntheticEvent is wrapper object that normalizes events across browsers:

**Features**:
- Same API across browsers
- Pooled for performance (reset after handler)
- `e.nativeEvent` for native event access
- Methods: preventDefault(), stopPropagation()

### Q3: Event object vs native event? (Meta, Netflix)
**Answer**: 
- **SyntheticEvent**: React's wrapper (what you receive)
- **NativeEvent**: Browser's original event (`e.nativeEvent`)

```javascript
function handler(e) {
  e.preventDefault(); // SyntheticEvent method
  e.nativeEvent; // Native browser event
}
```

### Q4: preventDefault vs stopPropagation? (Google, Uber)
**Answer**:
- **preventDefault()**: Prevents default browser action (form submit, link navigation)
- **stopPropagation()**: Stops event bubbling to parent elements

```javascript
function handleSubmit(e) {
  e.preventDefault(); // Don't submit form
  e.stopPropagation(); // Don't bubble to parent
}
```

### Q5: Synthetic Event Pooling? (Netflix, Microsoft)
**Answer**: React reuses event objects for performance. Events are "pooled" and properties reset after handler execution.

**Note**: In React 17+, pooling is removed for modern event handling.

### Q6: Passing data to event handlers? (Apple, Amazon)
**Answer**: Use inline arrow functions or bind:

```javascript
// Method 1: Arrow function
onClick={() => handleClick(data)}

// Method 2: .bind()
onClick={handleClick.bind(null, data)}

// Method 3: Curry function
onClick={handleClick(data)}
```

### Q7: Event delegation in React? (Meta, Google)
**Answer**: React uses event delegation - attaches single listener at document root, not per element.

**Benefits**: Fewer listeners, better performance, automatic cleanup

### Q8: Custom events in React? (Microsoft, Uber)
**Answer**: Create custom events for component communication:

```javascript
// Emit
const customEvent = new CustomEvent('myEvent', { detail: data });
window.dispatchEvent(customEvent);

// Listen
useEffect(() => {
  window.addEventListener('myEvent', handleCustom);
  return () => window.removeEventListener('myEvent', handleCustom);
}, []);
```

---

## Coding Questions from Real Interviews

### Problem 1: Click Event (Facebook)
**Task**: Handle button click

```javascript
function Button() {
  const [count, setCount] = useState(0);
  
  const handleClick = (e) => {
    console.log('Clicked!', e);
    setCount(count + 1);
  };
  
  return <button onClick={handleClick}>Click {count}</button>;
}
```

### Problem 2: Change Event (Google)
**Task**: Handle input change

```javascript
function Input() {
  const [value, setValue] = useState('');
  
  const handleChange = (e) => {
    setValue(e.target.value);
    console.log('Value:', e.target.value);
  };
  
  return <input value={value} onChange={handleChange} />;
}
```

### Problem 3: Form Submit (Amazon)
**Task**: Handle form submission

```javascript
function LoginForm() {
  const [data, setData] = useState({ email: '', password: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log('Submitted:', data);
  };
  
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" onChange={handleChange} />
      <input name="password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Problem 4: Passing Arguments (Netflix)
**Task**: Pass data to handler

```javascript
function List({ items }) {
  const handleClick = (item, index, e) => {
    console.log('Item:', item);
    console.log('Index:', index);
    console.log('Event:', e);
  };
  
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i} onClick={(e) => handleClick(item, i, e)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

### Problem 5: Event Bubbling (Microsoft)
**Task**: Stop propagation

```javascript
function Parent() {
  const handleParent = () => console.log('Parent clicked');
  
  return (
    <div onClick={handleParent}>
      <Child />
    </div>
  );
}

function Child() {
  const handleChild = (e) => {
    e.stopPropagation(); // Don't trigger parent
    console.log('Child clicked');
  };
  
  return <button onClick={handleChild}>Child Button</button>;
}
```

---

## Advanced Questions

### Q1: Event object after async? (Meta)
**Answer**: Access event properties immediately, not in async operations (event pooling):

```javascript
// ❌ Problem: event pooled
const handleClick = (e) => {
  setTimeout(() => console.log(e.target), 1000);
  // e.target might be undefined
};

// ✅ Solution: store values
const handleClick = (e) => {
  const target = e.target;
  setTimeout(() => console.log(target), 1000);
};
```

### Q2: Multiple event listeners? (Google)
**Answer**: Attach multiple handlers or use addEventListener for non-React listeners:

```javascript
useEffect(() => {
  const handleCustom = (e) => console.log('Custom:', e);
  window.addEventListener('custom', handleCustom);
  
  return () => window.removeEventListener('custom', handleCustom);
}, []);
```

### Q3: Keyboard events? (Amazon)
**Answer**: Handle key events:

```javascript
function KeyboardHandler() {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault(); // Prevent save
    }
  };
  
  return <input onKeyDown={handleKeyDown} />;
}
```

### Q4: Mouse events? (Netflix)
**Answer**: Handle mouse interactions:

```javascript
function MouseTracker() {
  const handleMouseMove = (e) => {
    console.log('Mouse at:', e.clientX, e.clientY);
  };
  
  return <div onMouseMove={handleMouseMove}>Hover me</div>;
}
```

---

**🎯 Summary**: Master event handling for interactive React apps!

