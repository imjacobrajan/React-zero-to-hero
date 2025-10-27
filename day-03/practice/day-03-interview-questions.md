# Day 3 Interview Questions: Rendering Lists & Keys

## Lists and Keys Fundamentals

### 1. How do you render a list in React?
**Answer:** Use the `map()` method to transform an array of data into an array of JSX elements.

```javascript
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

### 2. Why are keys important in React?
**Answer:** Keys help React identify which items have changed, are added, or removed. They improve performance and prevent bugs.

### 3. What should you use as a key?
**Answer:** Use stable, unique identifiers like IDs from a database. Avoid using array indices for dynamic lists.

```javascript
// ✅ GOOD
{users.map(user => <User key={user.id} {...user} />)}

// ❌ BAD (for dynamic lists)
{users.map((user, index) => <User key={index} {...user} />)}
```

### 4. What happens if you don't provide a key?
**Answer:** React will warn you in development. Without keys, React has to update more nodes, leading to poor performance and potential bugs.

### 5. Can you use index as a key?
**Answer:** Only if the list is static and items are never reordered, added, or removed. For dynamic lists, use IDs.

### 6. What is conditional rendering?
**Answer:** Conditional rendering is showing different UI based on a condition.

```javascript
{isLoggedIn ? <Dashboard /> : <Login />}
{error && <ErrorMessage error={error} />}
```

### 7. What's the difference between ternary and && operator?
**Answer:** Ternary is for if/else scenarios, && is for simple show/hide cases.

```javascript
// Ternary - returns something in both cases
{isLoggedIn ? <Dashboard /> : <Login />}

// && - returns null or the element
{error && <ErrorMessage />}
```

### 8. How do you filter and render a list?
**Answer:** Chain `filter()` before `map()`.

```javascript
{items.filter(item => item.active).map(item => (
  <Item key={item.id} {...item} />
))}
```

### 9. What happens when you return `null` in JSX?
**Answer:** React renders nothing (no DOM node is created).

### 10. How do you render an empty state?
**Answer:** Check if the array is empty before mapping.

```javascript
{items.length === 0 ? (
  <p>No items found</p>
) : (
  items.map(item => <Item key={item.id} {...item} />)
)}
```

## Coding Questions

### Q1: Render a list of products with proper keys
```javascript
function ProductList({ products }) {
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
```

### Q2: Render a list with conditional styling
```javascript
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li 
          key={user.id}
          className={user.isActive ? 'active' : 'inactive'}
        >
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

### Q3: Render items with loading state
```javascript
function ItemList({ items, isLoading }) {
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Q4: Filter and render only active items
```javascript
function ActiveUsers({ users }) {
  const activeUsers = users.filter(user => user.isActive);
  
  return (
    <div>
      {activeUsers.map(user => (
        <User key={user.id} {...user} />
      ))}
    </div>
  );
}
```

### Q5: Render nested lists
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
```

## Advanced Questions

### Q6: Why shouldn't you use random values as keys?
```javascript
// ❌ BAD - generates new key on every render
{items.map(item => (
  <Item key={Math.random()} {...item} />
))}

// This causes React to unmount and remount all items
```

### Q7: How would you handle a list with sorting?
```javascript
function SortedList({ items }) {
  const sortedItems = [...items].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  return (
    <ul>
      {sortedItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### Q8: How would you implement pagination with a list?
```javascript
function PaginatedList({ items, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(0);
  const startIndex = currentPage * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div>
      <ul>
        {paginatedItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
      <button onClick={() => setCurrentPage(p => p + 1)}>Next</button>
    </div>
  );
}
```

## Common Mistakes

1. Using array index as key for dynamic lists
2. Not providing keys at all
3. Using non-unique keys
4. Using keys that change on every render
5. Forgetting to handle empty lists
6. Not handling loading states
7. Mutating arrays directly instead of creating new ones
