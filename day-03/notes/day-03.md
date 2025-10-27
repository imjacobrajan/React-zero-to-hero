# Day 3: Rendering Lists & Keys

## 📋 Table of Contents
- [Introduction](#introduction)
- [Array.map() for Rendering Lists](#arraymap-for-rendering-lists)
- [Key Prop Importance](#key-prop-importance)
- [Conditional Rendering Techniques](#conditional-rendering-techniques)
- [Practice Exercise](#practice-exercise)
- [Advanced Patterns](#advanced-patterns)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 3! Today you'll master one of the most common patterns in React: **rendering lists of data**. By the end of today, you'll:
- ✅ Understand how `array.map()` works in React (beginner to advanced)
- ✅ Know why keys are crucial for performance and stability
- ✅ Master conditional rendering for list scenarios (empty states, loading)
- ✅ Build dynamic, data-driven UIs with arrays
- ✅ Handle edge cases like empty lists, unique keys, and nested lists

> **📌 What's NOT in Day 3**: General conditional rendering patterns (ternary operators, logical &&, switch statements). Those will be covered comprehensively on Day 7.
> 
> **Day 3 Focus**: ONLY list rendering and keys - deeply and thoroughly.

**Today's Scope**:
1. `Array.map()` for transforming data into JSX
2. Key prop requirements and best practices
3. Rendering lists of primitives, objects, and complex data
4. Empty and loading states for lists
5. Nested lists and advanced patterns

---

## Array.map() for Rendering Lists

### Understanding map() Fundamentals

**Analogy**: Think of `map()` like a factory production line:
- Input: Raw materials (array of data)
- Process: Transformation machine (`map()` function)
- Output: Finished products (array of React elements)

### Basic map() Syntax

```javascript
// General JavaScript map()
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
// doubled = [2, 4, 6, 8, 10]

// React map() - returns JSX elements
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map(num => <li>{num}</li>)}
    </ul>
  );
}
```

### Rendering Simple Lists

#### Example 1: Basic Number List

```javascript
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map(num => (
        <li key={num}>{num}</li>
      ))}
    </ul>
  );
}

// Usage
<NumberList numbers={[1, 2, 3, 4, 5]} />
```

#### Example 2: String List

```javascript
function ShoppingList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Usage
<ShoppingList items={['Milk', 'Bread', 'Eggs']} />
```

### Rendering Lists of Objects

#### Example 3: Users List

```javascript
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

// Usage
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
];

<UserList users={users} />
```

#### Example 4: Products List with Details

```javascript
function ProductList({ products }) {
  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  );
}

// Usage
const products = [
  { 
    id: 1, 
    name: 'Laptop', 
    price: 999, 
    image: 'https://example.com/laptop.jpg' 
  },
  { 
    id: 2, 
    name: 'Mouse', 
    price: 25, 
    image: 'https://example.com/mouse.jpg' 
  }
];

<ProductList products={products} />
```

### Advanced map() Patterns

#### Nested map() - Rendering Nested Arrays

```javascript
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

// Usage
const categories = [
  {
    id: 1,
    name: 'Electronics',
    items: [
      { id: 101, name: 'Laptop' },
      { id: 102, name: 'Phone' }
    ]
  },
  {
    id: 2,
    name: 'Clothing',
    items: [
      { id: 201, name: 'Shirt' },
      { id: 202, name: 'Pants' }
    ]
  }
];

<CategoryList categories={categories} />
```

#### map() with Filter

```javascript
function ActiveUsers({ users }) {
  const activeUsers = users.filter(user => user.isActive);
  
  return (
    <ul>
      {activeUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### map() with Additional Logic

```javascript
function TaskList({ tasks }) {
  return (
    <div>
      {tasks.map((task, index) => (
        <div key={task.id} className={`task task-${task.priority}`}>
          <span className="task-number">{index + 1}</span>
          <span className="task-name">{task.name}</span>
          <span className="task-status">
            {task.completed ? '✓' : '○'}
          </span>
        </div>
      ))}
    </div>
  );
}
```

---

## Key Prop Importance

### Why Keys Matter

**Analogy**: Keys are like **name tags** at a school:
- Without keys: Teachers can't track individual students
- With keys: Teachers can identify and follow each student's progress
- React uses keys to efficiently update the DOM

### Understanding React's Reconciliation

When React updates the DOM, it needs to know which items changed, were added, or removed. Keys help React identify items across renders.

### How React Uses Keys

```javascript
// Without keys (BAD ❌)
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => <li>{todo.text}</li>)}
    </ul>
  );
}

// React can't tell items apart - causes issues!
```

```javascript
// With keys (GOOD ✅)
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}

// React can efficiently update specific items
```

### Key Rules

#### ✅ Good Keys

```javascript
// 1. Unique and stable IDs from database
{users.map(user => <User key={user.id} {...user} />)}

// 2. Generated UUIDs
const items = data.map(item => ({ ...item, id: uuid() }));
{items.map(item => <Item key={item.id} {...item} />)}

// 3. Composed unique keys (when no ID exists)
{categories.map(cat => (
  <Category key={`${cat.name}-${cat.level}`} {...cat} />
))}
```

#### ❌ Bad Keys

```javascript
// 1. Using array index (BAD for dynamic lists)
{items.map((item, index) => <Item key={index} {...item} />)}

// 2. Using random values (BAD - regenerates on every render)
{items.map(item => <Item key={Math.random()} {...item} />)}

// 3. Non-unique keys
{items.map(item => <Item key="same-key" {...item} />)}
```

### Deep Dive: Why Not Index?

```javascript
// Problem scenario
function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
    { id: 3, text: 'Task 3' }
  ]);

  const removeFirst = () => {
    setTasks(tasks.slice(1)); // Remove first task
  };

  return (
    <div>
      <button onClick={removeFirst}>Remove First</button>
      <ul>
        {tasks.map((task, index) => (
          <TaskItem 
            key={index}  // ❌ BAD - index changes when list changes!
            task={task} 
          />
        ))}
      </ul>
    </div>
  );
}

// When you remove first item:
// - Task 2 takes index 0
// - Task 3 takes index 1
// React thinks Task 1 became Task 2!
```

```javascript
// Solution: Use stable IDs
function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Task 1' },
    { id: 2, text: 'Task 2' },
    { id: 3, text: 'Task 3' }
  ]);

  const removeFirst = () => {
    setTasks(tasks.slice(1));
  };

  return (
    <div>
      <button onClick={removeFirst}>Remove First</button>
      <ul>
        {tasks.map(task => (
          <TaskItem 
            key={task.id}  // ✅ GOOD - ID is stable
            task={task} 
          />
        ))}
      </ul>
    </div>
  );
}
```

---

## Conditional Rendering for Lists Only

> **📌 Note**: This section covers ONLY conditional rendering needed for lists (empty states, loading). General conditional rendering (ternary, logical &&, switch) is covered on Day 7.

### Empty State Handling

When dealing with lists, you need to handle the case when the array is empty.

```javascript
function TodoList({ todos }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add your first todo!</p>
      </div>
    );
  }
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### Loading State for Lists

```javascript
function UserList({ isLoading, users }) {
  if (isLoading) {
    return <div>Loading users...</div>;
  }
  
  if (users.length === 0) {
    return <div>No users found</div>;
  }
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Conditional Rendering Inside List Items

When rendering list items, you can conditionally show elements based on data:

```javascript
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          {user.isVerified && <span>✓</span>}
          {user.isOnline && <span className="online-dot"></span>}
        </li>
      ))}
    </ul>
  );
}
```

#### ⚠️ Common Pitfall: && with 0

```javascript
// ❌ BAD - renders "0" when array is empty
{items.length && <ItemList items={items} />}

// ✅ GOOD - use boolean conversion
{items.length > 0 && <ItemList items={items} />}

// ✅ BETTER - use ternary with null
{items.length ? <ItemList items={items} /> : null}
```

### Filter Before Map

Sometimes you want to show only certain items in a list:

```javascript
function ActiveUsersList({ users }) {
  // Filter before mapping
  const activeUsers = users.filter(user => user.isActive);
  
  if (activeUsers.length === 0) {
    return <div>No active users</div>;
  }
  
  return (
    <ul>
      {activeUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Map and Filter Together

```javascript
function ProductList({ products }) {
  return (
    <ul>
      {products
        .filter(product => product.inStock)
        .map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
    </ul>
  );
}
```

---

## Practice Exercise: Product List

### Exercise: Build a Product List Component

Create a component that displays 10 products with:
- ✅ Product name, price, and image
- ✅ Stock status display
- ✅ Add to cart button (with conditional state)
- ✅ Proper keys
- ✅ Responsive grid layout

#### Step 1: Sample Data

```javascript
const products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, stock: 15, image: 'https://example.com/mouse.jpg' },
  { id: 2, name: 'Mechanical Keyboard', price: 89.99, stock: 8, image: 'https://example.com/keyboard.jpg' },
  { id: 3, name: 'USB-C Cable', price: 12.99, stock: 0, image: 'https://example.com/cable.jpg' },
  { id: 4, name: 'Webcam HD', price: 59.99, stock: 3, image: 'https://example.com/webcam.jpg' },
  { id: 5, name: 'Monitor Stand', price: 39.99, stock: 12, image: 'https://example.com/stand.jpg' },
  { id: 6, name: 'Desk Mat', price: 24.99, stock: 20, image: 'https://example.com/mat.jpg' },
  { id: 7, name: 'Headphone Stand', price: 34.99, stock: 5, image: 'https://example.com/stand2.jpg' },
  { id: 8, name: 'Laptop Sleeve', price: 19.99, stock: 10, image: 'https://example.com/sleeve.jpg' },
  { id: 9, name: 'Cable Organizer', price: 9.99, stock: 0, image: 'https://example.com/organizer.jpg' },
  { id: 10, name: 'Phone Stand', price: 14.99, stock: 18, image: 'https://example.com/phone-stand.jpg' }
];
```

#### Step 2: Product Component

```javascript
// src/ProductCard.jsx
function ProductCard({ product }) {
  const [addedToCart, setAddedToCart] = React.useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.stock === 0 && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        
        <div className="product-stock">
          {product.stock > 0 ? (
            <span className="stock-available">
              {product.stock} in stock
            </span>
          ) : (
            <span className="stock-unavailable">Out of stock</span>
          )}
        </div>

        <button
          className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {addedToCart ? '✓ Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
```

#### Step 3: Product List

```javascript
// src/ProductList.jsx
import ProductCard from './ProductCard';

function ProductList({ products }) {
  // Filter products by stock
  const inStockProducts = products.filter(p => p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="product-list">
      <h2>Available Products ({inStockProducts.length})</h2>
      <div className="products-grid">
        {inStockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {outOfStockProducts.length > 0 && (
        <>
          <h2>Out of Stock ({outOfStockProducts.length})</h2>
          <div className="products-grid">
            {outOfStockProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
```

#### Step 4: App Component

```javascript
// src/App.jsx
import './App.css';
import ProductList from './ProductList';

const products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, stock: 15, image: 'https://example.com/mouse.jpg' },
  { id: 2, name: 'Mechanical Keyboard', price: 89.99, stock: 8, image: 'https://example.com/keyboard.jpg' },
  { id: 3, name: 'USB-C Cable', price: 12.99, stock: 0, image: 'https://example.com/cable.jpg' },
  // ... rest of products
];

function App() {
  return (
    <div className="App">
      <header>
        <h1>Tech Store</h1>
      </header>
      <main>
        <ProductList products={products} />
      </main>
    </div>
  );
}

export default App;
```

#### Step 5: Styling

```css
/* src/App.css */
.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

.product-list h2 {
  margin: 40px 0 20px 0;
  color: #1f2937;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  background: #f3f4f6;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.out-of-stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef4444;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  padding: 16px;
}

.product-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #1f2937;
}

.product-price {
  font-size: 24px;
  font-weight: 700;
  color: #059669;
  margin: 0 0 12px 0;
}

.product-stock {
  margin-bottom: 12px;
  font-size: 14px;
}

.stock-available {
  color: #059669;
  font-weight: 600;
}

.stock-unavailable {
  color: #ef4444;
  font-weight: 600;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #2563eb;
}

.add-to-cart-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.add-to-cart-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.add-to-cart-btn.added {
  background: #10b981;
}
```

---

## Advanced Patterns

### Empty State Handling

```javascript
function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Loading State

```javascript
function ProductList({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Filtered Lists (Using Props Only)

> **📌 Note**: useState will be covered in Day 4. For now, we receive filtered data via props.

```javascript
// Parent component passes filtered data
function SearchableProductList({ products, searchTerm }) {
  // Parent already filtered - we just render
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredProducts.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <div className="products-grid">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Usage from parent (you'll learn state in Day 4):
// <SearchableProductList products={products} searchTerm="mouse" />
```

### Pre-sorted Lists

```javascript
// Parent sorts and passes sorted data
function SortedProductList({ products, sortBy }) {
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div className="products-grid">
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Usage:
// <SortedProductList products={products} sortBy="price" />
```

---

## Key Prop Deep Dive

### Why Keys Matter: React's Reconciliation Algorithm

When React updates the UI, it compares the new virtual DOM with the old one. Keys help React identify which items have:
- Changed
- Been added
- Been removed
- Moved to a different position

#### Without Keys (Slower, Can Cause Bugs)

```javascript
// React doesn't know which items changed
function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>{item}</li>  // Missing key!
      ))}
    </ul>
  );
}
```

**Problems:**
- React re-renders ALL items unnecessarily
- Form inputs lose focus
- Component state gets mixed up
- Performance degrades

#### With Proper Keys (Fast, Correct Behavior)

```javascript
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item}</li>
      ))}
    </ul>
  );
}
```

**Benefits:**
- React only updates changed items
- Maintains component identity
- Preserves form state
- Better performance

### Key Requirements

#### Rule 1: Keys Must Be Unique

```javascript
// ❌ BAD - Duplicate keys
{users.map((user, index) => (
  <User key={user.email} user={user} />  // email might not be unique
))}

// ✅ GOOD - Truly unique keys
{users.map(user => (
  <User key={user.id} user={user} />  // id is guaranteed unique
))}
```

#### Rule 2: Keys Must Be Stable

```javascript
// ❌ BAD - Key changes on every render
function BadList({ users }) {
  return users.map(user => (
    <User key={Math.random()} user={user} />  // New key each render!
  ));
}

// ✅ GOOD - Key is stable across renders
function GoodList({ users }) {
  return users.map(user => (
    <User key={user.id} user={user} />  // Same key for same user
  ));
}
```

#### Rule 3: Keys Should Be Predictable

```javascript
// ❌ BAD - Unpredictable keys
function BadList({ items }) {
  return items.map((item, index) => (
    <Item key={`${item.name}-${Date.now()}`} item={item} />
  ));
}

// ✅ GOOD - Predictable keys
function GoodList({ items }) {
  return items.map(item => (
    <Item key={item.id} item={item} />
  ));
}
```

### Choosing the Right Key

#### Best: Database ID

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// ✅ PERFECT - Stable, unique, predictable
{users.map(user => (
  <User key={user.id} user={user} />
))}
```

#### Good: Stable, Generated IDs

```javascript
// If your data doesn't have IDs, use a library or generate
const todos = [
  { text: 'Buy milk', id: 'todo-1', timestamp: 1234567890 },
  { text: 'Call dentist', id: 'todo-2', timestamp: 1234567891 }
];

// ✅ GOOD - Using generated unique ID
{todos.map(todo => (
  <Todo key={todo.id} todo={todo} />
))}
```

#### Acceptable: Stable Composite Key

```javascript
const events = [
  { date: '2024-01-01', name: 'New Year Party', location: 'NYC' },
  { date: '2024-01-01', name: 'New Year Party', location: 'LA' }
];

// ✅ OK - Composite key when no single unique field exists
{events.map(event => (
  <Event key={`${event.date}-${event.name}-${event.location}`} event={event} />
))}
```

#### Avoid: Index as Key (Unless List Never Changes)

```javascript
// ❌ BAD - For dynamic lists
function BadList({ items }) {
  return items.map((item, index) => (
    <Item key={index} item={item} />  // Breaks when items reorder!
  ));
}

// ⚠️ OK - ONLY if list is never reordered, filtered, or items added/removed
function StaticList({ items }) {
  return items.map((item, index) => (
    <Item key={index} item={item} />
  ));
}
```

### Key on Fragment

```javascript
function TodoList({ todos }) {
  return (
    <>
      {todos.map(todo => (
        <React.Fragment key={todo.id}>
          <li>{todo.text}</li>
          <span>{todo.date}</span>
        </React.Fragment>
      ))}
    </>
  );
}

// Or with shorthand
function TodoList({ todos }) {
  return (
    <>
      {todos.map(todo => (
        <div key={todo.id}>
          <li>{todo.text}</li>
          <span>{todo.date}</span>
        </div>
      ))}
    </>
  );
}
```

### Keys and Reordering

When items reorder, keys ensure React correctly tracks which item is which:

```javascript
function ReorderableList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          {/* React maintains component state for this item */}
        </li>
      ))}
    </ul>
  );
}

// If items = [A, B, C] and becomes [C, A, B]
// Without keys: React might think A became C, B became A, C became B
// With keys: React knows C moved to position 1, A moved to position 2
```

---

## Nested Lists Deep Dive

### Rendering List of Lists

```javascript
function CategoryList({ categories }) {
  return (
    <div className="categories">
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

// Data structure:
const categories = [
  {
    id: 1,
    name: 'Electronics',
    items: [
      { id: 101, name: 'Laptop' },
      { id: 102, name: 'Phone' }
    ]
  },
  {
    id: 2,
    name: 'Clothing',
    items: [
      { id: 201, name: 'Shirt' },
      { id: 202, name: 'Pants' }
    ]
  }
];
```

### Comments with Replies

```javascript
function CommentThread({ comments }) {
  return (
    <div className="comments">
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <h4>{comment.author}</h4>
          <p>{comment.text}</p>
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="replies">
              {comment.replies.map(reply => (
                <div key={reply.id} className="reply">
                  <strong>{reply.author}</strong>: {reply.text}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

## Real-World List Examples

### E-commerce Product Grid

```javascript
function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h3>No products found</h3>
        <p>Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">${product.price.toFixed(2)}</p>
          {product.inStock ? (
            <button className="add-to-cart">Add to Cart</button>
          ) : (
            <button disabled className="out-of-stock">Out of Stock</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Social Media Feed

```javascript
function PostFeed({ posts }) {
  return (
    <div className="feed">
      {posts.map(post => (
        <article key={post.id} className="post">
          <div className="post-header">
            <img src={post.author.avatar} alt={post.author.name} />
            <div>
              <h3>{post.author.name}</h3>
              <span>{post.timestamp}</span>
            </div>
          </div>
          
          <p className="post-content">{post.content}</p>
          
          {post.image && (
            <img src={post.image} alt="Post" className="post-image" />
          )}
          
          <div className="post-actions">
            <button>👍 {post.likes.length}</button>
            <button>💬 {post.comments.length}</button>
            <button>🔄 {post.shares}</button>
          </div>
          
          {post.comments.length > 0 && (
            <div className="post-comments">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <strong>{comment.author.name}</strong> {comment.text}
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
```

### Data Table with Sorting Indicator

```javascript
function DataTable({ headers, rows, sortedBy }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header.key}>
              {header.label}
              {sortedBy === header.key && ' 🔽'}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            {headers.map(header => (
              <td key={`${row.id}-${header.key}`}>
                {row[header.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## Common Mistakes with Lists

### Mistake 1: Missing Keys

```javascript
// ❌ BAD - No key prop
function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => (
        <li>{product.name}</li>
      ))}
    </ul>
  );
}

// ✅ GOOD - Has key
function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

### Mistake 2: Using Index for Reorderable Lists

```javascript
// ❌ BAD - Breaks on reorder/filter
function SortableList({ items }) {
  return items.map((item, index) => (
    <Item key={index} item={item} />
  ));
}

// ✅ GOOD - Uses stable ID
function SortableList({ items }) {
  return items.map(item => (
    <Item key={item.id} item={item} />
  ));
}
```

### Mistake 3: Keys in Wrong Place

```javascript
// ❌ BAD - Key on wrong element
function List({ items }) {
  return (
    <div key={items[0]?.id}>  // Key here does nothing!
      {items.map(item => (
        <div>{item.name}</div>
      ))}
    </div>
  );
}

// ✅ GOOD - Key on map element
function List({ items }) {
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Mistake 4: Unstable Keys

```javascript
// ❌ BAD - Key changes each render
function Component({ users }) {
  return users.map(user => (
    <User key={user.name + Math.random()} user={user} />
  ));
}

// ✅ GOOD - Stable key
function Component({ users }) {
  return users.map(user => (
    <User key={user.id} user={user} />
  ));
}
```

### Mistake 5: Rendering Arrays Directly

```javascript
// ❌ BAD - React error
function Component() {
  const items = [1, 2, 3];
  return <div>{items}</div>;  // Works, but not recommended
}

// ✅ GOOD - Explicit mapping
function Component() {
  const items = [1, 2, 3];
  return (
    <div>
      {items.map(item => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}
```

---

## Performance Considerations for Lists

### Large Lists

For very large lists (1000+ items), consider virtualization (covered in Day 76):

```javascript
// For now, note that rendering 1000+ items can be slow
function LargeList({ items }) {
  // In Day 76, you'll learn about react-window
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Memoization Preview

You'll learn about React.memo in Day 74, but here's the concept:

```javascript
import { memo } from 'react';

// Day 74: Prevents re-render when item hasn't changed
const ListItem = memo(function ListItem({ item }) {
  return <li>{item.name}</li>;
});

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
```

---

## Testing Lists

### Basic List Testing

```javascript
import { render, screen } from '@testing-library/react';
import ProductList from './ProductList';

test('renders all products', () {
  const products = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 }
  ];
  
  render(<ProductList products={products} />);
  
  expect(screen.getByText('Product 1')).toBeInTheDocument();
  expect(screen.getByText('Product 2')).toBeInTheDocument();
});

test('handles empty list', () => {
  render(<ProductList products={[]} />);
  expect(screen.getByText('No products available')).toBeInTheDocument();
});
```

---

## Best Practices Summary

### ✅ DO

1. Always provide stable, unique keys
2. Use database IDs as keys when available
3. Handle empty states gracefully
4. Filter/sort in parent or before map
5. Keep list item components small and focused
6. Use PropTypes to validate array props

### ❌ DON'T

1. Never use index as key for dynamic lists
2. Don't generate keys randomly
3. Don't forget to handle empty arrays
4. Don't mutate the original array when sorting
5. Don't render thousands of items without virtualization
6. Don't place logic that modifies data inside map

---

## Array.map() Complete Reference

### Understanding map() Return Value

```javascript
// map() returns a new array
const numbers = [1, 2, 3];
const doubled = numbers.map(num => num * 2);
// doubled = [2, 4, 6] - NEW array, original unchanged

// In React, map() returns an array of elements
function NumberList({ numbers }) {
  const elements = numbers.map(num => <li key={num}>{num}</li>);
  return <ul>{elements}</ul>;
}
```

### Advanced map() Patterns

#### Using map() with Multiple Operations

```javascript
function ProductList({ products }) {
  return (
    <div>
      {products
        .filter(product => product.inStock)
        .sort((a, b) => a.price - b.price)
        .map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))
      }
    </div>
  );
}
```

#### Chaining map() with Other Array Methods

```javascript
function CategoriesList({ categories }) {
  return (
    <div>
      {categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(category => (
          <Category key={category.id} category={category} />
        ))
      }
    </div>
  );
}
```

### map() vs Other Array Methods

#### forEach() - Don't use for rendering

```javascript
// ❌ BAD - forEach doesn't return anything
function BadList({ items }) {
  return (
    <ul>
      {items.forEach(item => <li>{item}</li>)}  // Returns undefined!
    </ul>
  );
}

// ✅ GOOD - map() returns array of elements
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}
```

#### filter() - For selecting items

```javascript
function ActiveUsersList({ users }) {
  const activeUsers = users.filter(user => user.isActive);
  
  return (
    <ul>
      {activeUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### reduce() - For aggregating data

```javascript
function StatsDisplay({ items }) {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div>
      <h2>Total: ${totalPrice.toFixed(2)}</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Complex Data Structures

### Rendering Hierarchical Data

```javascript
function OrganizationChart({ departments }) {
  return (
    <div className="org-chart">
      {departments.map(dept => (
        <div key={dept.id} className="department">
          <h3>{dept.name}</h3>
          
          {dept.employees && dept.employees.length > 0 && (
            <div className="employees">
              {dept.employees.map(employee => (
                <div key={employee.id} className="employee">
                  <h4>{employee.name}</h4>
                  <p>{employee.role}</p>
                  
                  {employee.projects && employee.projects.length > 0 && (
                    <div className="projects">
                      {employee.projects.map(project => (
                        <span key={project.id} className="project-tag">
                          {project.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Menu with Submenus

```javascript
function NavigationMenu({ menuItems }) {
  return (
    <nav>
      {menuItems.map(item => (
        <div key={item.id} className="menu-item">
          <a href={item.url}>{item.label}</a>
          
          {item.submenu && item.submenu.length > 0 && (
            <ul className="submenu">
              {item.submenu.map(subItem => (
                <li key={subItem.id}>
                  <a href={subItem.url}>{subItem.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
```

### Timeline/Event List

```javascript
function EventTimeline({ events }) {
  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={event.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <span className="timestamp">{event.date}</span>
            
            {event.tags && event.tags.length > 0 && (
              <div className="tags">
                {event.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Keys in Special Scenarios

### Dynamic Keys Based on Props

```javascript
function DynamicKeyList({ items, sortBy }) {
  return (
    <ul>
      {items.map(item => (
        <li key={`${item.id}-${sortBy}`}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### Keys with Boolean Conditions

```javascript
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <input 
            type="checkbox" 
            defaultChecked={todo.completed}
            key={`${todo.id}-checkbox`}  // Separate key for checkbox
          />
          <span key={`${todo.id}-text`}>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}
```

---

## Edge Cases and Troubleshooting

### Empty Array Handling

```javascript
// Multiple ways to handle empty arrays:

// Method 1: Early return
function List1({ items }) {
  if (items.length === 0) return <div>No items</div>;
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>;
}

// Method 2: Conditional inside JSX
function List2({ items }) {
  return (
    <div>
      {items.length === 0 ? (
        <div>No items</div>
      ) : (
        <ul>
          {items.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      )}
    </div>
  );
}

// Method 3: Default parameter
function List3({ items = [] }) {
  return (
    <div>
      {items.length > 0 ? (
        <ul>
          {items.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      ) : (
        <div>No items</div>
      )}
    </div>
  );
}
```

### Handling Null/Undefined Data

```javascript
function UserList({ users }) {
  // Filter out invalid data
  const validUsers = users.filter(user => 
    user && user.id && user.name
  );
  
  if (validUsers.length === 0) {
    return <div>No valid users</div>;
  }
  
  return (
    <ul>
      {validUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Lists with Optional Data

```javascript
function PostList({ posts }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          
          {post.image && (
            <img src={post.image} alt={post.title} />
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
```

---

## PropTypes for Lists

```javascript
import PropTypes from 'prop-types';

function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

// Validate array props
ProductList.propTypes = {
  // Array of any type
  products: PropTypes.array.isRequired,
  
  // Array of specific type
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number
    })
  ).isRequired,
  
  // Or alternatively:
  products: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};
```

---

## Interview Preparation

### Common Questions About Lists

#### Q1: Why do you need keys in React lists?

**Answer**: Keys help React identify which items have changed, been added, or removed. Without keys, React might reuse existing DOM nodes incorrectly, leading to bugs like lost form state or incorrect updates.

#### Q2: Can you use index as a key?

**Answer**: Only if the list is static (items never reorder, filter, or add/remove). For dynamic lists, use unique IDs. Index keys break when items change position.

#### Q3: What happens if you don't provide a key?

**Answer**: React will use index as fallback and show a warning in console. This can cause performance issues and bugs.

#### Q4: How do you handle empty lists?

**Answer**: Check `array.length === 0` before mapping, and return appropriate empty state JSX.

#### Q5: Can you have multiple maps in one component?

**Answer**: Yes, you can nest maps or have multiple separate maps in the same component.

---

## Resources & Further Reading

### Official Documentation
- [Rendering Lists](https://react.dev/learn/rendering-lists)
- [Keys](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)

### MDN References
- [Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)

---

## Key Takeaways

### ✅ What You Learned Today

1. **map() for Lists**: Complete mastery of Array.map() for transforming data into JSX
2. **Keys**: Deep understanding of why keys are essential, how React uses them, and best practices
3. **Empty States**: Multiple patterns for handling empty, loading, and error states in lists
4. **Complex Data**: Rendering nested lists, hierarchical data structures, and edge cases
5. **Performance**: Understanding when and how to optimize list rendering

### 🎯 Key Concepts

- Always use stable, unique keys (never index for dynamic lists)
- Handle empty arrays gracefully with conditional rendering
- Filter/sort before mapping when possible
- Keep list item components small and focused
- Use PropTypes to validate array props
- Understand React's reconciliation algorithm

### 📚 Next Steps

Tomorrow (Day 4) you'll learn:
- ✅ useState hook fundamentals
- ✅ Managing component state
- ✅ Updating state correctly
- ✅ Multiple state variables
- ✅ State vs Props

### 💡 Practice Ideas

1. Build a todo list component (with static data)
2. Create a product grid with proper keys
3. Make a nested category list
4. Build a timeline/event list
5. Create a table with multiple columns

---

**Excellent work! 🎉 See you tomorrow for Day 4: State with useState!**
