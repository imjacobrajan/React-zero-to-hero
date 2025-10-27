# Day 2: Components & Props Deep Dive

## 📋 Table of Contents
- [Introduction](#introduction)
- [Functional Components Deep Dive](#functional-components-deep-dive)
- [Props Passing and Destructuring](#props-passing-and-destructuring)
- [Props Validation with PropTypes](#props-validation-with-proptypes)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome back! Today we're diving deeper into the building blocks of React: **components** and **props**. By the end of this day, you'll master:
- ✅ Functional components (the modern approach)
- ✅ Advanced prop passing techniques
- ✅ Props destructuring patterns
- ✅ PropTypes for type validation
- ✅ Building reusable components

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
function Counter({ initialValue }) {
  const [count, setCount] = useState(initialValue);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

// initialValue is a prop (passed from parent)
// count is state (managed internally)
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

**Great progress! 🎉 See you tomorrow for Day 3: Rendering Lists & Keys!**
