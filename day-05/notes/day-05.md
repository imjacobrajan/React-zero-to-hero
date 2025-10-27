# Day 5: Event Handling

## Introduction

Welcome to Day 5! Today you'll learn how to handle user interactions in React. By the end of today, you'll:
- ✅ Handle click, change, and submit events (beginner to advanced)
- ✅ Use the event object effectively
- ✅ Pass arguments to event handlers
- ✅ Prevent default browser behavior
- ✅ Build interactive components
- ✅ Master all event types and patterns
- ✅ Understand SyntheticEvent deeply

> **📌 What's NOT in Day 5**: Advanced topics like custom event systems, event delegation, or event emitters. Day 5 focuses on React event handling fundamentals only.
>
> **Day 5 Focus**: Understanding and using React's synthetic event system for user interactions.

**Today's Scope**:
1. onClick, onChange, onSubmit events
2. Event object and preventDefault
3. Passing arguments to handlers
4. Building interactive components
5. Synthetic events deep dive

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

## All Event Types in React

### Mouse Events

```javascript
function MouseEventExample() {
  const [message, setMessage] = useState('');
  
  return (
    <div>
      <button
        onClick={(e) => setMessage('Clicked!')}
        onDoubleClick={(e) => setMessage('Double clicked!')}
        onMouseDown={(e) => setMessage('Mouse down!')}
        onMouseUp={(e) => setMessage('Mouse up!')}
        onMouseEnter={(e) => setMessage('Mouse entered!')}
        onMouseLeave={(e) => setMessage('Mouse left!')}
        onMouseOver={(e) => setMessage('Mouse over!')}
        onMouseOut={(e) => setMessage('Mouse out!')}
        onMouseMove={(e) => setMessage(`Mouse at: ${e.clientX}, ${e.clientY}`)}
      >
        Hover and Click
      </button>
      <p>{message}</p>
    </div>
  );
}
```

### Keyboard Events

```javascript
function KeyboardEventExample() {
  const [key, setKey] = useState('');
  
  return (
    <div>
      <input
        onKeyDown={(e) => setKey(`Key down: ${e.key}`)}
        onKeyUp={(e) => setKey(`Key up: ${e.key}`)}
        onKeyPress={(e) => setKey(`Key press: ${e.key}`)}
        placeholder="Type here..."
      />
      <p>{key}</p>
    </div>
  );
}
```

### Form Events

```javascript
function FormEventExample() {
  const [value, setValue] = useState('');
  
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log('Form submitted:', value);
      }}
    >
      <input
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => console.log('Lost focus')}
        onFocus={(e) => console.log('Gained focus')}
        onInput={(e) => console.log('Input changed')}
        value={value}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Event Pooling and Reuse

### Understanding Event Pooling (React 16 and earlier)

```javascript
// React 16: Events are pooled for performance
function OldReactExample() {
  const handleClick = (e) => {
    // ❌ Event properties might be cleared after function
    console.log(e.type); // OK
    setTimeout(() => {
      console.log(e.type); // Might not work in React 16
    }, 100);
    
    // ✅ Extract values immediately
    const eventType = e.type;
    setTimeout(() => {
      console.log(eventType); // Works!
    }, 100);
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

### React 17+ Events Are Not Pooled

```javascript
// React 17+: Events are not pooled
function ModernReactExample() {
  const handleClick = (e) => {
    // ✅ Works in React 17+
    setTimeout(() => {
      console.log(e.type);
    }, 100);
  };
  
  return <button onClick={handleClick}>Click</button>;
}
```

---

## Event Handler Patterns

### Pattern 1: Inline Handler

```javascript
function InlineExample() {
  return (
    <button onClick={() => console.log('Clicked!')}>
      Click me
    </button>
  );
}
```

### Pattern 2: Named Function

```javascript
function NamedExample() {
  const handleClick = () => {
    console.log('Clicked!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Pattern 3: Function with Event Parameter

```javascript
function EventParameterExample() {
  const handleClick = (event) => {
    console.log('Event:', event);
    console.log('Target:', event.target);
    console.log('Current Target:', event.currentTarget);
  };
  
  return <button onClick={handleClick}>Click me</button>;
}
```

### Pattern 4: Passing Arguments

```javascript
function ArgumentsExample() {
  const handleClick = (name, event) => {
    console.log('Hello,', name);
    console.log('Event:', event);
  };
  
  return (
    <button onClick={(e) => handleClick('Alice', e)}>
      Click me
    </button>
  );
}
```

---

## Common Event Handler Use Cases

### Preventing Default Behavior

```javascript
function LinkExample() {
  const handleLinkClick = (e) => {
    e.preventDefault();
    console.log('Link clicked but no navigation');
  };
  
  return (
    <a href="https://example.com" onClick={handleLinkClick}>
      Click me
    </a>
  );
}

function CheckboxExample() {
  const handleCheckboxChange = (e) => {
    e.preventDefault();
    console.log('Prevented default checkbox behavior');
  };
  
  return (
    <input type="checkbox" onChange={handleCheckboxChange} />
  );
}
```

### Stopping Propagation

```javascript
function PropagationExample() {
  const handleParentClick = () => {
    console.log('Parent clicked');
  };
  
  const handleChildClick = (e) => {
    e.stopPropagation();
    console.log('Child clicked (won\'t bubble)');
  };
  
  return (
    <div onClick={handleParentClick} style={{padding: '20px', background: 'lightblue'}}>
      <button onClick={handleChildClick}>
        Click me (no propagation)
      </button>
    </div>
  );
}
```

### Event Delegation Alternative

```javascript
function EventDelegationExample() {
  const handleListClick = (e) => {
    // Using event delegation
    if (e.target.tagName === 'BUTTON') {
      console.log('Button clicked:', e.target.textContent);
    }
  };
  
  return (
    <ul onClick={handleListClick}>
      <li>
        <button>Button 1</button>
      </li>
      <li>
        <button>Button 2</button>
      </li>
      <li>
        <button>Button 3</button>
      </li>
    </ul>
  );
}
```

---

## Real-World Event Handling Examples

### Example 1: Todo Item with Actions

```javascript
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onEdit(todo.id)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
```

### Example 2: Color Picker

```javascript
function ColorPicker({ colors, onColorSelect }) {
  return (
    <div>
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          style={{
            backgroundColor: color,
            width: '50px',
            height: '50px',
            border: '2px solid black'
          }}
        />
      ))}
    </div>
  );
}
```

### Example 3: Pagination Controls

```javascript
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
```

---

## Event Object Deep Dive

### Common Event Properties

```javascript
function EventPropertiesExample() {
  const handleClick = (e) => {
    // Target and current target
    console.log('target:', e.target);
    console.log('currentTarget:', e.currentTarget);
    
    // Mouse position
    console.log('clientX:', e.clientX);
    console.log('clientY:', e.clientY);
    console.log('pageX:', e.pageX);
    console.log('pageY:', e.pageY);
    
    // Key information (for keyboard events)
    console.log('key:', e.key);
    console.log('code:', e.code);
    
    // Event type
    console.log('type:', e.type);
    
    // Time stamp
    console.log('timestamp:', e.timeStamp);
  };
  
  return <button onClick={handleClick}>Click for details</button>;
}
```

### Working with Event Target

```javascript
function EventTargetExample() {
  const handleInputChange = (e) => {
    const input = e.target;
    console.log('Value:', input.value);
    console.log('Name:', input.name);
    console.log('Type:', input.type);
  };
  
  return (
    <input
      name="username"
      type="text"
      onChange={handleInputChange}
    />
  );
}
```

---

## Advanced Event Patterns

### Conditional Event Handlers

```javascript
function ConditionalHandler({ isActive }) {
  const [message, setMessage] = useState('');
  
  const handleClick = isActive
    ? () => setMessage('Active button clicked!')
    : () => setMessage('Inactive button clicked!');
  
  return (
    <button onClick={handleClick}>
      {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
```

### Multiple Handlers

```javascript
function MultipleHandlersExample() {
  const [log, setLog] = useState([]);
  
  const addToLog = (message) => {
    setLog(prev => [...prev, message]);
  };
  
  return (
    <button
      onClick={(e) => {
        addToLog('Custom handler 1');
        addToLog('Custom handler 2');
      }}
    >
      Multiple actions
    </button>
  );
}
```

### Event Handler Composition

```javascript
function CompositionExample() {
  const handleClick = (e) => {
    console.log('Main click handler');
  };
  
  const handleSpecialClick = (e) => {
    console.log('Special handler');
    handleClick(e); // Compose handlers
  };
  
  return (
    <button onClick={handleSpecialClick}>
      Composed handlers
    </button>
  );
}
```

---

## Best Practices for Event Handling

### ✅ DO

1. Use descriptive handler names (handleClick, onSubmit, etc.)
2. Extract complex logic into separate functions
3. Use arrow functions for inline handlers
4. Pass event object when needed
5. Use preventDefault() judiciously
6. Extract event data early if using async code

### ❌ DON'T

1. Don't create handlers inside render (unless using useCallback)
2. Don't use string refs or findDOMNode
3. Don't mutate events
4. Don't forget to prevent defaults for forms
5. Don't bind in render
6. Don't store event objects for async use (extract values)

---

## Common Mistakes and Solutions

### Mistake 1: Binding in Render

```javascript
// ❌ BAD
function BadExample() {
  return (
    <button onClick={this.handleClick.bind(this)}>
      Click
    </button>
  );
}

// ✅ GOOD
function GoodExample() {
  const handleClick = () => console.log('Clicked');
  return <button onClick={handleClick}>Click</button>;
}
```

### Mistake 2: Passing Handler References

```javascript
// ❌ BAD - Calls immediately
function BadButton({ onClick }) {
  return <button onClick={onClick()}>Click</button>;
}

// ✅ GOOD - Passes function reference
function GoodButton({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}
```

### Mistake 3: Async with Events

```javascript
// ❌ BAD - Event might be reused
function BadExample() {
  const handleClick = (e) => {
    setTimeout(() => {
      console.log(e.target.value);
    }, 1000);
  };
}

// ✅ GOOD - Extract immediately
function GoodExample() {
  const handleClick = (e) => {
    const value = e.target.value;
    setTimeout(() => {
      console.log(value);
    }, 1000);
  };
}
```

---

## Performance Considerations

### Creating Handlers Efficiently

```javascript
// ❌ BAD - New function on every render
function InefficientComponent({ items }) {
  return (
    <div>
      {items.map(item => (
        <button key={item.id} onClick={() => handleClick(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}

// ✅ GOOD - Memoize handlers (covered in Day 12)
function EfficientComponent({ items }) {
  // useCallback covered later
  const handleClick = useCallback((item) => {
    // Handle click
  }, []);
  
  return (
    <div>
      {items.map(item => (
        <button key={item.id} onClick={() => handleClick(item)}>
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

---

## Interview Preparation

### Common Questions About Events

#### Q1: What are synthetic events?

**Answer**: Synthetic events are React's wrapper around native browser events, providing consistent API across browsers and improved performance.

#### Q2: How do you pass arguments to event handlers?

**Answer**: Wrap the handler in an arrow function: `onClick={(e) => handleClick(arg, e)}` or bind the handler: `onClick={handleClick.bind(null, arg)}`.

#### Q3: What's the difference between e.target and e.currentTarget?

**Answer**: e.target is the element that triggered the event. e.currentTarget is the element with the event listener attached.

#### Q4: How do you stop event propagation?

**Answer**: Call `e.stopPropagation()` in the event handler to prevent the event from bubbling up.

#### Q5: When should you use preventDefault()?

**Answer**: When you want to prevent default browser behavior, like form submission, link navigation, or context menus.

---

## More Event Handler Examples

### Calculator Example

```javascript
function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  
  const handleNumberClick = (number) => {
    setDisplay(prev => prev === '0' ? number : prev + number);
  };
  
  const handleOperationClick = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };
  
  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      let result = 0;
      
      switch (operation) {
        case '+': result = previousValue + current; break;
        case '-': result = previousValue - current; break;
        case '*': result = previousValue * current; break;
        case '/': result = previousValue / current; break;
        default: return;
      }
      
      setDisplay(result.toString());
      setOperation(null);
      setPreviousValue(null);
    }
  };
  
  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
  };
  
  return (
    <div className="calculator">
      <div className="display">{display}</div>
      <div className="buttons">
        <button onClick={() => handleClear()}>C</button>
        <button onClick={() => handleOperationClick('/')}>÷</button>
        <button onClick={() => handleOperationClick('*')}>×</button>
        <button onClick={() => handleOperationClick('-')}>−</button>
        <button onClick={() => handleNumberClick('7')}>7</button>
        <button onClick={() => handleNumberClick('8')}>8</button>
        <button onClick={() => handleNumberClick('9')}>9</button>
        <button onClick={() => handleOperationClick('+')}>+</button>
        <button onClick={() => handleNumberClick('4')}>4</button>
        <button onClick={() => handleNumberClick('5')}>5</button>
        <button onClick={() => handleNumberClick('6')}>6</button>
        <button onClick={handleEquals}>=</button>
        <button onClick={() => handleNumberClick('1')}>1</button>
        <button onClick={() => handleNumberClick('2')}>2</button>
        <button onClick={() => handleNumberClick('3')}>3</button>
        <button onClick={() => handleNumberClick('0')} style={{gridColumn: 'span 2'}}>0</button>
      </div>
    </div>
  );
}
```

### Image Gallery

```javascript
function ImageGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };
  
  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <div className="gallery">
      <div className="main-image">
        <button onClick={handlePrev}>‹</button>
        <img src={images[currentIndex].url} alt={images[currentIndex].title} />
        <button onClick={handleNext}>›</button>
      </div>
      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.thumbnail}
            alt={img.title}
            onClick={() => handleThumbnailClick(index)}
            className={index === currentIndex ? 'active' : ''}
          />
        ))}
      </div>
    </div>
  );
}
```

### Rating Component

```javascript
function Rating({ maxStars = 5, onRate }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value) => {
    setRating(value);
    onRate(value);
  };
  
  return (
    <div>
      {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          {star <= (hoverRating || rating) ? '★' : '☆'}
        </button>
      ))}
      <p>{rating > 0 ? `You rated ${rating} stars` : 'No rating yet'}</p>
    </div>
  );
}
```

---

## Keyboard Shortcuts with Events

### Simple Keyboard Shortcuts

```javascript
function KeyboardShortcuts() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '+' || e.key === '=') {
        setCount(prev => prev + 1);
      } else if (e.key === '-') {
        setCount(prev => prev - 1);
      } else if (e.key === 'r' || e.key === 'R') {
        setCount(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  return (
    <div>
      <p>Count: {count}</p>
      <p>Press + or = to increment, - to decrement, R to reset</p>
    </div>
  );
}
```

---

## Custom Event Handlers in Higher-Order Components

### Creating Reusable Event Handlers

```javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

function CounterDisplay() {
  const { count, increment, decrement, reset } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## Event Handling in Lists

### List Item Actions

```javascript
function EditableList({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState(null);
  
  const handleDoubleClick = (id) => {
    setEditingId(id);
  };
  
  const handleKeyPress = (id, e) => {
    if (e.key === 'Enter') {
      const newText = e.target.value;
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, text: newText } : item
      ));
      setEditingId(null);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };
  
  const handleDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onDoubleClick={() => handleDoubleClick(item.id)}>
          {editingId === item.id ? (
            <input
              defaultValue={item.text}
              onKeyDown={(e) => handleKeyPress(item.id, e)}
              autoFocus
            />
          ) : (
            <span>{item.text}</span>
          )}
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## Event Delegation Patterns

### Dynamic Event Handlers

```javascript
function ButtonGrid({ buttons }) {
  const [activeId, setActiveId] = useState(null);
  
  const handleClick = (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      setActiveId(id);
    }
  };
  
  return (
    <div onClick={handleClick}>
      {buttons.map(button => (
        <button
          key={button.id}
          data-id={button.id}
          className={activeId === button.id ? 'active' : ''}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
```

---

## Form Event Handling Deep Dive

### Multiple Input Handling

```javascript
function MultiInputForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Textarea Handling

```javascript
function TextareaExample() {
  const [message, setMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  
  const handleChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
  };
  
  return (
    <div>
      <textarea
        value={message}
        onChange={handleChange}
        rows={5}
        maxLength={500}
      />
      <p>{wordCount} words, {500 - message.length} characters remaining</p>
    </div>
  );
}
```

### Checkbox Handling

```javascript
function CheckboxExample() {
  const [agreed, setAgreed] = useState(false);
  
  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
  };
  
  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={handleCheckboxChange}
        />
        I agree to the terms and conditions
      </label>
      <button type="submit" disabled={!agreed}>
        Submit
      </button>
    </form>
  );
}
```

---

## Event Bubbling and Capture

### Understanding Event Phases

```javascript
function EventPhases() {
  const handleCapture = (e) => {
    console.log('Capture phase:', e.currentTarget.id);
  };
  
  const handleBubble = (e) => {
    console.log('Bubble phase:', e.currentTarget.id);
  };
  
  return (
    <div
      id="parent"
      onClickCapture={handleCapture}
      onClick={handleBubble}
      style={{ padding: '20px', background: 'lightblue' }}
    >
      <div
        id="child"
        onClickCapture={handleCapture}
        onClick={handleBubble}
        style={{ padding: '10px', background: 'lightgreen' }}
      >
        Click me
      </div>
    </div>
  );
}
```

### Stop Propagation Examples

```javascript
function StopPropagationExample() {
  const handleParentClick = () => console.log('Parent clicked');
  const handleChildClick = (e) => {
    e.stopPropagation();
    console.log('Child clicked (no propagation)');
  };
  
  return (
    <div onClick={handleParentClick} style={{ padding: '20px', background: 'lightblue' }}>
      <button onClick={handleChildClick}>
        Click me
      </button>
    </div>
  );
}
```

### Stop Immediate Propagation

```javascript
function StopImmediateExample() {
  const handleClick1 = (e) => {
    console.log('Handler 1');
    e.stopImmediatePropagation();
    console.log('Propagation stopped');
  };
  
  const handleClick2 = () => {
    console.log('Handler 2 (never runs)');
  };
  
  return (
    <button onClick={[handleClick1, handleClick2]}>
      Click me
    </button>
  );
}
```

---

## Touch Events (Mobile)

### Touch Event Handling

```javascript
function TouchExample() {
  const [touches, setTouches] = useState([]);
  
  const handleTouchStart = (e) => {
    console.log('Touch started:', e.touches.length);
  };
  
  const handleTouchMove = (e) => {
    console.log('Touch moved');
  };
  
  const handleTouchEnd = (e) => {
    console.log('Touch ended');
  };
  
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ height: '200px', width: '100%', background: 'lightgray' }}
    >
      Touch this area
    </div>
  );
}
```

---

## Drag and Drop Events (Preview)

```javascript
function DragDropExample() {
  const [draggedItem, setDraggedItem] = useState(null);
  
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    console.log('Dropped:', draggedItem);
    setDraggedItem(null);
  };
  
  return (
    <div>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, 'item1')}
      >
        Drag me
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ height: '100px', background: 'lightblue' }}
      >
        Drop zone
      </div>
    </div>
  );
}
```

---

## Event Timing and Debouncing

### Debouncing Search Input

```javascript
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Perform search when debouncedTerm changes
  useEffect(() => {
    if (debouncedTerm) {
      console.log('Searching for:', debouncedTerm);
    }
  }, [debouncedTerm]);
  
  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## More Practical Event Patterns

### Resize Listener

```javascript
function ResizeListener() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = (e) => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div>
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}
```

### Click Outside Detection

```javascript
function ClickOutside() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(true)}>Open Menu</button>
      {isOpen && (
        <div>Click outside to close</div>
      )}
    </div>
  );
}
```

### Clipboard Events

```javascript
function ClipboardExample() {
  const [text, setText] = useState('');
  const [clipboardText, setClipboardText] = useState('');
  
  const handleCopy = async (e) => {
    e.preventDefault();
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard');
  };
  
  const handlePaste = async (e) => {
    e.preventDefault();
    const data = await navigator.clipboard.readText();
    setClipboardText(data);
  };
  
  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text to copy"
      />
      <button onClick={handleCopy}>Copy</button>
      <button onClick={handlePaste}>Paste</button>
      <p>Pasted: {clipboardText}</p>
    </div>
  );
}
```

---

## State Update Patterns with Events

### Incrementing with Different Steps

```javascript
function StepCounter({ step = 1 }) {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setCount(prev => prev + step);
  };
  
  const handleDecrement = () => {
    setCount(prev => prev - step);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp') handleIncrement();
    if (e.key === 'ArrowDown') handleDecrement();
  };
  
  return (
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <button onClick={handleDecrement}>-{step}</button>
      <span>{count}</span>
      <button onClick={handleIncrement}>+{step}</button>
    </div>
  );
}
```

---

## Resources & Further Reading

### Official Documentation
- [Events](https://react.dev/learn/responding-to-events)
- [SyntheticEvent](https://react.dev/reference/react-dom/components/common#common-props)

### MDN References
- [Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)
- [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)

---

## Key Takeaways

### ✅ What You Learned Today

1. **Event Handling Mastery**: Complete understanding of onClick, onChange, onSubmit, and all event types
2. **Event Object Deep Dive**: Accessing and using event properties effectively  
3. **preventDefault & stopPropagation**: Controlling event behavior and propagation
4. **Passing Arguments**: Multiple patterns for passing data to handlers
5. **Synthetic Events**: React's event system and its benefits
6. **Real-World Patterns**: Calculator, gallery, form handling, and more
7. **Advanced Topics**: Bubbling, capture, touch events, drag & drop, debouncing

### 🎯 Key Concepts

- Use camelCase for React events (onClick, not onclick)
- Event handlers receive an event object
- Use preventDefault() to stop form submissions
- Arrow functions are common for passing arguments
- Synthetic events provide cross-browser compatibility

### 📚 Next Steps

Tomorrow (Day 6) you'll learn:
- ✅ Controlled vs uncontrolled components
- ✅ Form handling with state
- ✅ Input validation
- ✅ Building complex forms
- ✅ Advanced form patterns

---

**Great work! 🎉 You've mastered event handling! See you tomorrow for Day 6: Forms & Controlled Components!**

---

## Summary of Event Handling Patterns

### Quick Reference

#### onClick
```javascript
<button onClick={() => handleClick()}>Click</button>
<button onClick={handleClick}>Click</button>
```

#### onChange
```javascript
<input onChange={(e) => setValue(e.target.value)} />
<input onChange={handleChange} />
```

#### onSubmit
```javascript
<form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
<form onSubmit={handleSubmit}>
```

#### Keyboard Events
```javascript
<input 
  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
  onKeyPress={handleKeyPress}
/>
```

#### Mouse Events
```javascript
<div
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  onMouseDown={handleMouseDown}
  onMouseUp={handleMouseUp}
/>
```

---

## Complete Event Reference

### All Supported Events in React

#### Clipboard Events
- `onCopy` - Fired when user copies content
- `onCut` - Fired when user cuts content  
- `onPaste` - Fired when user pastes content

#### Composition Events
- `onCompositionEnd` - Text composition ends
- `onCompositionStart` - Text composition starts
- `onCompositionUpdate` - Text composition updates

#### Keyboard Events
- `onKeyDown` - Key pressed down
- `onKeyPress` - Key pressed (deprecated)
- `onKeyUp` - Key released

#### Focus Events
- `onFocus` - Element gains focus
- `onBlur` - Element loses focus

#### Form Events
- `onChange` - Input value changes
- `onInput` - Input receives input
- `onInvalid` - Form validation fails
- `onSubmit` - Form submitted

#### Mouse Events
- `onClick` - Element clicked
- `onContextMenu` - Right-click menu
- `onDoubleClick` - Element double-clicked
- `onDrag` - Element dragged
- `onDragEnd` - Drag ends
- `onDragEnter` - Drag enters element
- `onDragExit` - Drag exits element
- `onDragLeave` - Drag leaves element
- `onDragOver` - Dragged over element
- `onDragStart` - Drag starts
- `onDrop` - Element dropped
- `onMouseDown` - Mouse button pressed
- `onMouseEnter` - Mouse enters element
- `onMouseLeave` - Mouse leaves element
- `onMouseMove` - Mouse moves over element
- `onMouseOut` - Mouse moves out of element
- `onMouseOver` - Mouse moves over element
- `onMouseUp` - Mouse button released

#### Touch Events
- `onTouchCancel` - Touch cancelled
- `onTouchEnd` - Touch ends
- `onTouchMove` - Touch moves
- `onTouchStart` - Touch starts

#### Pointer Events
- `onPointerDown` - Pointer pressed
- `onPointerMove` - Pointer moved
- `onPointerUp` - Pointer released
- `onPointerCancel` - Pointer cancelled
- `onGotPointerCapture` - Pointer captured
- `onLostPointerCapture` - Pointer capture lost
- `onPointerEnter` - Pointer enters
- `onPointerLeave` - Pointer leaves
- `onPointerOver` - Pointer over element
- `onPointerOut` - Pointer out of element

#### UI Events
- `onScroll` - Element scrolled

#### Wheel Events
- `onWheel` - Wheel rolled

#### Media Events
- `onAbort` - Media loading aborted
- `onCanPlay` - Can start playing
- `onCanPlayThrough` - Can play through without buffering
- `onDurationChange` - Duration changed
- `onEmptied` - Media emptied
- `onEncrypted` - Media encrypted
- `onEnded` - Media ended
- `onError` - Error occurred
- `onLoadedData` - Data loaded
- `onLoadedMetadata` - Metadata loaded
- `onLoadStart` - Loading started
- `onPause` - Media paused
- `onPlay` - Media playing
- `onPlaying` - Media playing
- `onProgress` - Loading progress
- `onRateChange` - Playback rate changed
- `onSeeked` - Seeking ended
- `onSeeking` - Seeking started
- `onStalled` - Stalled
- `onSuspend` - Loading suspended
- `onTimeUpdate` - Time updated
- `onVolumeChange` - Volume changed
- `onWaiting` - Waiting for data

#### Image Events
- `onLoad` - Image loaded
- `onError` - Image load error

#### Animation Events
- `onAnimationStart` - Animation started
- `onAnimationEnd` - Animation ended
- `onAnimationIteration` - Animation iterated

#### Transition Events
- `onTransitionEnd` - Transition ended

---

## Event Object Properties

### Common Properties

```javascript
function EventProperties({ event }) {
  // Event type
  const { type } = event;
  
  // Target elements
  const { target, currentTarget } = event;
  
  // Time stamp
  const { timeStamp } = event;
  
  // Bubbling
  const { bubbles, cancelable, defaultPrevented } = event;
  
  // Event phase
  const { eventPhase } = event;
  
  console.log({
    type,
    target,
    currentTarget,
    timeStamp,
    bubbles,
    cancelable,
    defaultPrevented,
    eventPhase
  });
}
```

### Methods

```javascript
// Prevent default behavior
e.preventDefault();

// Stop event propagation
e.stopPropagation();

// Stop immediate propagation
e.stopImmediatePropagation();

// Check if default prevented
e.defaultPrevented;

// Check if event bubbles
e.bubbles;
```

---

## Advanced Event Patterns

### Custom Event System (Preview)

> **📌 Note**: Advanced event systems and context communication will be covered in Days 14-15.

For now, focus on understanding React's built-in event system.

---

## Testing Events

### Testing Click Events

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('increments count on click', () => {
  render(<Counter />);
  
  const button = screen.getByText('Increment');
  fireEvent.click(button);
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Testing Form Events

```javascript
test('handles form submission', () => {
  const handleSubmit = jest.fn();
  render(<Form onSubmit={handleSubmit} />);
  
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  
  const button = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(button);
  
  expect(handleSubmit).toHaveBeenCalledWith('test');
});
```

---

## Best Practices Checklist

- [ ] Use camelCase for all event handlers
- [ ] Always prevent default in form submissions
- [ ] Extract event data before async operations
- [ ] Use descriptive handler names
- [ ] Clean up event listeners in useEffect
- [ ] Use stopPropagation when needed
- [ ] Handle errors in event handlers
- [ ] Provide keyboard alternatives
- [ ] Test event handlers thoroughly
- [ ] Consider accessibility in all interactions

---

**This completes Day 5! You've mastered event handling from basics to advanced patterns! 🚀**

**You're now ready to build interactive forms in Day 6! 🎯**

