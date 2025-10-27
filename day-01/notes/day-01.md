# Day 1: Environment Setup & React Basics

## 📋 Table of Contents
- [Introduction](#introduction)
- [What is React?](#what-is-react)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Understanding JSX](#understanding-jsx)
- [Component Structure](#component-structure)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to your 180-day journey to React mastery! Today marks the beginning of an incredible learning adventure. By the end of today, you'll have:
- ✅ Set up a modern React development environment
- ✅ Created your first React application
- ✅ Understood JSX syntax
- ✅ Built a Hello World component with props
- ✅ Run your app successfully

---

## What is React?

React is a **JavaScript library** for building user interfaces (UIs). Think of it as a powerful tool that lets you create interactive web pages by breaking them into reusable pieces called **components**.

### Analogy: Lego Building Blocks 🧱

Imagine you're building a house with LEGO blocks:
- Each **component** is a LEGO block (Button, Input, Card)
- You can **reuse** blocks to build different structures
- When you change one block, it updates everywhere it's used
- Complex buildings are made from simple blocks

React works the same way - you build complex UIs from simple, reusable components!

### Why Learn React?
1. **Component-Based**: Write once, use anywhere
2. **Reactive**: UI updates automatically when data changes
3. **Popular**: Used by Facebook, Netflix, Airbnb
4. **Ecosystem**: Thousands of libraries and tools
5. **Job Market**: High demand for React developers

---

## Prerequisites

Before diving in, ensure you have:
- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **Code Editor** - VS Code recommended ([Download here](https://code.visualstudio.com/))
- **Terminal/Command Line** basic knowledge
- **JavaScript fundamentals** (ES6+)

### Verify Your Installation

```bash
# Check Node.js version
node --version  # Should show v18.0.0 or higher

# Check npm version
npm --version  # Should show 9.0.0 or higher
```

---

## Installation Guide

### Step 1: Install Node.js

**Why Node.js?**
- Node.js is the JavaScript runtime that runs outside the browser
- npm (Node Package Manager) comes with it
- React development tools require Node.js

**Download & Install:**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download LTS version (Long Term Support)
3. Run installer (check "Add to PATH")
4. Restart terminal

### Step 2: Install VS Code

VS Code is a lightweight, powerful editor with excellent React support.

**Must-Have Extensions:**
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### Step 3: Install React DevTools

React DevTools is a browser extension for debugging React apps.

**Installation:**
1. Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
3. Edge: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/gpphkfbcpidddadnkolkpfckpihlkkil)

---

## Understanding JSX

### What is JSX?

**JSX** (JavaScript XML) lets you write HTML-like code in JavaScript. It's React's special syntax for creating elements.

### JSX vs Regular JavaScript

```javascript
// Without JSX (verbose)
const element = React.createElement('h1', { className: 'greeting' }, 'Hello, world!');

// With JSX (readable)
const element = <h1 className="greeting">Hello, world!</h1>;
```

**Why Use JSX?**
- More readable and familiar (looks like HTML)
- Less code to write
- Better IDE support (autocomplete, syntax highlighting)
- React automatically converts it to JavaScript

### JSX Rules

#### 1. Must Return Single Root Element

```javascript
// ❌ WRONG - Multiple root elements
function App() {
  return (
    <h1>Hello</h1>
    <p>World</p>
  );
}

// ✅ CORRECT - Single root element
function App() {
  return (
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  );
}
```

#### 2. Self-Closing Tags Must Have Slash

```javascript
// ❌ WRONG
<img src="photo.jpg">
<hr>

// ✅ CORRECT
<img src="photo.jpg" />
<hr />
```

#### 3. Use className Instead of class

```javascript
// ❌ WRONG
<div class="container">Content</div>

// ✅ CORRECT
<div className="container">Content</div>
```

**Why?** `class` is a reserved word in JavaScript!

#### 4. Use camelCase for Events

```javascript
// ❌ WRONG
<button onclick="handleClick()">Click</button>

// ✅ CORRECT
<button onClick={handleClick}>Click</button>
```

#### 5. Embed JavaScript with Curly Braces `{}`

```javascript
function App() {
  const name = 'React';
  const age = 10;
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age + 5}</p>
      <p>{2 + 2 === 4 ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

**What Can Go Inside `{}`?**
- ✅ Variables
- ✅ Math operations
- ✅ Function calls
- ✅ Conditional (ternary) expressions
- ✅ Arrays
- ❌ Objects (directly - need conversion)
- ❌ if statements (use ternary instead)

---

## Component Structure

### What is a Component?

A **component** is a reusable piece of UI. Think of it as a custom HTML element you create.

### Function Components (Modern Way)

```javascript
// Simple Component
function Welcome() {
  return <h1>Welcome to React!</h1>;
}

// Arrow Function (Common)
const Welcome = () => {
  return <h1>Welcome to React!</h1>;
};

// Shorthand (Single Expression)
const Welcome = () => <h1>Welcome to React!</h1>;
```

### Component Rules

1. **Capitalize** component names (PascalCase)
2. **Return** JSX
3. **Export** components to use elsewhere

```javascript
// ✅ CORRECT
function MyButton() {
  return <button>Click Me</button>;
}

// ❌ WRONG - lowercase
function mybutton() {
  return <button>Click Me</button>;
}
```

### Component Nesting

Components can use other components:

```javascript
function Button() {
  return <button>Click</button>;
}

function App() {
  return (
    <div>
      <h1>My App</h1>
      <Button /> {/* Use Button component */}
    </div>
  );
}
```

---

## Creating Your First App with Vite

**Why Vite?**
- ⚡ Lightening fast development
- 📦 Optimized builds
- 🔥 Hot Module Replacement (HMR)
- 🛠️ Better than Create React App

### Step 1: Create Project

```bash
# Navigate to your workspace
cd ~/Documents/Jacob/work/learning/Programming/React

# Create React app with Vite
npm create vite@latest my-first-react-app

# When prompted:
# - Select: React
# - Select: JavaScript or TypeScript
cd my-first-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open browser to the URL shown (usually `http://localhost:5173`)

### Step 2: Project Structure

```
my-first-react-app/
├── node_modules/          # Installed packages
├── public/                # Static assets
├── src/
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   ├── index.css         # Global styles
│   └── assets/           # Images, fonts
├── index.html            # HTML template
├── package.json          # Project dependencies
└── vite.config.js        # Vite configuration
```

---

## Practice Exercise: Hello World Component with Props

### Exercise: Build a Greeting Component

Create a component that displays personalized greetings using props.

#### Step 1: Create Greeting Component

```javascript
// src/Greeting.jsx
function Greeting(props) {
  return (
    <div className="greeting">
      <h1>Hello, {props.name}!</h1>
      <p>Welcome to your React journey.</p>
      <p>You are {props.age} years old.</p>
    </div>
  );
}

export default Greeting;
```

#### Step 2: Using the Component

```javascript
// src/App.jsx
import './App.css';
import Greeting from './Greeting';

function App() {
  return (
    <div className="App">
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
      <Greeting name="Charlie" age={22} />
    </div>
  );
}

export default App;
```

#### Step 3: Enhanced Version with Destructuring

```javascript
// src/Greeting.jsx - Improved
function Greeting({ name, age, city }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to your React journey.</p>
      <p>
        You are {age} years old and from {city}.
      </p>
      {age >= 18 ? (
        <p className="adult">✓ Verified as adult</p>
      ) : (
        <p className="minor">⚠ Minor account</p>
      )}
    </div>
  );
}

export default Greeting;
```

#### Step 4: Using in App

```javascript
// src/App.jsx
import './App.css';
import Greeting from './Greeting';

function App() {
  return (
    <div className="App">
      <Greeting name="Alice" age={25} city="New York" />
      <Greeting name="Bob" age={17} city="London" />
      <Greeting name="Charlie" age={30} city="Tokyo" />
    </div>
  );
}

export default App;
```

#### Step 5: Add Some Styling

```css
/* src/App.css */
.App {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.greeting {
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.greeting h1 {
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.greeting p {
  margin: 5px 0;
}

.adult {
  color: #4ade80;
  font-weight: bold;
}

.minor {
  color: #fbbf24;
  font-weight: bold;
}
```

---

## Deep Dive: How Props Work

### Props Analogy: Mail Delivery 📮

Imagine components as houses:
- **Props** are like letters/parcels delivered to houses
- Each house gets its own mail
- The mail (props) can contain different information
- Houses use that information to display content

### Props Are Immutable

```javascript
// ❌ WRONG - Can't modify props
function Greeting({ name, age }) {
  name = "Changed"; // ERROR!
  return <h1>Hello {name}</h1>;
}

// ✅ CORRECT - Props are read-only
function Greeting({ name, age }) {
  const displayName = name.toUpperCase(); // Use data, don't modify
  return <h1>Hello {displayName}</h1>;
}
```

### Default Props

```javascript
// Method 1: Default parameter
function Greeting({ name = "Guest", age = 0 }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}

// Method 2: Component defaultProps
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}

Greeting.defaultProps = {
  name: "Guest",
  age: 0
};
```

---

## Key Takeaways

### ✅ What You Learned Today

1. **React Setup**: Created development environment with Vite
2. **JSX Syntax**: Learned to write HTML-like code in JavaScript
3. **Components**: Created reusable UI pieces
4. **Props**: Passed data to components
5. **Component Structure**: Understood function components

### 🎯 Key Concepts

- **JSX** makes React code readable and familiar
- **Components** are reusable UI building blocks
- **Props** pass data from parent to child
- **Function components** are the modern React approach

### 📚 Next Steps

Tomorrow you'll dive deeper into:
- ✅ Props validation with PropTypes
- ✅ More component patterns
- ✅ Building complex components
- ✅ Best practices

### 💡 Practice Ideas

1. Create a `UserCard` component with props
2. Build a `Product` component showing name and price
3. Make an `Alert` component that changes based on props
4. Experiment with different prop types (strings, numbers, booleans)

---

## Common Questions

### Q: Can I mix JSX with regular HTML?
**A:** No, JSX is React-specific. Regular HTML works in static sites, but React needs JSX.

### Q: Why use Vite instead of Create React App?
**A:** Vite is faster, has better performance, and is the modern standard.

### Q: Do I need to memorize all JSX rules?
**A:** No! Start coding and you'll remember them naturally. IDEs will also help catch errors.

### Q: What if I don't know JavaScript well?
**A:** Take time to learn ES6+ (arrow functions, destructuring, spread operator) - these are essential for React.

---

## Common Pitfalls & Solutions

### Pitfall 1: Forgetting to Import React

```javascript
// ❌ WRONG - Missing React import in older React versions
function Component() {
  return <div>Hello</div>;
}

// ✅ CORRECT - React 17+ doesn't need import for JSX
// But Vite setups might need:
import React from 'react';
```

### Pitfall 2: Returning Multiple Elements Without Fragment

```javascript
// ❌ WRONG
function Component() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// ✅ CORRECT - Using Fragment
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// ✅ ALTERNATIVE - Using div wrapper
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}
```

### Pitfall 3: Using Reserved Words

```javascript
// ❌ WRONG
<div class="container">
  <label for="input">Name</label>
</div>

// ✅ CORRECT - Use React equivalents
<div className="container">
  <label htmlFor="input">Name</label>
</div>
```

## Debugging Your First App

### Using Console.log

```javascript
function Greeting({ name }) {
  console.log('Greeting rendered with:', name);
  
  return <h1>Hello, {name}!</h1>;
}
```

### Using React DevTools

1. Open browser DevTools (F12)
2. Click "Components" tab
3. Inspect component tree
4. View props and state
5. Edit props to test

### Common Errors & Fixes

**Error**: "Unexpected token" in JSX
```javascript
// Problem: Using && incorrectly with 0
{items.length && <List items={items} />}

// Fix: Convert to boolean
{items.length > 0 && <List items={items} />}
```

**Error**: "Cannot read property of undefined"
```javascript
// Problem: Accessing props before they exist
function Component(props) {
  return <div>{props.user.name}</div>; // Error if user is undefined
}

// Fix: Add optional chaining or default
function Component({ user }) {
  return <div>{user?.name || 'Guest'}</div>;
}
```

## Additional Resources

### Reading Material
- [React Official Docs](https://react.dev)
- [React Beta Docs](https://beta.reactjs.org)
- [Vite Documentation](https://vitejs.dev)
- [JSX in Depth](https://react.dev/learn/writing-markup-with-jsx)

### Tools
- [React DevTools Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [CodeSandbox](https://codesandbox.io) - Online React editor
- [StackBlitz](https://stackblitz.com) - Instant React IDE

### Communities
- [React Discord](https://discord.gg/react)
- [r/reactjs Reddit](https://reddit.com/r/reactjs)
- [Reactiflux Discord](https://discord.gg/reactiflux)

---

**Congratulations! 🎉 You've completed Day 1!**

You now have:
- ✅ A working React development environment
- ✅ Understanding of JSX and components
- ✅ Your first component with props
- ✅ Foundation for the next 179 days!

### Daily Reflection

Before moving to Day 2, ask yourself:
1. Can I create a new React app with Vite?
2. Do I understand the difference between JSX and HTML?
3. Can I pass and use props in components?
4. Can I debug simple React errors?

If yes to all, you're ready for Day 2!

See you tomorrow for Day 2: Components & Props Deep Dive!
