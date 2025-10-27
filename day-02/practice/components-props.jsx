// Day 2 Practice: Components & Props
// Topic: Functional Components, Props, PropTypes

import React from 'react';
import PropTypes from 'prop-types';

// Practice 1: Basic Component with Props
function UserCard({ name, email }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
}

// Practice 2: Component with Default Props
function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

Button.defaultProps = {
  label: 'Click me',
  variant: 'primary'
};

// Practice 3: Component with PropTypes
function Product({ name, price, inStock }) {
  return (
    <div className="product">
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

Product.defaultProps = {
  inStock: false
};

// Practice 4: Nested Props (Objects)
function Profile({ user }) {
  return (
    <div className="profile">
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Location: {user.location}</p>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired
  }).isRequired
};

// Practice 5: Array Props
function ShoppingList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

ShoppingList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

// Practice 6: Function Props
function Counter({ count, onIncrement, onDecrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  );
}

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired
};

// Practice 7: Component with children
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

// Practice 8: Spread Props
function Button({ className, children, ...restProps }) {
  return (
    <button 
      className={`btn ${className || ''}`}
      {...restProps}
    >
      {children}
    </button>
  );
}

export {
  UserCard,
  Button,
  Product,
  Profile,
  ShoppingList,
  Counter,
  Card
};
