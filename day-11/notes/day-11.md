# Day 11: useRef Hook - Mastering DOM Access and Persistent Values
## Introduction
Welcome to Day 11! Today you'll master **useRef** - React's powerful hook for accessing DOM elements and storing mutable values without triggering re-renders. By the end of today, you'll:
- ✅ Understand what useRef is and when to use it
- ✅ Access DOM elements directly
- ✅ Manage focus and scroll behavior
- ✅ Store mutable values without re-renders
- ✅ Implement imperative parent-child communication
- ✅ Build practical examples with refs
- ✅ Understand callback refs
- ✅ Handle refs in forms and animations
- ✅ Optimize performance with refs
---


## What is useRef?


### Understanding useRef
**useRef** is a React hook that returns a mutable ref object that persists across renders without causing re-renders.
**Analogy**: Think of useRef as a **post-it note**:
- You can write things on it and read them later
- It stays on the same piece of paper across component re-renders
- Changing what's written doesn't trigger a page refresh (re-render)
- Unlike state, it doesn't cause a re-render when changed


### Two Main Purposes:
1. **Accessing DOM elements** directly
2. **Storing mutable values** that don't need to trigger re-renders


### Core Characteristics
```javascript
const ref = useRef(initialValue);
// Properties:
ref.current          // The mutable value
ref.current = value  // Update without re-render
```
**Key Points:**
- Returns an object with `.current` property
- Persists across renders
- Mutating `.current` doesn't trigger re-render
- Initial value only used on first render
---


## Creating and Using useRef


### Basic Syntax
```javascript
import { useRef } from 'react';
function MyComponent() {
  const myRef = useRef(initialValue);
  // Access the value
  console.log(myRef.current);
  // Update the value
  myRef.current = newValue;
}
```


### When to Use useRef vs useState
| Feature | useState | useRef |
|---------|----------|--------|
| Triggers re-render | ✅ Yes | ❌ No |
| Mutable | ❌ No (immutable updates) | ✅ Yes (directly) |
| Persists across renders | ✅ Yes | ✅ Yes |
| Current value access | Direct | `.current` |
| Use Case | UI state | DOM access, timers, previous values |
| Batch updates | ✅ Yes | ❌ No |
| Recommended for | Data that affects render | Data that doesn't affect render |


### Basic Example
```javascript
import { useRef } from 'react';
function RefExample() {
  const countRef = useRef(0);
  const [forceRender, setForceRender] = useState(0);
  const increment = () => {
    countRef.current += 1;
    console.log('Count:', countRef.current); // Won't re-render!
  };
  const forceUpdate = () => {
    setForceRender(prev => prev + 1); // This triggers re-render
  };
  return (
    <div>
      <p>Ref count: {countRef.current}</p>
      <p>Force render: {forceRender}</p>
      <button onClick={increment}>Increment Ref (check console)</button>
      <button onClick={forceUpdate}>Force Update</button>
    </div>
  );
}
```


### Multiple Refs
```javascript
function MultipleRefs() {
  const inputRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const handleSubmit = () => {
    const input = inputRef.current;
    const password = passwordRef.current;
    const email = emailRef.current;
    console.log({
      input: input.value,
      password: password.value,
      email: email.value
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} placeholder="Username" />
      <input type="password" ref={passwordRef} placeholder="Password" />
      <input type="email" ref={emailRef} placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```
---


## Accessing DOM Elements


### Basic DOM Access
```javascript
import { useRef } from 'react';
function InputFocus() {
  const inputRef = useRef(null);
  const handleClick = () => {
    inputRef.current.focus(); // Focus the input
  };
  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Click button to focus" />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```


### Reading DOM Properties
```javascript
function MeasureElement() {
  const divRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const logDimensions = () => {
    const rect = divRef.current.getBoundingClientRect();
    setDimensions({
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y
    });
  };
  return (
    <div>
      <div ref={divRef} style={{ padding: '50px', background: 'lightblue', margin: '20px' }}>
        Click button to measure this div
      </div>
      <button onClick={logDimensions}>Measure</button>
      {dimensions.width > 0 && (
        <div>
          <p>Width: {dimensions.width}px</p>
          <p>Height: {dimensions.height}px</p>
          <p>Position: X={dimensions.x}, Y={dimensions.y}</p>
        </div>
      )}
    </div>
  );
}
```


### Getting Input Values Without Re-renders
```javascript
function ControlledInput() {
  const inputRef = useRef(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [lastValue, setLastValue] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value;
    setLastValue(value);
    setSubmitCount(prev => prev + 1);
    inputRef.current.value = ''; // Clear input
  };
  return (
    <form onSubmit={handleSubmit}>
      <input 
        ref={inputRef} 
        type="text" 
        placeholder="Enter value (doesn't re-render on type)"
      />
      <button type="submit">Submit</button>
      <p>Submitted {submitCount} times</p>
      <p>Last value: {lastValue}</p>
    </form>
  );
}
```


### Selecting Text in Input
```javascript
function SelectTextInput() {
  const inputRef = useRef(null);
  const selectAll = () => {
    inputRef.current.select();
  };
  const selectRange = (start, end) => {
    inputRef.current.setSelectionRange(start, end);
  };
  return (
    <div>
      <input 
        ref={inputRef} 
        defaultValue="Select this text"
        type="text"
      />
      <button onClick={selectAll}>Select All</button>
      <button onClick={() => selectRange(0, 5)}>Select First 5</button>
      <button onClick={() => selectRange(6, 10)}>Select 6-10</button>
    </div>
  );
}
```
---


## Refs vs State


### When to Use Each
**Use useState when:**
- You need the value to trigger a re-render
- The value is part of your UI state
- Users need to see the value update
- The value affects what's rendered
- You need the value to synchronize across components
**Use useRef when:**
- You need to access DOM elements
- You need to store values without re-renders
- You need mutable values that persist across renders
- You're working with timers, intervals, or subscriptions
- You need previous values
- You want to bypass React's render cycle for specific operations


### Comparison Example
```javascript
function StateVsRef() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  const renderCountRef = useRef(0);
  // Track renders
  useEffect(() => {
    renderCountRef.current += 1;
  });
  const updateBoth = () => {
    setStateCount(stateCount + 1); // Triggers re-render
    refCount.current += 1; // No re-render
  };
  console.log('Component rendered', renderCountRef.current, 'times');
  return (
    <div>
      <p>State count: {stateCount}</p>
      <p>Ref count: {refCount.current} (won't update visually)</p>
      <p>Rendered: {renderCountRef.current} times</p>
      <button onClick={updateBoth}>Increment Both</button>
      <p>Open console to see render logs</p>
    </div>
  );
}
```


### Common Pitfall: Using ref for State
```javascript
// ❌ WRONG: Using ref for UI state
function BadExample() {
  const countRef = useRef(0);
  const increment = () => {
    countRef.current += 1;
    // UI won't update! User won't see the change
  };
  return (
    <div>
      <p>Count: {countRef.current}</p> {/* Won't update! */}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
// ✅ CORRECT: Using state for UI
function GoodExample() {
  const [count, setCount] = useState(0);
  const increment = () => {
    setCount(count + 1); // Triggers re-render, UI updates
  };
  return (
    <div>
      <p>Count: {count}</p> {/* Updates correctly! */}
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```


### Combining State and Refs
```javascript
function SmartForm() {
  const [submitCount, setSubmitCount] = useState(0);
  const formRef = useRef(null);
  const formDataRef = useRef({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Store in ref without re-render
    formDataRef.current = {
      ...formDataRef.current,
      [name]: value
    };
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formDataRef.current);
    setSubmitCount(prev => prev + 1);
    formRef.current.reset();
    formDataRef.current = {};
  };
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" />
      <button type="submit">Submit ({submitCount})</button>
    </form>
  );
}
```
---


## Focus Management


### Auto-Focus on Mount
```javascript
function AutoFocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus(); // Focus when component mounts
  }, []);
  return <input ref={inputRef} placeholder="Auto-focused on mount" />;
}
```


### Programmatic Focus Management
```javascript
function FocusManager() {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const [focusedElement, setFocusedElement] = useState('none');
  const focusInput = () => {
    inputRef.current?.focus();
    setFocusedElement('input');
  };
  const focusButton = () => {
    buttonRef.current?.focus();
    setFocusedElement('button');
  };
  const handleBlur = () => setFocusedElement('none');
  return (
    <div>
      <input 
        ref={inputRef} 
        onBlur={handleBlur}
        placeholder="Input" 
      />
      <button 
        ref={buttonRef} 
        onClick={focusInput}
        onBlur={handleBlur}
      >
        Focus Input
      </button>
      <button onClick={focusButton}>Focus Button</button>
      <p>Currently focused: {focusedElement}</p>
    </div>
  );
}
```


### Focus Trap Pattern
```javascript
function Modal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);
  const lastFocusRef = useRef(null);
  const previousActiveElement = useRef(null);
  useEffect(() => {
    if (isOpen) {
      // Save the previously active element
      previousActiveElement.current = document.activeElement;
      // Focus first element in modal
      firstFocusRef.current?.focus();
      // Trap focus inside modal
      const handleTab = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          // Shift + Tab (backwards)
          if (document.activeElement === firstFocusRef.current) {
            e.preventDefault();
            lastFocusRef.current.focus();
          }
        } else {
          // Tab (forwards)
          if (document.activeElement === lastFocusRef.current) {
            e.preventDefault();
            firstFocusRef.current.focus();
          }
        }
      };
      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleTab);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleTab);
        document.removeEventListener('keydown', handleEscape);
        // Return focus to previous element
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button ref={firstFocusRef}>First Button</button>
        <div>Modal content goes here</div>
        <button>Middle Button</button>
        <button ref={lastFocusRef} onClick={onClose}>
          Close Modal
        </button>
      </div>
    </div>
  );
}
```


### Form Validation with Focus
```javascript
function ValidatedForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [errors, setErrors] = useState({});
  const validateAndFocus = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
    if (field === 'name') nameRef.current?.focus();
    if (field === 'email') emailRef.current?.focus();
    if (field === 'password') passwordRef.current?.focus();
    if (field === 'confirmPassword') confirmPasswordRef.current?.focus();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (!name) {
      validateAndFocus('name', 'Name is required');
      return;
    }
    if (!email.includes('@')) {
      validateAndFocus('email', 'Invalid email');
      return;
    }
    if (password.length < 8) {
      validateAndFocus('password', 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      validateAndFocus('confirmPassword', 'Passwords do not match');
      return;
    }
    alert('Form is valid!');
    setErrors({});
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input 
          ref={nameRef} 
          type="text" 
          placeholder="Name"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>
      <div>
        <input 
          ref={emailRef} 
          type="email" 
          placeholder="Email"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>
      <div>
        <input 
          ref={passwordRef} 
          type="password" 
          placeholder="Password"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-msg">{errors.password}</span>}
      </div>
      <div>
        <input 
          ref={confirmPasswordRef} 
          type="password" 
          placeholder="Confirm Password"
          className={errors.confirmPassword ? 'error' : ''}
        />
        {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```
---


## Scroll Management


### Scroll to Element
```javascript
function ScrollList() {
  const itemsRef = useRef([]);
  const scrollRef = useRef(null);
  const scrollToItem = (index) => {
    itemsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };
  const scrollToTop = () => {
    scrollRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const scrollToBottom = () => {
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  };
  return (
    <div>
      <div className="controls">
        <button onClick={() => scrollToItem(0)}>To First</button>
        <button onClick={() => scrollToItem(5)}>To Item 5</button>
        <button onClick={() => scrollToItem(9)}>To Last</button>
        <button onClick={scrollToTop}>To Top</button>
        <button onClick={scrollToBottom}>To Bottom</button>
      </div>
      <div ref={scrollRef} style={{ height: '300px', overflow: 'auto', border: '1px solid #ccc' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div 
            key={i}
            ref={el => itemsRef.current[i] = el}
            style={{ padding: '20px', margin: '10px', background: '#f0f0f0' }}
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
```


### Scroll to Top Button
```javascript
function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);
  const pageRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (pageRef.current.scrollTop > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    if (pageRef.current) {
      pageRef.current.addEventListener('scroll', handleScroll);
      return () => pageRef.current.removeEventListener('scroll', handleScroll);
    }
  }, []);
  const scrollToTop = () => {
    pageRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <div ref={pageRef} style={{ height: '100vh', overflow: 'auto', position: 'relative' }}>
      {Array.from({ length: 100 }, (_, i) => (
        <div key={i} style={{ padding: '50px' }}>
          Content {i + 1}
        </div>
      ))}
      {showButton && (
        <button 
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ↑ Back to Top
        </button>
      )}
    </div>
  );
}
```


### Infinite Scroll with Refs
```javascript
function InfiniteScroll({ items }) {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, 10));
  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  useEffect(() => {
    // Create new observer
    observerRef.current = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setVisibleItems(prev => {
          const nextBatch = items.slice(prev.length, prev.length + 10);
          if (nextBatch.length === 0) return prev;
          return [...prev, ...nextBatch];
        });
      }
    }, {
      threshold: 0.1
    });
    // Observe the loader
    if (loaderRef.current) {
      observerRef.current.observe(loaderRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items, visibleItems.length]);
  return (
    <div>
      <h2>Scroll down to load more</h2>
      <div style={{ maxHeight: '500px', overflow: 'auto' }}>
        {visibleItems.map(item => (
          <div key={item.id} style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
            {item.content}
          </div>
        ))}
        {visibleItems.length < items.length && (
          <div ref={loaderRef} style={{ padding: '20px', textAlign: 'center' }}>
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
}
```


### Horizontal Scroll with Navigation
```javascript
function HorizontalScroll() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < (container.scrollWidth - container.clientWidth)
    );
  };
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      checkScrollability();
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, []);
  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  };
  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  };
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <button onClick={scrollLeft} disabled={!canScrollLeft}>
          ← Left
        </button>
        <button onClick={scrollRight} disabled={!canScrollRight}>
          Right →
        </button>
      </div>
      <div 
        ref={scrollContainerRef} 
        style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '10px',
          padding: '10px',
          border: '1px solid #ccc'
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ minWidth: '200px', padding: '20px', background: '#f0f0f0' }}>
            Item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
```
---


## Measuring DOM Elements


### Get Element Dimensions
```javascript
function ResizableComponent() {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const measure = () => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  };
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  return (
    <div>
      <div 
        ref={ref} 
        style={{ 
          padding: '50px', 
          background: 'lightblue',
          minWidth: '200px',
          minHeight: '200px'
        }}
      >
        Resize window to see changes
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>Width: {dimensions.width.toFixed(0)}px</p>
        <p>Height: {dimensions.height.toFixed(0)}px</p>
        <button onClick={measure}>Re-measure</button>
      </div>
    </div>
  );
}
```


### Dynamic Height Detection
```javascript
function DynamicHeight({ children, isExpanded }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');
  useEffect(() => {
    if (contentRef.current) {
      const newHeight = isExpanded 
        ? `${contentRef.current.scrollHeight}px`
        : '0px';
      setHeight(newHeight);
    }
  }, [isExpanded, children]);
  return (
    <div 
      ref={contentRef} 
      style={{ 
        height, 
        overflow: 'hidden',
        transition: 'height 0.3s ease',
        backgroundColor: '#f0f0f0',
        padding: isExpanded ? '20px' : '0',
        margin: '10px 0'
      }}
    >
      {children}
    </div>
  );
}
// Usage
function CollapsibleSection() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Collapse' : 'Expand'}
      </button>
      <DynamicHeight isExpanded={isOpen}>
        <p>This content can expand and collapse smoothly.</p>
        <p>The height is dynamically calculated based on content.</p>
        <p>No fixed height needed!</p>
      </DynamicHeight>
    </div>
  );
}
```


### Measuring Scroll Position
```javascript
function ScrollPosition() {
  const containerRef = useRef(null);
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    percentage: 0
  });
  useEffect(() => {
    const container = containerRef.current;
    const updateScrollInfo = () => {
      if (container) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const percentage = ((scrollTop / (scrollHeight - clientHeight)) * 100).toFixed(1);
        setScrollInfo({
          scrollTop,
          scrollHeight,
          clientHeight,
          percentage
        });
      }
    };
    if (container) {
      container.addEventListener('scroll', updateScrollInfo);
      updateScrollInfo();
      return () => container.removeEventListener('scroll', updateScrollInfo);
    }
  }, []);
  return (
    <div>
      <div style={{ marginBottom: '10px', padding: '10px', background: '#f0f0f0' }}>
        <p>Scroll Top: {scrollInfo.scrollTop}px</p>
        <p>Scroll Height: {scrollInfo.scrollHeight}px</p>
        <p>Client Height: {scrollInfo.clientHeight}px</p>
        <p>Scroll Percentage: {scrollInfo.percentage}%</p>
      </div>
      <div 
        ref={containerRef} 
        style={{ height: '300px', overflow: 'auto', border: '1px solid #ccc' }}
      >
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} style={{ padding: '10px' }}>
            Item {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
```


### Element Position Tracking
```javascript
function PositionTracker() {
  const elementRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  useEffect(() => {
    const updatePosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setPosition({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        });
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);
  return (
    <div>
      <div style={{ position: 'fixed', top: '10px', right: '10px', background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p>X: {position.x.toFixed(0)}</p>
        <p>Y: {position.y.toFixed(0)}</p>
        <p>Width: {position.width.toFixed(0)}</p>
        <p>Height: {position.height.toFixed(0)}</p>
      </div>
      <div style={{ marginTop: '100px' }}>
        <div 
          ref={elementRef} 
          style={{ 
            width: '200px', 
            height: '150px', 
            background: '#007bff',
            margin: '20px'
          }}
        >
          Track me!
        </div>
      </div>
    </div>
  );
}
```
---


## Imperative Handle Pattern


### Using useImperativeHandle
```javascript
import { forwardRef, useImperativeHandle, useRef } from 'react';
// Child component with custom methods
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Expose specific methods
    focus: () => inputRef.current.focus(),
    blur: () => inputRef.current.blur(),
    getValue: () => inputRef.current.value,
    setValue: (value) => inputRef.current.value = value,
    select: () => inputRef.current.select(),
    clear: () => {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} {...props} />;
});
// Parent component
function Parent() {
  const inputRef = useRef(null);
  const handleGetValue = () => {
    const value = inputRef.current.getValue();
    alert(`Value: ${value}`);
  };
  const handleSetValue = () => {
    inputRef.current.setValue('Hello from parent!');
  };
  const handleClear = () => {
    inputRef.current.clear();
  };
  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Type something..." />
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={handleGetValue}>Get Value</button>
        <button onClick={handleSetValue}>Set Value</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={() => inputRef.current.select()}>Select All</button>
      </div>
    </div>
  );
}
```


### Advanced useImperativeHandle
```javascript
const VideoPlayer = forwardRef(({ src }, ref) => {
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    toggle: () => {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    },
    jump: (seconds) => {
      videoRef.current.currentTime += seconds;
    },
    setVolume: (volume) => {
      videoRef.current.volume = volume;
    },
    getCurrentTime: () => videoRef.current.currentTime,
    getDuration: () => videoRef.current.duration
  }));
  return <video ref={videoRef} src={src} controls width="400" />;
});
function VideoController() {
  const playerRef = useRef(null);
  return (
    <div>
      <VideoPlayer ref={playerRef} src="video.mp4" />
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <button onClick={() => playerRef.current?.play()}>Play</button>
        <button onClick={() => playerRef.current?.pause()}>Pause</button>
        <button onClick={() => playerRef.current?.toggle()}>Toggle</button>
        <button onClick={() => playerRef.current?.jump(-10)}>-10s</button>
        <button onClick={() => playerRef.current?.jump(10)}>+10s</button>
        <button onClick={() => playerRef.current?.setVolume(0.5)}>Volume 50%</button>
        <button onClick={() => {
          const time = playerRef.current?.getCurrentTime();
          const duration = playerRef.current?.getDuration();
          alert(`Time: ${time?.toFixed(1)}s / Duration: ${duration?.toFixed(1)}s`);
        }}>Info</button>
      </div>
    </div>
  );
}
```
---


## Common useRef Use Cases


### 1. Storing Previous Values
```javascript
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
function PreviousValue({ value }) {
  const prevValue = usePrevious(value);
  return (
    <div>
      <p>Current: {value}</p>
      <p>Previous: {prevValue ?? 'none'}</p>
      <p>Changed: {prevValue !== undefined && prevValue !== value ? '✓' : '✗'}</p>
    </div>
  );
}
```


### 2. Interval/Timer Management
```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const start = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsed);
    }, 1000);
  };
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  };
  const reset = () => {
    stop();
    setSeconds(0);
    startTimeRef.current = null;
  };
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={start} disabled={isRunning}>Start</button>
        <button onClick={stop} disabled={!isRunning}>Stop</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
```


### 3. Storing Subscription References
```javascript
function DataSubscriber({ userId }) {
  const [data, setData] = useState(null);
  const subscriptionRef = useRef(null);
  useEffect(() => {
    // Subscribe to data stream
    subscriptionRef.current = subscribeToData(userId, (newData) => {
      setData(newData);
    });
    return () => {
      // Cleanup subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [userId]);
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```


### 4. Avoiding Re-renders with Callback Refs
```javascript
function CallbackRef() {
  const [height, setHeight] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const measureRef = useCallback((node) => {
    if (node !== null) {
      const newHeight = node.getBoundingClientRect().height;
      if (newHeight !== height) {
        setHeight(newHeight);
      }
    }
  }, [height]);
  useEffect(() => {
    setRenderCount(prev => prev + 1);
  });
  return (
    <div>
      <div ref={measureRef}>Measure this div</div>
      <p>Height: {height}px</p>
      <p>Render count: {renderCount}</p>
    </div>
  );
}
```


### 5. Counting Renders
```javascript
function RenderCounter() {
  const renderCountRef = useRef(0);
  const [value, setValue] = useState(0);
  renderCountRef.current += 1;
  return (
    <div>
      <p>Value: {value}</p>
      <p>Times rendered: {renderCountRef.current}</p>
      <button onClick={() => setValue(prev => prev + 1)}>Increment</button>
      <button onClick={() => setValue(prev => prev)}>Set Same Value</button>
    </div>
  );
}
```


### 6. Previous State Comparison
```javascript
function StateComparison() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  const directionRef = useRef('equal');
  useEffect(() => {
    if (prevCountRef.current !== undefined) {
      if (count > prevCountRef.current) {
        directionRef.current = 'increasing';
      } else if (count < prevCountRef.current) {
        directionRef.current = 'decreasing';
      } else {
        directionRef.current = 'equal';
      }
    }
    prevCountRef.current = count;
  }, [count]);
  return (
    <div>
      <p>Count: {count}</p>
      <p>Direction: {directionRef.current}</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
        <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
        <button onClick={() => setCount(prev => prev)}>Same</button>
      </div>
    </div>
  );
}
```
---


## Advanced Patterns


### Custom useFocus Hook
```javascript
function useFocus() {
  const ref = useRef(null);
  const setFocus = () => {
    ref.current?.focus();
  };
  const setBlur = () => {
    ref.current?.blur();
  };
  const isFocused = () => {
    return document.activeElement === ref.current;
  };
  return [ref, { setFocus, setBlur, isFocused }];
}
function InputWithCustomFocus() {
  const [inputRef, { setFocus, setBlur, isFocused }] = useFocus();
  return (
    <div>
      <input ref={inputRef} placeholder="Click buttons to control focus" />
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={setFocus}>Focus</button>
        <button onClick={setBlur}>Blur</button>
        <button onClick={() => alert(isFocused())}>Check Focus</button>
      </div>
    </div>
  );
}
```


### Custom useClickOutside Hook
```javascript
function useClickOutside(onClickOutside) {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClickOutside]);
  return ref;
}
function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside(() => setIsOpen(false));
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'} Dropdown
      </button>
      {isOpen && (
        <div 
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '40px',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            minWidth: '150px'
          }}
        >
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </div>
      )}
    </div>
  );
}
```


### Custom useHover Hook
```javascript
function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return [ref, isHovered];
}
function HoverableElement() {
  const [ref, isHovered] = useHover();
  return (
    <div 
      ref={ref}
      style={{
        padding: '20px',
        background: isHovered ? '#007bff' : '#f0f0f0',
        color: isHovered ? '#fff' : '#000',
        transition: 'all 0.3s',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      {isHovered ? 'Hovered!' : 'Hover over me'}
    </div>
  );
}
```


### Custom useElementSize Hook
```javascript
function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);
  return [ref, size];
}
function ResponsiveComponent() {
  const [ref, { width, height }] = useElementSize();
  return (
    <div>
      <div ref={ref} style={{ 
        background: '#e0e0e0', 
        padding: '50px',
        minWidth: '100px',
        minHeight: '50px'
      }}>
        Resize me!
      </div>
      <p>Width: {width.toFixed(0)}px × Height: {height.toFixed(0)}px</p>
    </div>
  );
}
```


### Custom useIntersectionObserver Hook
```javascript
function useIntersectionObserver(options = {}) {
  const elementRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [options]);
  return [elementRef, isIntersecting];
}
function ScrollReveal({ children }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  return (
    <div 
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease'
      }}
    >
      {children}
    </div>
  );
}
function ScrollRevealDemo() {
  return (
    <div>
      {Array.from({ length: 5 }, (_, i) => (
        <ScrollReveal key={i}>
          <div style={{ 
            padding: '100px', 
            margin: '50px 0',
            background: '#f0f0f0',
            borderRadius: '10px'
          }}>
            Section {i + 1}
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
```
---


## Real-World Applications


### Search Input with Auto-focus
```javascript
function SearchInput() {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      // Simulate search
      const mockResults = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        title: `Result ${i + 1} for "${query}"`
      }));
      setResults(mockResults);
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
      {isSearching && <p>Searching...</p>}
      {results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {results.map(result => (
            <li key={result.id} style={{ padding: '5px' }}>
              {result.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```


### Modal Component with Focus Trap
```javascript
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const previousActiveElement = useRef(null);
  useEffect(() => {
    if (isOpen) {
      // Save previously focused element
      previousActiveElement.current = document.activeElement;
      // Focus first element
      firstFocusableRef.current?.focus();
      // Trap focus
      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleTabKey);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleTabKey);
        document.removeEventListener('keydown', handleEscape);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={firstFocusableRef} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
}
function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>This is a modal with focus trap!</p>
        <p>Press Tab to navigate</p>
        <p>Press Escape to close</p>
      </Modal>
    </div>
  );
}
```


### Auto-save Text Area
```javascript
function AutoSaveTextArea({ initialValue = '' }) {
  const textareaRef = useRef(null);
  const [content, setContent] = useState(initialValue);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    if (!content) return;
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    // Set new timeout
    saveTimeoutRef.current = setTimeout(() => {
      // Simulate save
      fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content })
      })
        .then(() => {
          setLastSaved(new Date());
          console.log('Auto-saved!');
        })
        .catch(err => console.error('Save failed:', err));
    }, 2000); // Save after 2 seconds of inactivity
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content]);
  return (
    <div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing... (auto-saves after 2 seconds)"
        rows={10}
        style={{ width: '100%', padding: '10px' }}
      />
      {lastSaved && (
        <p style={{ color: '#666', fontSize: '14px' }}>
          Last saved: {lastSaved.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
```
---


## Best Practices


### ✅ DO
1. **Use refs for DOM manipulation**
   ```javascript
   const inputRef = useRef(null);
   inputRef.current.focus();
   ```
2. **Store timer IDs in refs**
   ```javascript
   const timerRef = useRef(null);
   timerRef.current = setTimeout(() => {}, 1000);
   ```
3. **Store previous values**
   ```javascript
   const prevValueRef = useRef();
   useEffect(() => {
     prevValueRef.current = value;
   });
   ```
4. **Use callback refs when needed**
   ```javascript
   const ref = useCallback((node) => {
     if (node) { /* measure */ }
   }, [dependencies]);
   ```
5. **Clean up in useEffect**
   ```javascript
   useEffect(() => {
     return () => {
       clearInterval(intervalRef.current);
     };
   }, []);
   ```


### ❌ DON'T
1. **Don't use refs for UI state**
   ```javascript
   // ❌ BAD
   const countRef = useRef(0);
   countRef.current += 1; // UI won't update!
   // ✅ GOOD
   const [count, setCount] = useState(0);
   ```
2. **Don't read refs during render**
   ```javascript
   // ❌ BAD
   function Component() {
     const ref = useRef(0);
     return <div>{ref.current}</div>; // Won't update
   }
   ```
3. **Don't modify refs during render**
   ```javascript
   // ❌ BAD
   function Component() {
     const ref = useRef(0);
     ref.current = 5; // Side effect during render
     return <div></div>;
   }
   ```
---


## Common Pitfalls


### Pitfall 1: Reading refs during render won't update UI
```javascript
// ❌ BAD
function BadCounter() {
  const countRef = useRef(0);
  return <div>Count: {countRef.current}</div>; // Won't update!
}
// ✅ GOOD
function GoodCounter() {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>; // Updates correctly
}
```


### Pitfall 2: Not checking if ref.current exists
```javascript
// ❌ BAD
const handleClick = () => {
  inputRef.current.focus(); // Error if current is null
};
// ✅ GOOD
const handleClick = () => {
  inputRef.current?.focus();
};
// Or
const handleClick = () => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
};
```


### Pitfall 3: Forgetting to clean up
```javascript
// ❌ BAD
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  // Forgot to clear!
}, []);
// ✅ GOOD
useEffect(() => {
  const interval = setInterval(() => {}, 1000);
  return () => clearInterval(interval);
}, []);
```
---


## Interview Preparation


### Common Questions About useRef


#### Q1: What is the difference between useRef and useState?
**Answer**: useState triggers re-renders when changed, while useRef doesn't. Use useRef for DOM access, timers, and storing values that don't affect rendering.


#### Q2: When should you use useRef?
**Answer**: Use useRef for:
- Direct DOM manipulation (focus, scroll, measurement)
- Storing timer IDs and subscription references
- Keeping track of previous values
- Storing any value that doesn't need to trigger re-renders


#### Q3: How do you access DOM elements with useRef?
**Answer**: Pass the ref to the ref prop of the element, then access it via `ref.current`.


#### Q4: What is useImperativeHandle?
**Answer**: A hook that lets you customize the instance exposed to parent components using refs. It's used with forwardRef.


#### Q5: How do you handle null refs?
**Answer**: Use optional chaining (`ref.current?.method()`) or null checks before accessing ref properties.
---


## Practice Exercise


### Requirements:
- ✅ Auto-focus input field on mount
- ✅ Scroll to specific elements
- ✅ Get input value without re-renders
- ✅ Measure element dimensions
- ✅ Implement focus trap in modal
- ✅ Create auto-save functionality


### Solution:
See practice file: `day-11/practice/ref-examples.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **useRef**: Hook for accessing DOM and storing mutable values
2. **DOM Access**: Direct manipulation of DOM elements
3. **Focus Management**: Programmatic focus control
4. **Scroll Management**: Smooth scrolling to elements
5. **Performance**: Store values without re-renders
6. **Imperative Handle**: Custom ref interfaces
7. **Callback Refs**: Advanced ref patterns
8. **Custom Hooks**: Building reusable ref-based hooks


### 🎯 Key Concepts
- useRef doesn't trigger re-renders
- Access with `.current` property
- Use for DOM access, timers, previous values
- Don't use refs for UI state
- Refs persist across renders
- Always check if `.current` exists
- Clean up timers and subscriptions
- Use callback refs for dynamic refs


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ useCallback for function memoization
- ✅ Preventing unnecessary re-renders
- ✅ Optimizing component performance
- ✅ When to use useCallback
- ✅ Advanced memoization patterns
---
**Great work! 🎉 You've mastered useRef and refs!**
**You're now ready to learn useCallback for performance optimization! 🚀**
---


## Summary Cheat Sheet


### useRef Quick Reference
```javascript
// Basic usage
const ref = useRef(initialValue);
ref.current = newValue; // No re-render
const value = ref.current;
// DOM access
const inputRef = useRef(null);
<input ref={inputRef} />;
inputRef.current.focus();
// Previous value
const prevValueRef = useRef();
useEffect(() => {
  prevValueRef.current = value;
});
return prevValueRef.current;
// Timer management
const timerRef = useRef(null);
timerRef.current = setTimeout(() => {}, 1000);
clearTimeout(timerRef.current);
```


### Common Patterns
```javascript
// 1. Auto-focus
useEffect(() => inputRef.current?.focus(), []);
// 2. Measure element
const sizeRef = useRef(null);
const measure = () => {
  const { width, height } = sizeRef.current.getBoundingClientRect();
};
// 3. Cleanup timer
useEffect(() => {
  timerRef.current = setInterval(() => {}, 1000);
  return () => clearInterval(timerRef.current);
}, []);
// 4. Previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}
```


### When to Use Refs vs State
| Scenario | Solution |
|----------|----------|
| DOM manipulation | useRef |
| UI state updates | useState |
| Timer IDs | useRef |
| Previous values | useRef |
| Form input (controlled) | useState |
| Form input (uncontrolled) | useRef |
| Scroll position | useRef (no render needed) |
| Focus state | useState (for UI) |
---
**Complete! You've mastered useRef from basics to advanced patterns! 🎯**
