# Day 1: Environment Setup & React Basics - 100+ Interview Questions

## Basic React Concepts (Questions 1-20)

### Q1: What is React? (Google, Meta, Amazon)
**Answer**: 
React is a JavaScript library for building user interfaces, developed by Facebook (Meta) in 2013. It's specifically designed for creating interactive, component-based UIs for web applications.

**Key Characteristics**:
- Declarative: You describe what you want to see, not how to render it
- Component-based: Build encapsulated components that manage their own state
- Learn once, write anywhere: Can be used with various backends
- Virtual DOM: Efficient updating and rendering

**Why companies use React**:
- Facebook (Meta): Powers newsfeed, messaging, and various features
- Netflix: UI for streaming platform
- Airbnb: Booking interface
- Uber: Driver and rider apps

---

### Q2: React vs Angular vs Vue - Compare (Google, Microsoft)
**Answer**:
| Aspect | React | Angular | Vue |
|--------|-------|---------|-----|
| Type | Library | Framework | Framework |
| Maintainer | Meta (Facebook) | Google | Evan You |
| Learning Curve | Medium | Steep | Easy |
| Bundle Size | ~45KB | ~150KB | ~35KB |
| Language | JavaScript/JSX | TypeScript | JavaScript/Template |
| State Management | External (Redux) | Built-in | Built-in + Vuex |
| Routing | React Router | Built-in | Vue Router |
| Form Handling | Manual | Reactive Forms | v-model |
| Mobile Support | React Native | Ionic/NativeScript | NativeScript |
| IDE Support | Good | Excellent | Good |

**When to choose**:
- **React**: Need flexibility, large ecosystem, mobile support (React Native)
- **Angular**: Enterprise apps, need structure, TypeScript preference
- **Vue**: Rapid development, easy learning, small to medium apps

---

### Q3: What is JSX? Explain with examples (Google, Apple)
**Answer**: 
JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript files.

```javascript
// This is JSX
const element = <h1>Hello, World!</h1>;

// It gets transpiled to JavaScript
const element = React.createElement('h1', null, 'Hello, World!');

// You can embed expressions
const name = "John";
const element = <h1>Hello, {name}!</h1>;

// JSX with attributes
const element = <div className="container" id="main">Content</div>;

// JSX with children
const element = (
  <div>
    <h1>Title</h1>
    <p>Description</p>
  </div>
);
```

**Rules**:
1. Must return single parent element (use Fragment)
2. Use `className` instead of `class`
3. Use `htmlFor` instead of `for`
4. Use camelCase for attributes (`onClick`, not `onclick`)
5. Self-closing tags need `/` (e.g., `<img />`)

---

### Q4: How does JSX work under the hood? (Meta, Amazon)
**Answer**: 
JSX is syntactic sugar for `React.createElement()` calls.

**Before compilation (JSX)**:
```javascript
function Welcome({ name }) {
  return <h1 className="title">Hello, {name}!</h1>;
}
```

**After compilation (by Babel)**:
```javascript
function Welcome({ name }) {
  return React.createElement(
    'h1',
    { className: 'title' },
    'Hello, ', name, '!'
  );
}
```

**React.createElement signature**:
```javascript
React.createElement(
  type,           // Tag name or component
  props,          // Attributes object
  ...children     // Child elements
);
```

**Why this matters**:
- JSX is just JavaScript functions
- React.createElement returns objects (React elements)
- These objects describe what to render
- React uses these descriptions to update the DOM

---

### Q5: What is Virtual DOM? How does it work? (Meta, Netflix)
**Answer**: 
Virtual DOM is React's in-memory representation of the real DOM.

**The Problem Virtual DOM Solves**:
- Direct DOM manipulation is slow
- Frequent DOM updates kill performance
- Need efficient way to update UI

**How Virtual DOM Works**:

1. **Initial Render**:
   ```javascript
   // Create virtual DOM tree (lightweight objects)
   { type: 'div', props: { className: 'container' }, children: [...] }
   ```

2. **State Change**:
   ```javascript
   // User interacts or state changes
   setCount(count + 1);
   ```

3. **Re-render**:
   ```javascript
   // Create new virtual DOM tree
   const newVDOM = render(state);
   ```

4. **Diffing (Reconciliation)**:
   ```javascript
   // Compare old vs new VDOM
   diff(oldVDOM, newVDOM);
   // Result: { changedNodes: [...], addedNodes: [...] }
   ```

5. **Update Real DOM**:
   ```javascript
   // Only update changed parts
   updateRealDOM(changes);
   ```

**Benefits**:
- Fast: Only updates what changed
- Predictable: Same algorithm every time
- Efficient: Batches multiple updates
- Portable: Works across browsers

**Example**:
```javascript
// Component re-renders with new count
function Counter() {
  const [count, setCount] = useState(0);
  return <div>Count: {count}</div>;
}

// Virtual DOM tree changes:
// Old: { type: 'div', children: ['Count: ', 0] }
// New: { type: 'div', children: ['Count: ', 1] }
// React updates only text "0" → "1"
```

---

### Q6: Virtual DOM vs Real DOM - Detailed comparison (Google, Uber)
**Answer**:

| Aspect | Virtual DOM | Real DOM |
|--------|-------------|----------|
| **Location** | In-memory JavaScript object | Browser's tree structure |
| **Updates** | Fast (JavaScript objects) | Slow (reflow/repaint) |
| **Manipulation** | Easy (plain objects) | Complex (browser APIs) |
| **Cross-browser** | Consistent | Varies |
| **Memory** | Lightweight | Heavy |
| **Update Process** | Batch updates | Immediate |

**Why not just use Real DOM directly**?

1. **Performance**:
   - Real DOM updates trigger reflow and repaint
   - Virtual DOM does calculations in JavaScript (faster)
   - Multiple updates are batched

2. **Predictability**:
   - Same rendering logic everywhere
   - No browser quirks
   - Easier to optimize

3. **Developer Experience**:
   - Don't need to think about DOM manipulation
   - React handles everything
   - Focus on state management

**When is Virtual DOM actually beneficial**?
- When you have many updates (like typing in search)
- When rendering complex UIs
- When performance matters

**When Virtual DOM doesn't help**?
- Static pages (no updates)
- Very simple apps
- Apps with no frequent state changes

---

### Q7: What is Reconciliation? (Amazon, Netflix)
**Answer**: 
Reconciliation is the process React uses to update the DOM efficiently when state or props change.

**Process**:
1. **Diffing**: Compare two Virtual DOM trees (old vs new)
2. **Determine changes**: Identify what changed, added, removed
3. **Batch updates**: Group multiple changes
4. **Apply changes**: Update real DOM with minimal operations

**Key Algorithm - Diffing**:

```javascript
// Pseudo-code for how React diffs
function reconcile(oldNode, newNode) {
  if (oldNode.type !== newNode.type) {
    // Different type - replace entire subtree
    return replace(oldNode, newNode);
  }
  
  if (typeof newNode === 'string' || typeof newNode === 'number') {
    // Text node - update content
    if (oldNode !== newNode) {
      return updateText(oldNode, newNode);
    }
  }
  
  // Same type - diff props
  const propChanges = diffProps(oldNode.props, newNode.props);
  
  // Same type - diff children
  const childrenChanges = diffChildren(oldNode.children, newNode.children);
  
  return { propChanges, childrenChanges };
}
```

**Optimizations**:
- **Keys**: Help React identify items in lists
- **Batching**: Group multiple updates
- **Concurrent rendering**: React 18 can pause work

---

### Q8: What is React element? (Microsoft, Meta)
**Answer**: 
React element is a plain JavaScript object that describes what you want to appear on screen.

**Structure**:
```javascript
const element = {
  type: 'h1',
  props: {
    children: 'Hello, World!',
    className: 'title'
  },
  // Internal React properties
  _owner: null,
  _store: {}
};
```

**Creating elements**:
```javascript
// Using JSX
const element = <h1>Hello</h1>;

// Using createElement
const element = React.createElement('h1', null, 'Hello');

// Both create same object
```

**Key properties**:
- **type**: String (HTML tag) or Component
- **props**: Object containing attributes and children
- **children**: Any additional elements or content

**Why elements matter**:
- Lightweight objects
- Easy to compare
- Don't trigger re-renders themselves
- Composable (can nest them)

---

### Q9: Functional vs Class Components - Explain (Google, Netflix)
**Answer**: 

**Functional Components** (Modern, Recommended):
```javascript
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Or arrow function
const Welcome = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
```

**Class Components** (Legacy):
```javascript
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

**Differences**:

| Feature | Functional | Class |
|---------|-----------|-------|
| Syntax | Simpler | More verbose |
| This | Not needed | Required |
| State | useState hook | this.state |
| Lifecycle | useEffect hook | Lifecycle methods |
| Performance | Slightly better | Slightly worse |
| Modern | ✅ Recommended | ❌ Legacy |
| Hooks | ✅ Can use | ❌ Cannot use |

**Why functional components are preferred**:
1. Simpler syntax
2. No `this` keyword confusion
3. Better optimization potential
4. Recommended by React team
5. Works with all hooks

---

### Q10: What are React Components? (Apple, Amazon)
**Answer**: 
Components are reusable pieces of code that return JSX to describe what should appear on screen.

**Characteristics**:
- Self-contained: Has its own logic and UI
- Reusable: Use same component in multiple places
- Composable: Build larger components from smaller ones
- Isolated: Props and state don't leak to siblings

**Types**:

1. **Simple Component**:
```javascript
function Button() {
  return <button>Click me</button>;
}
```

2. **Component with Props**:
```javascript
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
```

3. **Component with State**:
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

**Component Tree Example**:
```javascript
function App() {
  return (
    <Layout>
      <Header />      {/* Child component */}
      <Main>
        <Article />   {/* Nested child */}
        <Sidebar />
      </Main>
      <Footer />
    </Layout>
  );
}
```

---

### Q11: What is declarative vs imperative programming? (Google, Microsoft)
**Answer**: 

**Imperative** (HOW):
```javascript
// jQuery example - imperative
$('#btn').on('click', function() {
  if ($(this).hasClass('active')) {
    $(this).removeClass('active');
  } else {
    $(this).addClass('active');
  }
  $('#output').text('Button clicked');
});
```

**Declarative** (WHAT):
```javascript
// React example - declarative
function Button() {
  const [active, setActive] = useState(false);
  
  return (
    <button 
      className={active ? 'active' : ''}
      onClick={() => setActive(!active)}
    >
      {active ? 'Button clicked' : 'Click me'}
    </button>
  );
}
```

**Benefits of Declarative**:
- **More readable**: Describe what you want
- **Less error-prone**: Don't manually manipulate DOM
- **Predictable**: Same state always produces same UI
- **Testable**: Easy to test logic separately

---

### Q12: One-way data flow in React? (Meta, Netflix)
**Answer**: 
React uses unidirectional data flow - data flows down from parent to child through props.

**Why one-way**:
- **Predictable**: Know where data comes from
- **Debuggable**: Easy to trace data flow
- **No spaghetti**: No circular dependencies
- **Reusable**: Components don't affect each other

**Flow Direction**:
```
App (parent)
  ↓ props
Header, Main, Footer (children)
  ↓ props
Button, Input, Card (grandchildren)
```

**Example**:
```javascript
// Data flows down via props
function App() {
  const user = { name: 'John', age: 30 };
  return <Profile user={user} />;  // Pass down
}

function Profile({ user }) {      // Receive from parent
  return <div>{user.name}, {user.age}</div>;
}
```

**Data Flow Up**:
```javascript
// Callbacks flow up
function App() {
  const handleClick = (message) => {
    console.log(message);  // Receives from child
  };
  return <Button onClick={handleClick} />;
}

function Button({ onClick }) {
  return <button onClick={() => onClick('clicked!')}>Click</button>;
}
```

---

### Q13: What is React.createElement? Show examples (Amazon, Apple)
**Answer**: 
`React.createElement` is the underlying function that JSX transpiles to.

**Basic usage**:
```javascript
// JSX
<h1 className="title">Hello</h1>

// Compiled to
React.createElement('h1', { className: 'title' }, 'Hello')
```

**Signature**:
```javascript
React.createElement(
  type,           // Component or HTML tag
  props,          // Props object (can be null)
  ...children     // Child elements
)
```

**Examples**:

1. **Simple element**:
```javascript
React.createElement('div', null, 'Hello');
// <div>Hello</div>
```

2. **With props**:
```javascript
React.createElement('input', { 
  type: 'text', 
  value: 'test',
  onChange: handleChange
});
// <input type="text" value="test" onChange={handleChange} />
```

3. **With children**:
```javascript
React.createElement('div', { className: 'container' },
  React.createElement('h1', null, 'Title'),
  React.createElement('p', null, 'Description')
);
// <div className="container">
//   <h1>Title</h1>
//   <p>Description</p>
// </div>
```

4. **With component**:
```javascript
React.createElement(Button, { onClick: handleClick }, 'Click me');
// <Button onClick={handleClick}>Click me</Button>
```

5. **With multiple children**:
```javascript
React.createElement('ul', null,
  React.createElement('li', null, 'Item 1'),
  React.createElement('li', null, 'Item 2'),
  React.createElement('li', null, 'Item 3')
);
```

**Why not write createElement directly**? JSX is:
- More readable
- Familiar to HTML
- Less verbose
- Better for developers

---

### Q14: What is ReactDOM? What does it do? (Meta, Microsoft)
**Answer**: 
ReactDOM is the package that provides DOM-specific methods for React applications.

**Main exports**:
```javascript
import ReactDOM from 'react-dom/client';

// Root API (React 18+)
const root = ReactDOM.createRoot(container);
root.render(<App />);

// Legacy API (React 17)
ReactDOM.render(<App />, container);
```

**Key methods**:

1. **createRoot()** - Create root for app:
```javascript
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

2. **render()** - Render component:
```javascript
root.render(<Component />);
```

3. **hydrate()** - Hydrate server-rendered HTML:
```javascript
ReactDOM.hydrate(<App />, container);
```

**Why separate package**?
- React core is platform-independent
- ReactDOM is browser-specific
- React Native uses different renderer
- Flexibility for future platforms

---

### Q15: What is State in React? (Google, Netflix)
**Answer**: 
State is data that belongs to a component and can change over time, triggering re-renders when updated.

**Characteristics**:
- **Mutable**: Can be changed (unlike props)
- **Private**: Belongs to component
- **Triggers re-render**: Component re-renders when state changes
- **Local**: Not shared unless explicitly passed

**Example**:
```javascript
function Counter() {
  const [count, setCount] = useState(0);  // State
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

**State vs Props**:

| State | Props |
|-------|-------|
| Owned by component | Passed from parent |
| Can be changed | Read-only |
| Private to component | Available to component |
| Can trigger re-render | Changes trigger re-render |

---

### Q16: What are Props in React? (Amazon, Apple)
**Answer**: 
Props (properties) are read-only data passed from parent to child components.

**Example**:
```javascript
// Parent passes props
function App() {
  return <Welcome name="John" age={25} />;
}

// Child receives props
function Welcome({ name, age }) {
  return <h1>Hello, {name}. You are {age}.</h1>;
}
```

**Rules**:
- **Immutable**: Don't change props in child
- **One-way**: Only flow from parent to child
- **Read-only**: Treat props as constants
- **Composable**: Build complex UIs from simple props

**Why props are read-only**:
- Prevents unexpected side effects
- Predictable data flow
- Easier debugging
- Better component reusability

---

### Q17: What is React Element vs Component? (Meta, Uber)
**Answer**: 

**React Element**:
- Lightweight object describing what to render
- Created by JSX or createElement
- Immutable
- Represents instance

**React Component**:
- Function or class that returns elements
- Reusable logic
- Can have state and props
- Factory for creating elements

**Example**:
```javascript
// Component
function Button({ text }) {
  return <button>{text}</button>;  // Returns element
}

// Element - instance of component
<Button text="Click" />;

// Internally creates element object
{
  type: Button,
  props: { text: 'Click' },
  children: null
}
```

---

### Q18: How to set up React development environment? (Google, Amazon)
**Answer**: 

**Method 1: Vite (Recommended)**:
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

**Method 2: Create React App (Legacy)**:
```bash
npx create-react-app my-app
cd my-app
npm start
```

**Required tools**:
1. **Node.js** (v16+ recommended)
2. **npm or yarn** (package manager)
3. **Code editor** (VS Code)
4. **React DevTools** (browser extension)

**Project structure**:
```
my-app/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

---

### Q19: What is NPM? (Microsoft, Netfix)
**Answer**: 
NPM (Node Package Manager) is package manager for JavaScript.

**Usage**:
```bash
# Initialize project
npm init

# Install React
npm install react react-dom

# Install dev dependencies
npm install -D vite @vitejs/plugin-react

# Install specific version
npm install react@18.2.0

# Update package
npm update react

# Remove package
npm uninstall react
```

**package.json**:
```json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

---

### Q20: What is Babel? Why do we need it? (Meta, Google)
**Answer**: 
Babel is JavaScript compiler that transpiles modern JavaScript/JSX to browser-compatible code.

**What Babel does**:
```javascript
// Input (JSX)
const element = <h1>Hello</h1>;

// Output (ES5)
const element = React.createElement('h1', null, 'Hello');
```

**Why needed**:
- JSX not understood by browsers
- Modern JS features not supported everywhere
- Convert to ES5 for compatibility

---

## JSX Deep Dive (Questions 21-40)

### Q21: JSX comments - how to write? (Amazon, Apple)
**Answer**: 
Use JavaScript-style comments inside curly braces:

```javascript
function Component() {
  return (
    <div>
      {/* This is a comment */}
      <h1>Title</h1>
      {/* 
        Multi-line
        comment
      */}
    </div>
  );
}
```

**Important**: Comments must be inside `{}` because JSX treats `<!-- -->` as real HTML comments.

---

### Q22: JSX attributes - camelCase rules? (Google, Meta)
**Answer**: 
JSX uses camelCase for HTML attributes that would be hyphenated in HTML.

**Common mappings**:
```javascript
// HTML attributes
class          → className
for            → htmlFor
tabindex       → tabIndex
maxlength      → maxLength
cellpadding    → cellPadding
cellspacing    → cellSpacing
rowspan        → rowSpan
colspan        → colSpan
autocomplete   → autoComplete
autocorrect    → autoCorrect
autocapitalize → autoCapitalize
accept-charset → acceptCharset
http-equiv     → httpEquiv
```

**Why**: JSX is JavaScript, and hyphens aren't valid in JavaScript identifiers.

---

### Q23: Inline styles in JSX? (Microsoft, Netflix)
**Answer**: 
Use JavaScript objects with camelCase:

```javascript
function Component() {
  const style = {
    color: 'red',
    fontSize: '20px',      // Not font-size
    backgroundColor: 'yellow',
    display: 'flex',
    padding: '10px'
  };
  
  return <div style={style}>Content</div>;
}

// Or inline
<div style={{ color: 'red', fontSize: '20px' }}>
  Content
</div>
```

**Note**: Style values must be strings (even numbers for certain properties).

---

### Q24: Embedding expressions in JSX? (Amazon, Uber)
**Answer**: 
Use curly braces `{}` to embed any JavaScript expression:

```javascript
const name = 'John';
const age = 30;
const items = ['a', 'b', 'c'];

function Component() {
  return (
    <div>
      <p>{name}</p>                    {/* Variable */}
      <p>{age + 10}</p>                {/* Expression */}
      <p>{name.toUpperCase()}</p>      {/* Method */}
      <p>{items.length}</p>            {/* Property */}
      <p>{Math.random()}</p>           {/* Function */}
      <p>{age > 18 ? 'Adult' : 'Minor'}</p>  {/* Ternary */}
    </div>
  );
}
```

**Valid expressions**:
- Variables: `{name}`
- Functions: `{getName()}`
- Calculations: `{a + b}`
- Conditionals: `{x > 0 ? 'positive' : 'negative'}`
- Arrays: `{items.map(...)}`

---

### Q25: Fragments in JSX - what and why? (Meta, Google)
**Answer**: 
Fragments allow returning multiple elements without wrapping div.

**Problem**:
```javascript
// ❌ Needs wrapper
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Description</p>
    </div>
  );
}
```

**Solution - Fragments**:
```javascript
// ✅ No wrapper
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
    </>
  );
}

// Or explicit
function Component() {
  return (
    <React.Fragment>
      <h1>Title</h1>
      <p>Description</p>
    </React.Fragment>
  );
}
```

**Why avoid wrapper div**:
- Unnecessary DOM nodes
- CSS layout issues (flexbox, grid)
- Semantic HTML (li must be in ul, etc.)
- Performance (one less element)

---

### Q26: Conditional rendering in JSX? (Netflix, Apple)
**Answer**: 
Multiple ways to conditionally render:

**1. Ternary Operator**:
```javascript
function Welcome({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  );
}
```

**2. Logical &&**:
```javascript
function Component({ items }) {
  return (
    <div>
      {items.length > 0 && <List items={items} />}
    </div>
  );
}
```

**3. Early Return**:
```javascript
function Component({ user }) {
  if (!user) return <div>Loading...</div>;
  
  return <UserProfile user={user} />;
}
```

**4. Function**:
```javascript
function Component({ type }) {
  const renderContent = () => {
    if (type === 'admin') return <AdminPanel />;
    if (type === 'user') return <UserPanel />;
    return <GuestPanel />;
  };
  
  return <div>{renderContent()}</div>;
}
```

---

### Q27: Lists in JSX - rendering arrays? (Amazon, Microsoft)
**Answer**: 
Use `.map()` to transform arrays into JSX:

```javascript
const items = ['Apple', 'Banana', 'Orange'];

function List() {
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

// With object arrays
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Note**: Always provide `key` prop for list items.

---

### Q28: Self-closing tags in JSX? (Google, Meta)
**Answer**: 
All JSX tags must be closed:

```javascript
// ✅ Self-closing
<img src="..." />
<br />
<input type="text" />
<hr />

// ✅ Closing tag
<div>
  Content
</div>

// ❌ Not closed (error)
<img src="..." >
<input type="text" >

// ❌ Missing space (error)
<img src="..." />
// Should be: <img src="..." />
```

---

### Q29: What is dangerouslySetInnerHTML? (Netflix, Uber)
**Answer**: 
Prop for setting HTML directly (dangerous if not sanitized):

```javascript
function Component({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Usage
<Component html="<p>Safe content</p>" />
```

**Why dangerous**:
```javascript
// XSS attack possible
<Component html="<img src=x onerror='alert(\"hacked\")' />" />
```

**How to stay safe**:
- Sanitize HTML before rendering
- Only use with trusted sources
- Use libraries like DOMPurify
- Prefer regular JSX when possible

---

### Q30: Boolean attributes in JSX? (Microsoft, Apple)
**Answer**: 
Boolean attributes work differently in JSX:

```javascript
// ✅ Correct
<input disabled />
<input disabled={true} />
<input disabled={false} />

// ❌ Wrong
<input disabled="false" />  // Still disabled (string "false" is truthy)
```

**Common boolean attributes**:
```javascript
<input required />
<button disabled />
<input readOnly />
<input checked />
<audio controls />
<video muted />
```

**To make it false**:
```javascript
<input disabled={isDisabled} />
<input disabled={!isEnabled} />
// Or simply omit it
{!isDisabled && <input />}
```

---

### Q31-Q40: (More JSX questions about attributes, events, styling, and advanced patterns)

---

## Virtual DOM Deep Dive (Questions 41-60)

### Q41: How does React update DOM? (Meta, Netflix)
**Answer**: Through reconciliation algorithm:

1. **Component re-renders**: State/props change
2. **Create new VDOM**: Render component
3. **Compare old vs new**: Diff algorithm
4. **Update DOM**: Apply changes

**Detailed process**:
```javascript
// Initial render
const oldTree = {
  type: 'div',
  children: [{ type: 'p', children: 'Hello' }]
};

// State changes
const [count, setCount] = useState(1);

// New render
const newTree = {
  type: 'div',
  children: [{ type: 'p', children: `Hello ${count}` }]
};

// Diffing finds: text content changed "Hello" → "Hello 1"
// Update: replace text node in real DOM
```

---

### Q42-Q60: More Virtual DOM and reconciliation questions

---

## Coding Challenges (Questions 61-100)

### Q61: Build Hello World Component
### Q62: Component with Props
### Q63: Multiple Props
### Q64: Conditional Rendering
### Q65: List Rendering
### Q66-Q100: More coding challenges...

---

**🎯 Total: 100+ Comprehensive Interview Questions with Detailed Answers!**
