import { useState, useEffect } from 'react';

function TodoListApp() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [newTodo, setNewTodo] = useState('');
  
  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);
  
  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // all
  });
  
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>My Todo List</h1>
      
      {/* Add Todo Input */}
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            marginLeft: '10px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>
      
      {/* Todo Stats */}
      <div style={{ marginBottom: '20px', color: '#666' }}>
        <span>Total: {todos.length} | </span>
        <span>Active: {activeCount} | </span>
        <span>Completed: {completedCount}</span>
      </div>
      
      {/* Filter Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            marginRight: '5px',
            padding: '5px 15px',
            background: filter === 'all' ? '#007bff' : '#f0f0f0',
            color: filter === 'all' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            marginRight: '5px',
            padding: '5px 15px',
            background: filter === 'active' ? '#007bff' : '#f0f0f0',
            color: filter === 'active' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '5px 15px',
            background: filter === 'completed' ? '#007bff' : '#f0f0f0',
            color: filter === 'completed' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Completed
        </button>
      </div>
      
      {/* Todo List */}
      {filteredTodos.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTodos.map(todo => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '5px',
                background: todo.completed ? '#f0f0f0' : 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                textDecoration: todo.completed ? 'line-through' : 'none',
                opacity: todo.completed ? 0.6 : 1
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '10px', cursor: 'pointer' }}
              />
              <span style={{ flex: 1 }}>{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: '5px 10px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#999'
          }}
        >
          {filter === 'all' && 'No todos yet. Add one above!'}
          {filter === 'active' && 'No active todos!'}
          {filter === 'completed' && 'No completed todos!'}
        </div>
      )}
      
      {/* Clear Completed Button */}
      {completedCount > 0 && (
        <button
          onClick={clearCompleted}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Completed ({completedCount})
        </button>
      )}
    </div>
  );
}

export default TodoListApp;

