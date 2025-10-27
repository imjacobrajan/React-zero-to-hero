# Day 2 Interview Questions: Components & Props

## Components & Props Fundamentals

### 1. What is Props Destructuring?
**Answer:** Props destructuring lets you extract props directly in the function parameters for cleaner code.

```javascript
// Without destructuring
function Component(props) {
  return <div>{props.name}</div>;
}

// With destructuring
function Component({ name }) {
  return <div>{name}</div>;
}
```

### 2. What are Default Props?
**Answer:** Default props provide fallback values for props that aren't provided by the parent component.

```javascript
function Button({ label = 'Click me' }) {
  return <button>{label}</button>;
}
```

### 3. What is PropTypes?
**Answer:** PropTypes is a library for type-checking props in React components. It helps catch bugs during development.

### 4. What are the main PropTypes types?
**Answer:**
- `PropTypes.string`
- `PropTypes.number`
- `PropTypes.bool`
- `PropTypes.array`
- `PropTypes.object`
- `PropTypes.func`
- `PropTypes.element`

### 5. What is the difference between PropTypes and TypeScript?
**Answer:** PropTypes validate props at runtime, while TypeScript validates at compile time.

### 6. How do you pass multiple props to a component?
**Answer:** You pass multiple props as separate attributes:

```javascript
<UserCard 
  name="John" 
  age={25} 
  email="john@example.com" 
/>
```

### 7. What is the `children` prop?
**Answer:** The `children` prop contains any content passed between opening and closing component tags.

```javascript
function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

### 8. Can you pass functions as props?
**Answer:** Yes, functions are first-class citizens in JavaScript and can be passed as props.

```javascript
<Button onClick={handleClick} />
```

### 9. What is the rest operator (...) in props?
**Answer:** The rest operator collects remaining props into an object.

```javascript
function Button({ variant, children, ...restProps }) {
  return <button className={variant} {...restProps}>{children}</button>;
}
```

### 10. What is prop drilling?
**Answer:** Prop drilling is when you pass props through multiple component levels, even when intermediate components don't use them.

## Coding Questions

### Q1: Create a component with PropTypes validation
```javascript
import PropTypes from 'prop-types';

function Product({ name, price, inStock }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>${price}</p>
      <p>{inStock ? 'In Stock' : 'Out of Stock'}</p>
    </div>
  );
}

Product.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  inStock: PropTypes.bool
};
```

### Q2: Use destructuring with default values
```javascript
function Greeting({ name = 'Guest', greeting = 'Hello' }) {
  return <h1>{greeting}, {name}!</h1>;
}
```

### Q3: Create a component that accepts children
```javascript
function Container({ title, children }) {
  return (
    <div className="container">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Q4: Use spread operator with props
```javascript
function Link({ children, ...props }) {
  return <a {...props}>{children}</a>;
}

// Usage
<Link href="/about" className="nav-link" data-id="1">
  About
</Link>
```

## Advanced Questions

### Q5: How would you validate nested objects?
```javascript
UserProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    address: PropTypes.shape({
      city: PropTypes.string,
      country: PropTypes.string
    })
  }).isRequired
};
```

### Q6: How would you validate arrays of objects?
```javascript
UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};
```

### Q7: How would you make props required or optional?
```javascript
Component.propTypes = {
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.string
};
```

## Common Mistakes

1. Forgetting `.isRequired` when a prop is mandatory
2. Not providing default values for optional props
3. Modifying props directly (props are read-only)
4. Using PropTypes in production builds (only in development)
5. Not destructuring props, leading to verbose code
