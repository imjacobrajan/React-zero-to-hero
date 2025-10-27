// Day 4 Practice: useState Hook Examples
// Topic: State management with useState

import { useState } from 'react';

// Practice 1: Simple Counter
function SimpleCounter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// Practice 2: Counter with Multiple Operations
function AdvancedCounter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);
  
  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => {
    setCount(0);
    setStep(1);
  };
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <div>
        <label>
          Step: 
          <input 
            type="number" 
            value={step} 
            onChange={(e) => setStep(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <button onClick={decrement}>-{step}</button>
        <button onClick={increment}>+{step}</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

// Practice 3: Toggle Component
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  
  const handleToggle = () => {
    setIsOn(prev => !prev);
  };
  
  return (
    <div>
      <button onClick={handleToggle}>
        {isOn ? 'ON' : 'OFF'}
      </button>
      <p>The switch is {isOn ? 'on' : 'off'}</p>
    </div>
  );
}

// Practice 4: String Input
function TextInput() {
  const [text, setText] = useState('');
  
  return (
    <div>
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
      <p>Character count: {text.length}</p>
      <button onClick={() => setText('')}>Clear</button>
    </div>
  );
}

// Practice 5: Object State
function UserProfile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
  });
  
  const updateName = () => {
    setUser({ ...user, name: 'Jane Doe' });
  };
  
  const updateAge = () => {
    setUser({ ...user, age: user.age + 1 });
  };
  
  return (
    <div>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateAge}>Happy Birthday!</button>
    </div>
  );
}

// Practice 6: Array State - Todo List
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input,
        completed: false 
      }]);
      setInput('');
    }
  };
  
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div>
      <h2>Todo List</h2>
      <div>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              style={{ 
                textDecoration: todo.completed ? 'line-through' : 'none' 
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => toggleComplete(todo.id)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Practice 7: Form State
function UserForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agree: false
  });
  
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
        />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.agree}
            onChange={(e) => handleChange('agree', e.target.checked)}
          />
          I agree to terms
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

// Practice 8: Derived State
function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', price: 1.50, quantity: 2 },
    { id: 2, name: 'Banana', price: 0.75, quantity: 3 },
    { id: 3, name: 'Orange', price: 2.00, quantity: 1 }
  ]);
  
  // Derived state
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
    </div>
  );
}

export {
  SimpleCounter,
  AdvancedCounter,
  Toggle,
  TextInput,
  UserProfile,
  TodoList,
  UserForm,
  Cart
};
