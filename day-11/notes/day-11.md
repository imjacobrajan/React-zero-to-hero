# Day 11: useRef Hook - Mastering DOM Access and Persistent Values

## 📋 Table of Contents
- [Introduction](#introduction)
- [What is useRef?](#what-is-useref)
- [Creating and Using useRef](#creating-and-using-useref)
- [Accessing DOM Elements](#accessing-dom-elements)
- [Refs vs State](#refs-vs-state)
- [Advanced useRef Patterns](#advanced-useref-patterns)
- [Focus Management](#focus-management)
- [Scroll Management](#scroll-management)
- [Measuring DOM Elements](#measuring-dom-elements)
- [Imperative Handle Pattern](#imperative-handle-pattern)
- [Common useRef Use Cases](#common-useref-use-cases)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 11! Today you'll master **useRef** - React's powerful hook for accessing DOM elements and storing mutable values without triggering re-renders. By the end of today, you'll:
- ✅ Understand what useRef is and when to use it
- ✅ Access DOM elements directly
- ✅ Manage focus and scroll behavior
- ✅ Store mutable values without re-renders
- ✅ Implement imperative parent-child communication
- ✅ Build practical examples with refs

---

## What is useRef?

### Understanding useRef

**useRef** is a React hook that returns a mutable ref object that persists across renders without causing re-renders.

**Analogy**: Think of useRef as a **post-it note**:
- You can write things on it and read them later
- It stays on the same piece of paper across component re-renders
- Changing what's written doesn't trigger a page refresh (re-render)

### Two Main Purposes:

1. **Accessing DOM elements** directly
2. **Storing mutable values** that don't need to trigger re-renders

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
| Mutable | ❌ No (immutable) | ✅ Yes |
| Persists across renders | ✅ Yes | ✅ Yes |
| Current value access | Direct | `.current` |
| Use Case | UI state | DOM access, timers, previous values |

### Basic Example

```javascript
import { useRef } from 'react';

function RefExample() {
  const countRef = useRef(0);
  
  const increment = () => {
    countRef.current += 1;
    console.log('Count:', countRef.current); // Won't re-render!
  };
  
  return (
    <div>
      <button onClick={increment}>Increment (check console)</button>
    </div>
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
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus Input</button>
    </div>
  );
}
```

### Using ref with React.createRef (Class Components Style)

```javascript
// ❌ Class component style (not recommended in functional components)
function OldStyleRef() {
  const ref = React.createRef(); // Don't use in function components
  
  return <div ref={ref}>Content</div>;
}

// ✅ Function component style (recommended)
function ModernRef() {
  const ref = useRef(null);
  
  return <div ref={ref}>Content</div>;
}
```

### Reading DOM Properties

```javascript
function MeasureElement() {
  const divRef = useRef(null);
  
  const logDimensions = () => {
    const rect = divRef.current.getBoundingClientRect();
    console.log('Width:', rect.width);
    console.log('Height:', rect.height);
    console.log('Position:', rect.x, rect.y);
  };
  
  return (
    <div>
      <div ref={divRef} style={{ padding: '50px', background: 'lightblue' }}>
        Measurable div
      </div>
      <button onClick={logDimensions}>Measure</button>
    </div>
  );
}
```

### Multiple Refs

```javascript
function MultipleRefs() {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  
  const validateForm = () => {
    if (!firstNameRef.current.value) {
      firstNameRef.current.focus();
      alert('Please enter first name');
      return;
    }
    
    if (!lastNameRef.current.value) {
      lastNameRef.current.focus();
      alert('Please enter last name');
      return;
    }
    
    if (!emailRef.current.value) {
      emailRef.current.focus();
      alert('Please enter email');
      return;
    }
    
    alert('Form is valid!');
  };
  
  return (
    <div>
      <input ref={firstNameRef} placeholder="First Name" />
      <input ref={lastNameRef} placeholder="Last Name" />
      <input ref={emailRef} type="email" placeholder="Email" />
      <button onClick={validateForm}>Validate</button>
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

**Use useRef when:**
- You need to access DOM elements
- You need to store values without re-renders
- You need mutable values that persist across renders
- You're working with timers, intervals, or subscriptions

### Comparison Example

```javascript
function StateVsRef() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  
  const updateBoth = () => {
    setStateCount(stateCount + 1); // Triggers re-render
    refCount.current += 1; // No re-render
  };
  
  console.log('Component rendered'); // Logs every time
  
  return (
    <div>
      <p>State count: {stateCount}</p>
      <p>Ref count: {refCount.current}</p>
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

---

## Focus Management

### Auto-Focus on Mount

```javascript
function AutoFocusInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus(); // Focus when component mounts
  }, []);
  
  return <input ref={inputRef} placeholder="Auto-focused" />;
}
```

### Programmatic Focus Management

```javascript
function FocusManager() {
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  
  const focusInput = () => inputRef.current?.focus();
  const focusButton = () => buttonRef.current?.focus();
  
  return (
    <div>
      <input ref={inputRef} placeholder="Input" />
      <button ref={buttonRef} onClick={focusInput}>Focus Input</button>
      <button onClick={focusButton}>Focus Button</button>
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
  
  useEffect(() => {
    if (isOpen) {
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
      
      document.addEventListener('keydown', handleTab);
      firstFocusRef.current?.focus();
      
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal" ref={modalRef}>
      <button ref={firstFocusRef}>First</button>
      <div>Modal content</div>
      <button>Middle</button>
      <button ref={lastFocusRef} onClick={onClose}>Close</button>
    </div>
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
    scrollRef.current.scrollTop = 0;
  };
  
  const scrollToBottom = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };
  
  return (
    <div>
      <div>
        <button onClick={() => scrollToItem(0)}>To First</button>
        <button onClick={() => scrollToItem(5)}>To Item 5</button>
        <button onClick={scrollToTop}>To Top</button>
        <button onClick={scrollToBottom}>To Bottom</button>
      </div>
      
      <div ref={scrollRef} style={{ height: '200px', overflow: 'auto' }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
          <div key={num} ref={el => itemsRef.current[index] = el}>
            Item {num}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Infinite Scroll with Refs

```javascript
function InfiniteScroll({ items }) {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, 10));
  const loaderRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setVisibleItems(prev => [
          ...prev,
          ...items.slice(prev.length, prev.length + 10)
        ]);
      }
    });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => observer.disconnect();
  }, [items, visibleItems]);
  
  return (
    <div>
      {visibleItems.map(item => (
        <div key={item.id}>{item.content}</div>
      ))}
      <div ref={loaderRef}>Loading more...</div>
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
      <div ref={ref} style={{ padding: '50px', background: 'lightblue' }}>
        Measurable content
      </div>
      <p>Width: {dimensions.width}px</p>
      <p>Height: {dimensions.height}px</p>
    </div>
  );
}
```

### Dynamic Height Detection

```javascript
function DynamicHeight({ children }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState('auto');
  
  useEffect(() => {
    if (contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      setHeight(`${newHeight}px`);
    }
  }, [children]);
  
  return (
    <div ref={contentRef} style={{ height, transition: 'height 0.3s' }}>
      {children}
    </div>
  );
}
```

---

## Imperative Handle Pattern

### Using useImperativeHandle

```javascript
import { forwardRef, useImperativeHandle, useRef } from 'react';

// Child component
const Input = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    blur: () => inputRef.current.blur(),
    getValue: () => inputRef.current.value,
    setValue: (value) => inputRef.current.value = value
  }));
  
  return <input ref={inputRef} {...props} />;
});

// Parent component
function Parent() {
  const inputRef = useRef(null);
  
  const handleClick = () => {
    console.log('Value:', inputRef.current.getValue());
    inputRef.current.setValue('New value');
  };
  
  return (
    <div>
      <Input ref={inputRef} />
      <button onClick={handleClick}>Get/Set Value</button>
    </div>
  );
}
```

---

## Common useRef Use Cases

### 1. Storing Previous Values

```javascript
function PreviousValue({ value }) {
  const prevValueRef = useRef();
  
  useEffect(() => {
    prevValueRef.current = value;
  });
  
  return (
    <div>
      <p>Current: {value}</p>
      <p>Previous: {prevValueRef.current}</p>
    </div>
  );
}
```

### 2. Interval/Timer Management

```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  
  const start = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### 3. Keeping Track of Previous State

```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

function Component({ count }) {
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
    </div>
  );
}
```

### 4. Avoiding Re-renders with Callback Refs

```javascript
function CallbackRef() {
  const [height, setHeight] = useState(0);
  const measureRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  
  return (
    <div>
      <div ref={measureRef}>Measure this</div>
      <p>Height: {height}px</p>
    </div>
  );
}
```

---

## Practice Exercise

### Requirements:
- ✅ Auto-focus input field on mount
- ✅ Scroll to specific elements
- ✅ Get input value without re-renders
- ✅ Measure element dimensions

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

### 🎯 Key Concepts

- useRef doesn't trigger re-renders
- Access with `.current` property
- Use for DOM access, timers, previous values
- Don't use refs for UI state
- Refs persist across renders

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ useCallback for function memoization
- ✅ Preventing unnecessary re-renders
- ✅ Optimizing component performance
- ✅ When to use useCallback

---

**Great work! 🎉 See you tomorrow for Day 12: useCallback Hook!**

