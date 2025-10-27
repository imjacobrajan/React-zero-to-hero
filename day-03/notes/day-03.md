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
- ✅ Understand how `array.map()` works in React
- ✅ Know why keys are crucial for performance
- ✅ Master conditional rendering techniques
- ✅ Build dynamic, data-driven UIs
- ✅ Handle edge cases like empty lists

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

## Conditional Rendering Techniques

### Ternary Operators

**Syntax**: `condition ? trueExpression : falseExpression`

#### Example 1: Show/Hide Content

```javascript
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      {user.isVerified ? (
        <span className="badge verified">✓ Verified</span>
      ) : (
        <span className="badge unverified">Not Verified</span>
      )}
    </div>
  );
}
```

#### Example 2: Loading State

```javascript
function DataDisplay({ isLoading, data }) {
  return (
    <div>
      {isLoading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <div className="data">{data}</div>
      )}
    </div>
  );
}
```

#### Example 3: Multiple Conditions

```javascript
function Message({ user }) {
  return (
    <div>
      <p>
        Hello, {user.name}! You have{' '}
        {user.notifications === 0 ? (
          'no new notifications'
        ) : user.notifications === 1 ? (
          '1 new notification'
        ) : (
          `${user.notifications} new notifications`
        )}.
      </p>
    </div>
  );
}
```

### Logical && Operator

**Syntax**: `condition && expression`

**Important**: Returns the right-hand expression if true, otherwise returns the condition itself (which is falsy).

#### Example 1: Conditional Rendering

```javascript
function WelcomeMessage({ user }) {
  return (
    <div>
      <h1>Welcome!</h1>
      {user.isLoggedIn && <p>Hello, {user.name}!</p>}
      {user.isAdmin && <button>Admin Panel</button>}
    </div>
  );
}
```

#### Example 2: Conditional List Item

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

### Switch Statements in JSX

For multiple conditions, you can use functions:

```javascript
function StatusBadge({ status }) {
  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'approved':
        return <span className="badge badge-success">Approved</span>;
      case 'rejected':
        return <span className="badge badge-error">Rejected</span>;
      default:
        return <span className="badge badge-gray">Unknown</span>;
    }
  };

  return getStatusDisplay();
}
```

```javascript
// Or more concisely
function StatusBadge({ status }) {
  return (
    <>
      {status === 'pending' && <span className="badge badge-warning">Pending</span>}
      {status === 'approved' && <span className="badge badge-success">Approved</span>}
      {status === 'rejected' && <span className="badge badge-error">Rejected</span>}
    </>
  );
}
```

### Preventing Rendering with null

```javascript
function ConditionalComponent({ shouldRender, content }) {
  // Don't render anything
  if (!shouldRender) {
    return null;
  }

  return <div>{content}</div>;
}

// Or inline
function ConditionalComponent({ shouldRender, content }) {
  return shouldRender ? <div>{content}</div> : null;
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

### Filtered Lists

```javascript
function SearchableProductList({ products }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Sorted Lists

```javascript
function SortableProductList({ products }) {
  const [sortBy, setSortBy] = useState('name');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  return (
    <div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Sort by Name</option>
        <option value="price">Sort by Price</option>
      </select>

      <div className="products-grid">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

## Key Takeaways

### ✅ What You Learned Today

1. **map() for Lists**: Transform data arrays into JSX element arrays
2. **Keys**: Essential for React's reconciliation algorithm
3. **Conditional Rendering**: Use ternary and && for dynamic UI
4. **Empty States**: Handle empty lists gracefully
5. **Filtering & Sorting**: Manipulate data before rendering

### 🎯 Key Concepts

- Always use stable, unique keys (never index for dynamic lists)
- Use ternary for if/else, && for simple conditions
- Handle loading and empty states
- Keep components small and focused
- Filter/sort before mapping when possible

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ useState hook fundamentals
- ✅ Managing component state
- ✅ Updating state correctly
- ✅ State patterns and best practices

### 💡 Practice Ideas

1. Build a todo list with add/remove functionality
2. Create a shopping cart with quantity management
3. Make a searchable contact list
4. Build a card deck viewer with shuffle

---

**Excellent work! 🎉 See you tomorrow for Day 4: State with useState!**
