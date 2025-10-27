# Day 2: Components & Props Deep Dive

## Introduction

Welcome back! Today we're diving deeper into the building blocks of React: **components** and **props**. By the end of this day, you'll master:
- ✅ Functional components (the modern approach)
- ✅ Advanced prop passing techniques
- ✅ Props destructuring patterns
- ✅ PropTypes for type validation
- ✅ Building reusable components

> **📌 What's NOT in Day 2**: We won't cover hooks (useState, useEffect), state management, or event handling yet. Those come in Days 4-11. Day 2 is purely about understanding components and props deeply.

**Today's Focus**: Building solid foundations in:
1. How to create and structure functional components
2. How to pass data between components (props)
3. How to validate props (PropTypes)
4. Best practices for component architecture

---

## Functional Components Deep Dive

### What Makes Functional Components Special?

Think of functional components as **recipe cards**:
- Simple, straightforward instructions (pure functions)
- You give them ingredients (props), they produce the dish (UI)
- Easy to read, test, and reuse
- They're just JavaScript functions!

### Function Component Syntax Variations

```javascript
// 1. Regular Function Declaration
function ProfileCard(props) {
  return <div>Hello, {props.name}</div>;
}

// 2. Arrow Function with Explicit Return
const ProfileCard = (props) => {
  return <div>Hello, {props.name}</div>;
};

// 3. Arrow Function with Implicit Return
const ProfileCard = (props) => <div>Hello, {props.name}</div>;

// 4. With Destructured Props
const ProfileCard = ({ name, age }) => <div>Hello, {name}</div>;
```

### When to Use Each?

- **Regular function**: When you need hoisting or want traditional function behavior
- **Arrow function with explicit return**: Multiple statements, complex logic
- **Implicit return**: Simple, single-expression components
- **Destructured props**: Most common in modern React

### Component as Namespace Pattern

Group related components under a namespace:

```javascript
// Card.jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

// Export as object
export { Card, CardHeader, CardBody, CardFooter };

// Usage
import { Card, CardHeader, CardBody, CardFooter } from './Card';

function App() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <CardBody>Content goes here</CardBody>
      <CardFooter>Footer text</CardFooter>
    </Card>
  );
}
```

---

## Props Passing and Destructuring

### The Evolution of Props

#### Stage 1: Accessing Props Directly

```javascript
function ProfileCard(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <p>{props.bio}</p>
      <p>{props.age} years old</p>
    </div>
  );
}
```

**Problem**: Repetitive `props.` prefix everywhere.

#### Stage 2: Extracting Variables

```javascript
function ProfileCard(props) {
  const { name, bio, age } = props;
  
  return (
    <div>
      <h1>{name}</h1>
      <p>{bio}</p>
      <p>{age} years old</p>
    </div>
  );
}
```

**Better**: Cleaner, but still an extra line.

#### Stage 3: Destructuring in Parameters (RECOMMENDED)

```javascript
function ProfileCard({ name, bio, age }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>{bio}</p>
      <p>{age} years old</p>
    </div>
  );
}
```

**Best**: Clean, concise, and readable!

### Advanced Destructuring Patterns

#### Nested Object Destructuring

```javascript
function UserProfile({ 
  user: { 
    personalInfo: { name, email },
    settings: { theme, notifications }
  },
  avatar 
}) {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h1>{name}</h1>
      <p>{email}</p>
      <p>Theme: {theme}</p>
    </div>
  );
}

// Usage
<UserProfile 
  user={{
    personalInfo: { name: "Alice", email: "alice@example.com" },
    settings: { theme: "dark", notifications: true }
  }}
  avatar="/avatar.jpg"
/>
```

#### Default Values in Destructuring

```javascript
function Button({ 
  label = "Click me",
  variant = "primary",
  size = "medium",
  onClick 
}) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// All props are optional with defaults
<Button />
<Button label="Submit" variant="success" />
```

#### Rest Operator for Remaining Props

```javascript
function Button({ variant = "primary", onClick, children, ...restProps }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      {...restProps} // Spread all remaining props (id, className, aria-label, etc.)
    >
      {children}
    </button>
  );
}

// Usage
<Button 
  variant="primary" 
  id="submit-btn"
  className="custom-class"
  aria-label="Submit form"
  onClick={handleClick}
>
  Submit
</Button>
```

### Props vs State - Key Differences

| Feature | Props | State |
|---------|-------|-------|
| **Source** | Parent component | Component itself |
| **Mutability** | Immutable (read-only) | Mutable |
| **Changes** | Parent component changes | setState or useState |
| **Purpose** | Pass data down | Manage local data |
| **Flow** | One-way downward | Local to component |

```javascript
// NOTE: This example uses useState for illustration only
// You'll learn useState in detail on Day 4

function Counter({ initialValue }) {
  // initialValue is a prop (passed from parent)
  // Props are read-only and can't be changed
  return (
    <div>
      <p>Initial Value: {initialValue}</p>
      <p>Note: This component receives {initialValue} as a prop</p>
    </div>
  );
}

// Usage
<Counter initialValue={10} />

// Props vs State (conceptual understanding):
// - Props: Data passed FROM parent TO child
// - State: Data managed WITHIN the component (learn in Day 4)
```

---

## Props Validation with PropTypes

### Why Use PropTypes?

**Analogy**: PropTypes are like **type checkers** at a restaurant:
- They ensure you're serving the right food to the right table
- Catch mistakes before they reach customers
- Provide clear error messages
- Make your code self-documenting

### Installation

```bash
npm install prop-types
```

### Basic PropTypes

```javascript
import PropTypes from 'prop-types';

function ProfileCard({ name, age, isVerified, email }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      {isVerified && <span>✓ Verified</span>}
      <p>{email}</p>
    </div>
  );
}

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  isVerified: PropTypes.bool,
  email: PropTypes.string
};

export default ProfileCard;
```

### Complete PropTypes Reference

```javascript
import PropTypes from 'prop-types';

function MyComponent({
  // Primitives
  name,           // string
  age,            // number
  isActive,       // bool
  optional,       // any (no validation)
  
  // Complex types
  user,           // object
  items,          // array
  callback,       // function
  node,           // renderable (string, number, element, array)
  element,        // React element
  elementType,    // React component type
  
  // Specific instances
  date,           // Date instance
  error,          // Error instance
  
  // Unions
  status,         // one of several values
  id              // one of several types
}) {
  // component code
}

MyComponent.propTypes = {
  // Primitive types
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool,
  optional: PropTypes.any,
  
  // Specific values
  status: PropTypes.oneOf(['pending', 'approved', 'rejected']),
  priority: PropTypes.oneOf([1, 2, 3, 4, 5]),
  
  // Multiple possible types
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  
  // Arrays
  items: PropTypes.array,
  numbers: PropTypes.arrayOf(PropTypes.number),
  mixedArray: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  ),
  
  // Objects
  user: PropTypes.object,
  userInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    age: PropTypes.number
  }),
  
  // Objects with specific keys
  user: PropTypes.exact({
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    verified: PropTypes.bool
  }),
  
  // Functions
  onClick: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  
  // React-specific
  children: PropTypes.node,
  header: PropTypes.element,
  footer: PropTypes.elementType,
  
  // Instances
  date: PropTypes.instanceOf(Date),
  error: PropTypes.instanceOf(Error),
  
  // Custom validators
  email: function(props, propName, componentName) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props[propName])) {
      return new Error(
        `Invalid email format in ${componentName}`
      );
    }
  },
  
  // Required vs Optional
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.string
};

MyComponent.defaultProps = {
  isActive: false,
  age: 18,
  status: 'pending'
};

export default MyComponent;
```

### Advanced: Custom Validators

```javascript
function UserProfile({ 
  username, 
  email, 
  age, 
  role 
}) {
  return (
    <div>
      <h1>{username}</h1>
      <p>{email}</p>
      <p>Age: {age}</p>
      <p>Role: {role}</p>
    </div>
  );
}

UserProfile.propTypes = {
  // Custom validator with regex
  username: function(props, propName, componentName) {
    const username = props[propName];
    
    if (!username) {
      return new Error(`${propName} is required in ${componentName}`);
    }
    
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return new Error(
        `${propName} in ${componentName} must be 3-20 characters and contain only letters, numbers, and underscores`
      );
    }
  },
  
  // Email validation
  email: function(props, propName, componentName) {
    const email = props[propName];
    
    if (!email) return new Error(`${propName} is required`);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Error(`Invalid email format in ${componentName}`);
    }
  },
  
  // Age range validation
  age: function(props, propName, componentName) {
    const age = props[propName];
    
    if (typeof age !== 'number') {
      return new Error(`${propName} must be a number`);
    }
    
    if (age < 0 || age > 150) {
      return new Error(`${propName} must be between 0 and 150`);
    }
  },
  
  // Role validation
  role: PropTypes.oneOf(['user', 'admin', 'moderator']).isRequired
};

export default UserProfile;
```

### PropTypes in Production

**Important**: PropTypes only work in development mode. They're stripped in production builds for performance.

```javascript
// In development
if (process.env.NODE_ENV !== 'production') {
  MyComponent.propTypes = {
    name: PropTypes.string.isRequired
  };
}
```

---

## Practice Exercise: Build a ProfileCard Component

### Exercise Requirements

Create a `ProfileCard` component with:
- ✅ Name, avatar, and bio props
- ✅ Proper PropTypes validation
- ✅ Destructured props
- ✅ Default values
- ✅ Conditional rendering
- ✅ Beautiful styling

### Step 1: Basic Component

```javascript
// src/ProfileCard.jsx
function ProfileCard({ name, avatar, bio }) {
  return (
    <div className="profile-card">
      <img src={avatar} alt={name} className="avatar" />
      <h2>{name}</h2>
      <p>{bio}</p>
    </div>
  );
}

export default ProfileCard;
```

### Step 2: Add PropTypes

```javascript
// src/ProfileCard.jsx
import PropTypes from 'prop-types';

function ProfileCard({ 
  name, 
  avatar, 
  bio,
  age,
  location,
  isVerified 
}) {
  return (
    <div className="profile-card">
      <div className="avatar-container">
        <img src={avatar} alt={name} className="avatar" />
        {isVerified && <span className="verified-badge">✓</span>}
      </div>
      <h2>{name}</h2>
      <p className="bio">{bio}</p>
      {age && <p className="info">Age: {age}</p>}
      {location && <p className="info">📍 {location}</p>}
    </div>
  );
}

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  age: PropTypes.number,
  location: PropTypes.string,
  isVerified: PropTypes.bool
};

ProfileCard.defaultProps = {
  isVerified: false
};

export default ProfileCard;
```

### Step 3: Enhanced Version with More Features

```javascript
// src/ProfileCard.jsx
import PropTypes from 'prop-types';

function ProfileCard({ 
  name, 
  avatar, 
  bio,
  age,
  location,
  isVerified,
  occupation,
  socialLinks,
  onFollowClick
}) {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar-container">
          <img src={avatar} alt={name} className="avatar" />
          {isVerified && <span className="verified-badge" title="Verified">✓</span>}
        </div>
      </div>
      
      <div className="profile-content">
        <h2>{name}</h2>
        {occupation && <p className="occupation">{occupation}</p>}
        <p className="bio">{bio}</p>
        
        <div className="profile-info">
          {age && <span className="info-item">🎂 {age}</span>}
          {location && <span className="info-item">📍 {location}</span>}
        </div>
        
        {socialLinks && socialLinks.length > 0 && (
          <div className="social-links">
            <span>Connect:</span>
            {socialLinks.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                {link.platform}
              </a>
            ))}
          </div>
        )}
        
        <button onClick={onFollowClick} className="follow-btn">
          Follow
        </button>
      </div>
    </div>
  );
}

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  age: PropTypes.number,
  location: PropTypes.string,
  isVerified: PropTypes.bool,
  occupation: PropTypes.string,
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      platform: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  onFollowClick: PropTypes.func
};

ProfileCard.defaultProps = {
  isVerified: false,
  onFollowClick: () => console.log('Follow clicked')
};

export default ProfileCard;
```

### Step 4: Styling

```css
/* src/ProfileCard.css */
.profile-card {
  max-width: 350px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

.profile-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px 60px;
  text-align: center;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 5px solid white;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #10b981;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border: 3px solid white;
}

.profile-content {
  padding: 20px;
  text-align: center;
}

.profile-content h2 {
  margin: 0 0 5px 0;
  color: #1f2937;
  font-size: 24px;
}

.occupation {
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 15px 0;
}

.bio {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 15px 0;
}

.profile-info {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.info-item {
  color: #6b7280;
  font-size: 14px;
}

.social-links {
  margin: 15px 0;
  padding: 15px;
  background: #f9fafb;
  border-radius: 10px;
}

.social-links span {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
}

.social-links a {
  display: inline-block;
  margin: 0 5px;
  padding: 5px 12px;
  background: white;
  border-radius: 20px;
  text-decoration: none;
  color: #667eea;
  font-size: 12px;
  font-weight: 600;
}

.follow-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.follow-btn:hover {
  transform: scale(1.02);
}

.follow-btn:active {
  transform: scale(0.98);
}
```

### Step 5: Usage Example

```javascript
// src/App.jsx
import './App.css';
import ProfileCard from './ProfileCard';
import './ProfileCard.css';

function App() {
  const handleFollow = (name) => {
    console.log(`Following ${name}`);
    // Add your follow logic here
  };

  return (
    <div className="App">
      <h1>Profile Cards</h1>
      
      <div className="profiles-container">
        <ProfileCard
          name="Sarah Chen"
          avatar="https://i.pravatar.cc/150?img=1"
          bio="Full-stack developer passionate about creating beautiful web experiences. Love React, TypeScript, and coffee ☕"
          age={28}
          location="San Francisco, CA"
          occupation="Senior Software Engineer"
          isVerified={true}
          socialLinks={[
            { platform: 'Twitter', url: 'https://twitter.com/sarah' },
            { platform: 'GitHub', url: 'https://github.com/sarah' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/sarah' }
          ]}
          onFollowClick={() => handleFollow('Sarah')}
        />

        <ProfileCard
          name="Alex Johnson"
          avatar="https://i.pravatar.cc/150?img=5"
          bio="Product designer focused on user-centered design. Always sketching new ideas ✏️"
          age={26}
          location="New York, NY"
          occupation="UX Designer"
          socialLinks={[
            { platform: 'Dribbble', url: 'https://dribbble.com/alex' },
            { platform: 'Behance', url: 'https://behance.net/alex' }
          ]}
        />
      </div>
    </div>
  );
}

export default App;
```

---

## Key Takeaways

### ✅ What You Learned Today

1. **Functional Components**: Modern, clean syntax for React components
2. **Props Destructuring**: Clean way to access props
3. **PropTypes**: Validate props and catch errors early
4. **Advanced Patterns**: Rest operator, defaults, custom validators
5. **Best Practices**: Component organization and structure

### 🎯 Key Concepts

- Use functional components for all new code
- Destructure props in parameters for cleaner code
- Always use PropTypes in development
- Provide default props for optional values
- Validate props to catch bugs early

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ Rendering lists with `map()`
- ✅ Understanding the importance of keys
- ✅ Conditional rendering techniques
- ✅ Building dynamic UIs

### 💡 Practice Ideas

1. Create a `ProductCard` component with PropTypes
2. Build a `FormInput` component with validation props
3. Make a `Button` component with variants and sizes
4. Create a `Modal` component with custom validators

---

## Advanced Component Patterns

> **📌 Note**: These advanced patterns will be covered in later days. Day 2 focuses on functional components and props only.

### Coming in Later Days:

- **Higher-Order Components (HOC)**: Day 21
- **Render Props Pattern**: Day 20
- **Compound Components Pattern**: Day 19
- **Context API**: Days 14-15
- **Hooks (useState, useEffect)**: Days 4-11

**Day 2 Focus**: Master components and props first! These advanced patterns build on the foundations you're learning today.

---

## Component Composition Strategies

### 1. Container/Presentational Pattern (Conceptual)

> **📌 Note**: This pattern involves useState and useEffect, which you'll learn in Days 4-9. Here's the basic concept:

**Idea**: Split components into two types:
- **Container**: Handles logic and state (you'll learn this with hooks later)
- **Presentational**: Handles UI display (receives props, displays data)

For now, focus on building **presentational components** with props:

```javascript
// Presentational Component (pure, receives props)
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.avatar} alt={user.name} />
    </div>
  );
}

// Presentational Component with multiple props
function UserCard({ name, email, role, isVerified }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <span>Role: {role}</span>
      {isVerified && <span className="verified">✓</span>}
    </div>
  );
}
```

---

## Performance Optimization Basics

### React.memo for Preventing Re-renders

```javascript
import { memo } from 'react';

const UserCard = memo(function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
});
```

---

## Debugging Components

### Using React DevTools Profiler

1. Open React DevTools
2. Click "Profiler" tab
3. Record interaction
4. Analyze render times
5. Optimize slow components

### Adding Console Logs

```javascript
function Component({ props }) {
  console.log('Component props:', props);
  console.log('Component rendering');
  
  return <div>Content</div>;
}
```

---

**Great progress! 🎉 See you tomorrow for Day 3: Rendering Lists & Keys!**

---

## JavaScript Foundations for React

Since React components are JavaScript functions, understanding these concepts is crucial.

### Arrow Functions Deep Dive

#### Arrow Function Syntax

```javascript
// Traditional function
function greet(name) {
  return `Hello, ${name}`;
}

// Arrow function - equivalent
const greet = (name) => {
  return `Hello, ${name}`;
};

// Arrow function - implicit return
const greet = (name) => `Hello, ${name}`;

// Arrow function - single parameter (no parentheses needed)
const greet = name => `Hello, ${name}`;

// Arrow function - no parameters
const greet = () => 'Hello, World';
```

#### Arrow Functions in React Components

```javascript
// Arrow function component
const Greeting = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// Arrow function with implicit return
const Greeting = (props) => <h1>Hello, {props.name}</h1>;

// Arrow function with destructured props
const Greeting = ({ name }) => <h1>Hello, {name}</h1>;
```

### JavaScript Destructuring

#### Object Destructuring

```javascript
// Basic destructuring
const user = { name: 'Alice', age: 25 };
const { name, age } = user;
console.log(name, age); // 'Alice', 25

// Destructuring with renaming
const { name: userName, age: userAge } = user;

// Destructuring with defaults
const { name, age, city = 'Unknown' } = user;

// Nested destructuring
const user = {
  name: 'Alice',
  address: {
    street: '123 Main St',
    city: 'New York'
  }
};

const { name, address: { street, city } } = user;
```

#### Array Destructuring

```javascript
// Basic array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second, third] = colors;

// Skip elements
const [first, , third] = colors;

// With defaults
const [first = 'red', second = 'green'] = colors;

// Rest operator
const [first, ...rest] = colors;
```

#### Destructuring in Function Parameters

```javascript
// Regular destructuring
function greet(user) {
  const { name, age } = user;
  return `Hello, ${name}, age ${age}`;
}

// Destructuring in parameters
function greet({ name, age }) {
  return `Hello, ${name}, age ${age}`;
}

// With defaults
function greet({ name = 'Guest', age = 0 }) {
  return `Hello, ${name}, age ${age}`;
}
```

### Spread Operator

#### Spreading Arrays

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Concatenate arrays
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Add elements
const withNew = [0, ...arr1, 4]; // [0, 1, 2, 3, 4]
```

#### Spreading Objects

```javascript
const user = { name: 'Alice', age: 25 };

// Copy object
const copy = { ...user };

// Add/override properties
const updated = { ...user, age: 26 };

// Merge objects
const address = { street: '123 Main' };
const full = { ...user, ...address };
```

#### Spread in React Props

```javascript
function Button({ variant, children, ...restProps }) {
  return (
    <button
      className={`btn btn-${variant}`}
      {...restProps} // Spread remaining props
    >
      {children}
    </button>
  );
}

// Usage
<Button 
  variant="primary" 
  onClick={handleClick}
  id="my-button"
  aria-label="Submit"
>
  Click me
</Button>
```

---

## TypeScript Preview (Optional)

While these notes focus on JavaScript, understanding types helps with PropTypes.

### TypeScript Basics

```typescript
// Type annotations
let name: string = 'Alice';
let age: number = 25;
let isActive: boolean = true;

// Interface for objects
interface User {
  name: string;
  age: number;
  email?: string; // Optional
}

// Function with types
function greet(name: string): string {
  return `Hello, ${name}`;
}

// React component with TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} className={variant}>{label}</button>;
}
```

---

## Component Design Patterns

### Presentational vs Container Components

#### Presentational Components (Dumb Components)

```javascript
// Pure presentational component
function UserCard({ name, email, avatar }) {
  return (
    <div className="user-card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
}
```

**Characteristics:**
- Receive data via props
- Don't have state
- Don't know where data comes from
- Easy to test
- Reusable

#### Container Components (Smart Components)

```javascript
// Container component with logic
function UserContainer() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return <UserCard {...user} />;
}
```

**Characteristics:**
- Manage state
- Fetch data
- Handle logic
- Pass data to presentational components

---

## Understanding Props Deeply

### Props Are Immutable

```javascript
// ❌ WRONG - Trying to modify props
function BadComponent({ user }) {
  user.name = 'Changed'; // Error: Cannot assign to 'name'
  user.age = 30; // Error: Cannot assign to 'age'
  return <div>{user.name}</div>;
}

// ✅ CORRECT - Create new objects
function GoodComponent({ user }) {
  const displayName = user.name.toUpperCase();
  const nextYearAge = user.age + 1;
  return <div>{displayName} will be {nextYearAge}</div>;
}
```

### Props vs State

**Fundamental Difference:**
- **Props**: Data flowing down from parent (read-only)
- **State**: Data managed internally by component (writable)

```javascript
// NOTE: This is a conceptual example showing props vs state
// You'll learn actual state management with useState on Day 4

function Counter({ initialCount }) {
  // initialCount is a PROP (passed from parent, read-only)
  // In Day 4, you'll learn about STATE (internal, changeable data)
  
  return (
    <div>
      <p>Received initial count: {initialCount}</p>
      <p>Note: Props are read-only. You can't change {initialCount} here.</p>
    </div>
  );
}

// Usage
<Counter initialCount={5} />

// Concepts (learn in detail on Day 4):
// - Props: Data FROM parent, read-only
// - State: Data INSIDE component, can be changed
```

---

## Props Patterns in Real Applications

### Pattern 1: Controlled Components (Conceptual)

> **📌 Note**: Controlled components use useState. You'll learn this in detail on Day 6 (Forms & Controlled Components).

```javascript
// This component receives value and onChange as props
function ControlledInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

// In Day 6, you'll learn how parent components use useState
// For now, understand that this component receives two props:
// - value: The current value
// - onChange: A function to call when input changes
```

### Pattern 2: Compound Props

```javascript
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### Pattern 3: Configuration Objects

```javascript
function Dashboard({ config }) {
  const { theme, layout, columns } = config;
  
  return (
    <div className={`dashboard ${theme} ${layout}`}>
      {columns.map(col => (
        <Column key={col.id} config={col} />
      ))}
    </div>
  );
}

// Usage
<Dashboard
  config={{
    theme: 'dark',
    layout: 'grid',
    columns: [
      { id: 1, title: 'Column 1' },
      { id: 2, title: 'Column 2' }
    ]
  }}
/>
```

---

## PropTypes Advanced Validation

### Cross-Property Validation

```javascript
function AgeValidation(props, propName, componentName) {
  const { age, minAge, maxAge } = props;
  
  if (age !== undefined && minAge !== undefined && age < minAge) {
    return new Error(`${propName} must be at least ${minAge} in ${componentName}`);
  }
  
  if (age !== undefined && maxAge !== undefined && age > maxAge) {
    return new Error(`${propName} must be at most ${maxAge} in ${componentName}`);
  }
  
  return null;
}

function UserProfile({ name, age, minAge, maxAge }) {
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
    </div>
  );
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: AgeValidation,
  minAge: PropTypes.number,
  maxAge: PropTypes.number
};
```

---

## Component Architecture Best Practices

### File Organization

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   ├── Button.test.js
│   │   │   └── index.js
│   │   └── Input/
│   ├── features/
│   │   ├── ProfileCard/
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfileCard.css
│   │   │   └── index.js
│   │   └── ProductCard/
└── utils/
```

### Component Size Guidelines

```javascript
// ✅ GOOD - Small, focused component (50-100 lines)
function UserAvatar({ user, size = 'medium' }) {
  return (
    <div className={`avatar avatar-${size}`}>
      <img src={user.avatar} alt={user.name} />
    </div>
  );
}

// ❌ BAD - Too large, does too much (200+ lines)
function MassiveComponent({ /* 20+ props */ }) {
  // Hundreds of lines of logic
}
```

---

## Testing Components with Props

### Basic Component Testing

```javascript
import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';

test('renders profile card with props', () => {
  const props = {
    name: 'Alice',
    avatar: '/avatar.jpg',
    bio: 'Developer'
  };
  
  render(<ProfileCard {...props} />);
  
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Developer')).toBeInTheDocument();
});
```

---

## Performance Considerations

### Props and Re-rendering (Conceptual)

> **📌 Note**: Full re-rendering behavior will be covered when you learn useState (Day 4) and React.memo (Day 74).

**Key Concept**: When a parent component updates, child components with changed props will also re-render.

```javascript
// Simple example (using constant props)
function App() {
  const user = { name: 'Alice', age: 25 };
  const settings = { theme: 'dark', language: 'en' };
  
  return (
    <div>
      {/* Both components receive props */}
      <UserProfile user={user} />
      <SettingsPanel settings={settings} />
    </div>
  );
}

// Child components receive and display props
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.age}</p>
    </div>
  );
}

function SettingsPanel({ settings }) {
  return (
    <div>
      <p>Theme: {settings.theme}</p>
      <p>Language: {settings.language}</p>
    </div>
  );
}
```

### Optimizing with React.memo (Preview)

> **📌 Note**: React.memo will be covered in detail on Day 74 (Performance Optimization).

`React.memo` is a higher-order component that prevents unnecessary re-renders. Here's the basic concept:

```javascript
import { memo } from 'react';

// Wraps component to prevent re-renders when props haven't changed
const UserProfile = memo(function UserProfile({ user }) {
  console.log('UserProfile rendering');
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.age}</p>
    </div>
  );
});

// In Day 74, you'll learn:
// - When to use React.memo
// - Performance implications
// - When NOT to use it
```

---

## Common Pitfalls with Props

### Pitfall 1: Mutating Props Objects

```javascript
// ❌ WRONG
function BadComponent({ user }) {
  user.name = 'Modified'; // Mutates prop!
  return <div>{user.name}</div>;
}

// ✅ CORRECT
function GoodComponent({ user }) {
  const updatedUser = { ...user, name: 'Modified' };
  return <div>{updatedUser.name}</div>;
}
```

### Pitfall 2: Creating New Objects Every Render

```javascript
// ❌ WRONG - New object on every render
function BadComponent() {
  const user = { name: 'Alice', age: 25 }; // New object!
  return <UserCard user={user} />;
}

// ✅ CORRECT - Stable reference (for Day 13 concept)
function GoodComponent() {
  // Using a constant prevents new object creation on each render
  const user = { name: 'Alice', age: 25 };
  return <UserCard user={user} />;
}

// NOTE: useMemo will be covered in Day 13 (useMemo Hook)
// For now, just use constants or stable references
```

---

## Props Drilling and Solutions

### Understanding Prop Drilling

Prop drilling occurs when you pass props through many levels just to get data to a deeply nested component.

```javascript
// Prop drilling example
function App() {
  const theme = 'dark';
  return <Page theme={theme} />; // Level 1
}

function Page({ theme }) {
  return <Header theme={theme} />; // Level 2
}

function Header({ theme }) {
  return <Navigation theme={theme} />; // Level 3
}

function Navigation({ theme }) {
  return <Button theme={theme} />; // Level 4 - finally uses theme
}
```

**Solution**: Context API (learn later) or composition patterns.

---

## Building Production Components

### Accessibility with Props

```javascript
function Button({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false,
  ariaLabel,
  ...props 
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props} // Spread for extra props
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string
};
```

### Error Boundaries (Preview)

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

---

## Resources & Official Documentation

### Essential Reading

1. **React Official Docs**
   - [Components and Props](https://react.dev/learn/passing-props-to-a-component)
   - [Your First Component](https://react.dev/learn/describing-the-ui)

2. **JavaScript Fundamentals**
   - [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
   - [MDN: Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

3. **PropTypes Documentation**
   - [npm: prop-types](https://www.npmjs.com/package/prop-types)

---

## Interview Questions (30+)

### Q1: What are props in React?

**Answer**: Props (short for properties) are read-only data passed from parent to child components. They are JavaScript objects containing key-value pairs.

### Q2: Can you modify props in React?

**Answer**: No. Props are immutable. Attempting to modify props directly will cause errors. If you need to change data, use state in the component.

### Q3: What's the difference between props and state?

**Answer**: 
- **Props**: Passed from parent, read-only, flow downward
- **State**: Managed internally, writable, local to component

### Q4: How do you pass functions as props?

**Answer**: Treat functions as regular prop values:

```javascript
function Button({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}

function Parent() {
  const handleClick = () => console.log('clicked');
  return <Button onClick={handleClick} />;
}
```

### Q5: What happens when you pass undefined props?

**Answer**: Props are `undefined` if not provided. Use default parameters or conditional rendering to handle this.

---

---

## Real-World Component Examples

### Example 1: E-commerce Product Card

```javascript
function ProductCard({ product, onAddToCart }) {
  const { id, name, price, image, discount, stock } = product;
  const finalPrice = discount ? price * (1 - discount) : price;
  
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={name} />
        {discount > 0 && (
          <span className="discount-badge">-{discount * 100}%</span>
        )}
        {stock === 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>
      
      <div className="product-info">
        <h3>{name}</h3>
        <div className="price">
          {discount > 0 && (
            <span className="original-price">${price.toFixed(2)}</span>
          )}
          <span className="final-price">${finalPrice.toFixed(2)}</span>
        </div>
        
        {stock > 0 ? (
          <button 
            onClick={() => onAddToCart(id)}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        ) : (
          <button disabled className="add-to-cart-btn">
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    discount: PropTypes.number,
    stock: PropTypes.number.isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};
```

### Example 2: Social Media Post Card

```javascript
function PostCard({ post, onLike, onComment, currentUser }) {
  const { author, content, timestamp, likes, comments, image } = post;
  const hasLiked = likes.some(like => like.userId === currentUser.id);
  
  return (
    <div className="post-card">
      <div className="post-header">
        <img src={author.avatar} alt={author.name} className="avatar" />
        <div>
          <h3>{author.name}</h3>
          <p className="timestamp">{new Date(timestamp).toLocaleDateString()}</p>
        </div>
      </div>
      
      {content && <p className="post-content">{content}</p>}
      {image && <img src={image} alt="Post" className="post-image" />}
      
      <div className="post-actions">
        <button 
          onClick={() => onLike(post.id)}
          className={hasLiked ? 'liked' : ''}
        >
          ❤️ {likes.length}
        </button>
        <button onClick={() => onComment(post.id)}>
          💬 {comments.length}
        </button>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired,
    content: PropTypes.string,
    timestamp: PropTypes.string.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    image: PropTypes.string
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onComment: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired
};
```

### Example 3: Dashboard Widget

```javascript
function DashboardWidget({ title, value, trend, icon, onClick }) {
  return (
    <div className="dashboard-widget" onClick={onClick}>
      <div className="widget-icon">{icon}</div>
      <div className="widget-content">
        <h3 className="widget-title">{title}</h3>
        <p className="widget-value">{value.toLocaleString()}</p>
        {trend && (
          <p className={`widget-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  );
}

DashboardWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  trend: PropTypes.number,
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func
};
```

---

## Advanced PropTypes Patterns

### Pattern 1: Enforcing Specific Prop Combinations

```javascript
function FormField({ label, value, onChange, type, required }) {
  const validator = (props, propName, componentName) => {
    if (required && !props.label) {
      return new Error(`${componentName}: label is required when field is required`);
    }
  };
  
  return (
    <div className="form-field">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password']),
  required: PropTypes.bool
};

// Custom validator
FormField.propTypes.customValidator = function(props, propName, componentName) {
  if (props.required && !props.label) {
    return new Error('label is required when field is required');
  }
};
```

---

## Component Composition Patterns

### Pattern 1: Composition with Children

```javascript
function Card({ title, subtitle, children, footer }) {
  return (
    <div className="card">
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

// Usage with composition
<Card
  title="Dashboard"
  subtitle="Overview"
  footer={<button>Settings</button>}
>
  <Chart />
  <Stats />
</Card>
```

### Pattern 2: Render Props Pattern

```javascript
function DataRenderer({ data, render }) {
  if (!data) return <div>Loading...</div>;
  return render(data);
}

// Usage
<DataRenderer
  data={userData}
  render={(user) => (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )}
/>
```

---

## Props and Testing

### Testing Different Prop Scenarios

```javascript
import { render, screen } from '@testing-library/react';
import ProfileCard from './ProfileCard';

describe('ProfileCard', () => {
  test('renders with required props', () => {
    const props = {
      name: 'Alice',
      avatar: '/avatar.jpg',
      bio: 'Developer'
    };
    
    render(<ProfileCard {...props} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
  
  test('renders with optional props', () => {
    const props = {
      name: 'Bob',
      avatar: '/avatar.jpg',
      bio: 'Designer',
      age: 30,
      location: 'New York'
    };
    
    render(<ProfileCard {...props} />);
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
  });
  
  test('displays verification badge when verified', () => {
    const props = {
      name: 'Charlie',
      avatar: '/avatar.jpg',
      bio: 'Manager',
      isVerified: true
    };
    
    render(<ProfileCard {...props} />);
    expect(screen.getByTitle('Verified')).toBeInTheDocument();
  });
});
```

---

## Production Checklist for Components

### Before Deploying Your Component

- [ ] PropTypes defined for all props
- [ ] Default props provided where appropriate
- [ ] Component is accessible (ARIA labels, keyboard navigation)
- [ ] Works on mobile devices
- [ ] Handles edge cases (null, undefined, empty data)
- [ ] No console errors or warnings
- [ ] Optimized for performance (React.memo if needed)
- [ ] Follows naming conventions
- [ ] Has comments for complex logic
- [ ] Tested with different prop combinations
- [ ] Responsive design implemented
- [ ] Loading and error states handled
- [ ] Security considerations addressed
- [ ] Browser compatibility checked
- [ ] Documentation added

---

## Conclusion

You now have comprehensive understanding of:
- ✅ Functional component patterns (beginner to advanced)
- ✅ Props destructuring and spreading (all techniques)
- ✅ PropTypes validation (complete reference)
- ✅ Component composition (basic patterns)
- ✅ Building production components
- ✅ Testing strategies
- ✅ Real-world patterns

> **📌 What's Next**: Tomorrow (Day 3) you'll learn to render lists with Array.map() and the importance of keys.

### Ready for Day 3!

Tomorrow you'll master:
- Array.map() for rendering lists
- The importance of keys
- Conditional rendering techniques
- Building dynamic UIs

**Keep practicing! Mastery comes from building real applications. 🚀**

**Congratulations! You've completed Day 2 with deep understanding of Components & Props! 🎉**

---

## Additional Practice Ideas

1. Build a Todo card with priority colors
2. Create a News article card with categories
3. Make a Recipe card with ingredients list
4. Build a User dashboard widget
5. Create a Notification badge component
6. Make a Pricing card with multiple tiers
7. Build a Review card with ratings
8. Create a Product filter sidebar
