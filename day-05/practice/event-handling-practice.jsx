// Day 5 Practice: Event Handling
// Topic: onClick, onChange, onSubmit, event object

import { useState } from 'react';

// Practice 1: Basic Click Handler
function ClickButton() {
  const handleClick = () => {
    alert('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}

// Practice 2: Inline Click Handler
function InlineClickButton() {
  return <button onClick={() => console.log('Clicked!')}>Click</button>;
}

// Practice 3: onChange with Input
function TextInput() {
  const [text, setText] = useState('');
  
  const handleChange = (e) => {
    setText(e.target.value);
  };
  
  return (
    <div>
      <input type="text" onChange={handleChange} placeholder="Type here" />
      <p>You typed: {text}</p>
    </div>
  );
}

// Practice 4: onSubmit with Form
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Practice 5: Passing Arguments to Handler
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' },
    { id: 2, text: 'Build app' }
  ]);
  
  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// Practice 6: preventDefault
function PreventDefaultLink() {
  const handleClick = (e) => {
    e.preventDefault();
    console.log('Link clicked, navigation prevented');
  };
  
  return <a href="/page" onClick={handleClick}>Click (no navigation)</a>;
}

// Practice 7: stopPropagation
function EventBubbling() {
  const handleParent = () => console.log('Parent clicked');
  const handleChild = (e) => {
    e.stopPropagation();
    console.log('Child clicked');
  };
  
  return (
    <div onClick={handleParent} style={{ padding: '20px', background: 'lightblue' }}>
      Parent
      <button onClick={handleChild}>Child (stops bubbling)</button>
    </div>
  );
}

// Practice 8: Multiple Events
function MultipleEvents() {
  const [eventLog, setEventLog] = useState([]);
  
  const addLog = (eventType) => {
    setEventLog([...eventLog, `${eventType} at ${new Date().toLocaleTimeString()}`]);
  };
  
  return (
    <div>
      <button
        onClick={() => addLog('Click')}
        onMouseEnter={() => addLog('Mouse Enter')}
        onMouseLeave={() => addLog('Mouse Leave')}
      >
        Hover and Click
      </button>
      <ul>
        {eventLog.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

// Practice 9: Event Object Properties
function EventObjectDemo() {
  const handleClick = (e) => {
    console.log('Event Type:', e.type);
    console.log('Target:', e.target);
    console('Current Target:', e.currentTarget);
    console.log('Button:', e.button);
    console.log('Key:', e.key);
    console.log('TimeStamp:', e.timeStamp);
  };
  
  return <button onClick={handleClick}>Click and check console</button>;
}

// Practice 10: Form with Validation
function ValidatedForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !value.includes('@')) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      alert('Form submitted!');
    } else {
      setError('Please enter a valid email');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleChange}
        placeholder="Email"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}

export {
  ClickButton,
  InlineClickButton,
  TextInput,
  LoginForm,
  TodoList,
  PreventDefaultLink,
  EventBubbling,
  MultipleEvents,
  EventObjectDemo,
  ValidatedForm
};

