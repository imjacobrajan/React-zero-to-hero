// Day 3 Practice: Rendering Lists & Keys
// Topic: map(), keys, conditional rendering

import React from 'react';

// Practice 1: Basic List with map()
function SimpleList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Practice 2: List of Objects with Proper Keys
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

// Practice 3: List with Conditional Rendering
function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li 
          key={task.id}
          className={task.completed ? 'completed' : 'pending'}
        >
          {task.title}
          {task.completed && ' ✓'}
        </li>
      ))}
    </ul>
  );
}

// Practice 4: Filtered List
function ActiveUsers({ users }) {
  const activeUsers = users.filter(user => user.isActive);
  
  return (
    <div>
      <h2>Active Users ({activeUsers.length})</h2>
      {activeUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

function UserCard({ user }) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// Practice 5: List with Empty State
function ProductList({ products }) {
  if (products.length === 0) {
    return <p>No products available</p>;
  }
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

// Practice 6: Sorted List
function SortedProductList({ products }) {
  const sortedProducts = [...products].sort((a, b) => 
    a.price - b.price
  );
  
  return (
    <div>
      {sortedProducts.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

// Practice 7: Nested List
function CategoryList({ categories }) {
  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.items.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Practice 8: List with Index (only if stable)
function TodoList({ todos }) {
  return (
    <ol>
      {todos.map((todo, index) => (
        <li key={todo.id}>
          {index + 1}. {todo.text}
        </li>
      ))}
    </ol>
  );
}

// Practice 9: List with Actions
function ShoppingList({ items, onRemove }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

// Practice 10: Complex List with Multiple Conditions
function TaskBoard({ tasks }) {
  const todos = tasks.filter(t => t.status === 'todo');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const done = tasks.filter(t => t.status === 'done');
  
  return (
    <div>
      <div>
        <h2>To Do ({todos.length})</h2>
        {todos.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      <div>
        <h2>In Progress ({inProgress.length})</h2>
        {inProgress.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      
      <div>
        <h2>Done ({done.length})</h2>
        {done.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
}

export {
  SimpleList,
  UserList,
  TaskList,
  ActiveUsers,
  ProductList,
  SortedProductList,
  CategoryList,
  TodoList,
  ShoppingList,
  TaskBoard
};
