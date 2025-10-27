# Day 20: Render Props Pattern - Sharing Code Flexibly

## 📋 Table of Contents
- [Introduction](#introduction)
- [Sharing Code with Render Props](#sharing-code-with-render-props)
- [Function as Children Pattern](#function-as-children-pattern)
- [Flexibility in Rendering](#flexibility-in-rendering)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Render props pattern shares code between components using props that are functions. Learn flexible rendering.

---

## Sharing Code with Render Props

```javascript
function MouseTracker({ render }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(mouse);
}
```

---

## Function as Children Pattern

```javascript
function MouseTracker({ children }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return children(mouse);
}
```

---

## Using Render Props

```javascript
function App() {
  return (
    <MouseTracker>
      {(mouse) => (
        <div>
          Mouse position: {mouse.x}, {mouse.y}
        </div>
      )}
    </MouseTracker>
  );
}
```

---

## Practice Exercise

Create a Mouse tracker component with render props.

See practice file: `day-20/practice/render-props.jsx`

---

## Key Takeaways

- Render props share logic
- Function as children pattern
- Maximum flexibility
- Reusable behavior

**Congratulations! You've completed Days 1-20! 🎉**

