# Day 13: useMemo Hook - Value Memoization for Performance

## 📋 Table of Contents
- [Introduction](#introduction)
- [What is useMemo?](#what-is-usememo)
- [Understanding Memoization](#understanding-memoization)
- [useMemo vs useCallback](#usememo-vs-usecallback)
- [When to Use useMemo](#when-to-use-usememo)
- [Expensive Calculations](#expensive-calculations)
- [Referential Equality](#referential-equality)
- [Common Patterns](#common-patterns)
- [Performance Optimization](#performance-optimization)
- [Real-World Examples](#real-world-examples)
- [Practice Exercise](#practice-exercise)
- [Key Takeaways](#key-takeaways)

---

## Introduction

Welcome to Day 13! Today you'll master **useMemo** - React's powerful hook for memoizing expensive computations and optimizing performance. By the end of today, you'll:
- ✅ Understand value memoization
- ✅ Know when to use useMemo vs useCallback
- ✅ Optimize expensive calculations
- ✅ Prevent unnecessary re-computations
- ✅ Build performant React applications
- ✅ Practice with Fibonacci memoization

---

## What is useMemo?

### Understanding useMemo

**useMemo** is a React hook that returns a memoized value, computed only when dependencies change.

**Analogy**: Think of useMemo like a **calculator with memory**:
- You perform an expensive calculation (memory + operation)
- You save the result (memoize)
- Next time you need the same result with same inputs, you just recall it (return memoized value)
- You only recalculate when inputs change

### Basic Syntax

```javascript
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b] // Dependencies
);
```

### How It Works

```javascript
import { useMemo, useState } from 'react';

function ExpensiveComponent({ data }) {
  const [count, setCount] = useState(0);
  
  // ❌ WITHOUT useMemo - Recalculates on every render
  const expensiveValue = data.reduce((sum, item) => {
    console.log('Calculating...'); // Runs on every render
    return sum + item.value * 2;
  }, 0);
  
  return (
    <div>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
```

```javascript
import { useMemo, useState } from 'react';

function ExpensiveComponent({ data }) {
  const [count, setCount] = useState(0);
  
  // ✅ WITH useMemo - Only recalculates when data changes
  const expensiveValue = useMemo(() => {
    console.log('Calculating...'); // Only runs when data changes
    return data.reduce((sum, item) => sum + item.value * 2, 0);
  }, [data]);
  
  return (
    <div>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
    </div>
  );
}
```

---

## Understanding Memoization

### What is Memoization?

**Memoization** is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

### Why Memoize?

1. **Performance**: Avoid recalculating expensive operations
2. **Memory**: Trade memory for speed
3. **Stability**: Same inputs = same outputs

### Example: Fibonacci Without Memoization

```javascript
// ❌ Without memoization - Very slow for large n
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(40)); // Takes seconds!
```

### Example: Fibonacci With Memoization

```javascript
// ✅ With memoization - Fast even for large n
function fibonacciMemoized(n, cache = {}) {
  if (n in cache) return cache[n];
  if (n <= 1) return n;
  
  cache[n] = fibonacciMemoized(n - 1, cache) + fibonacciMemoized(n - 2, cache);
  return cache[n];
}

console.log(fibonacciMemoized(40)); // Instant!
```

---

## useMemo vs useCallback

### Key Differences

| Feature | useMemo | useCallback |
|---------|---------|-------------|
| **Returns** | Memoized **value** | Memoized **function** |
| **Use Case** | Expensive calculations | Function references |
| **Example** | Filtered list, sorted data | Event handlers, callbacks |
| **Complexity** | Computes a value | Returns the same function |

### Visual Comparison

```javascript
// useMemo - Memoizes the RESULT
const filteredList = useMemo(() => {
  return items.filter(item => item.type === 'active');
}, [items]); // Returns: ['item1', 'item2', 'item3']

// useCallback - Memoizes the FUNCTION
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Returns: () => { console.log('clicked'); }
```

### When to Use Each

**Use useMemo when:**
- Computing expensive values
- Filtering/sorting arrays
- Complex calculations
- Deriving data from props/state

**Use useCallback when:**
- Passing functions to memoized children
- Dependency in useEffect
- Preventing re-renders of child components
- Storing function references

---

## When to Use useMemo

### ✅ Good Use Cases

#### 1. Expensive Calculations

```javascript
function ProductList({ products, minPrice, maxPrice }) {
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }, [products, minPrice, maxPrice]);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name} - ${product.price}</li>
      ))}
    </ul>
  );
}
```

#### 2. Complex Computations

```javascript
function StatsDashboard({ transactions }) {
  const stats = useMemo(() => {
    console.log('Calculating stats...');
    
    return {
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      average: transactions.length 
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
        : 0,
      highest: Math.max(...transactions.map(t => t.amount)),
      lowest: Math.min(...transactions.map(t => t.amount))
    };
  }, [transactions]);
  
  return (
    <div>
      <p>Total: ${stats.total}</p>
      <p>Average: ${stats.average}</p>
      <p>Highest: ${stats.highest}</p>
      <p>Lowest: ${stats.lowest}</p>
    </div>
  );
}
```

#### 3. Sorted Data

```javascript
function UserList({ users, sortBy }) {
  const sortedUsers = useMemo(() => {
    console.log('Sorting users...');
    return [...users].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'age') return a.age - b.age;
      return 0;
    });
  }, [users, sortBy]);
  
  return (
    <ul>
      {sortedUsers.map(user => (
        <li key={user.id}>{user.name} - {user.age}</li>
      ))}
    </ul>
  );
}
```

#### 4. Referential Equality

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ BAD: New object on every render
  const config = {
    apiKey: '12345',
    timeout: 5000
  };
  
  return <Child config={config} />;
}

// ✅ GOOD: Same object reference
function ParentOptimized() {
  const [count, setCount] = useState(0);
  
  const config = useMemo(() => ({
    apiKey: '12345',
    timeout: 5000
  }), []);
  
  return <Child config={config} />;
}
```

### ❌ When NOT to Use useMemo

```javascript
// ❌ BAD: Simple calculation, useMemo overhead not worth it
const sum = useMemo(() => a + b, [a, b]);

// ✅ GOOD: Just use regular calculation
const sum = a + b;
```

---

## Expensive Calculations

### Example 1: Filtering Large Lists

```javascript
function ProductSearch({ products, searchTerm, category, inStock }) {
  const filteredProducts = useMemo(() => {
    console.log('Filtering large product list...');
    
    return products
      .filter(product => {
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        if (category && product.category !== category) {
          return false;
        }
        if (inStock && product.stock === 0) {
          return false;
        }
        return true;
      });
  }, [products, searchTerm, category, inStock]);
  
  return (
    <div>
      <p>Found {filteredProducts.length} products</p>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Example 2: Complex Data Transformation

```javascript
function DataVisualization({ data, groupBy, dateRange }) {
  const chartData = useMemo(() => {
    console.log('Transforming data for chart...');
    
    const grouped = data.reduce((acc, item) => {
      const key = item[groupBy];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
    
    return Object.entries(grouped).map(([key, values]) => ({
      label: key,
      value: values.length,
      totalValue: values.reduce((sum, item) => sum + item.value, 0)
    }));
  }, [data, groupBy, dateRange]);
  
  return <Chart data={chartData} />;
}
```

---

## Referential Equality

### The Problem

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  // New function/object/array on every render
  const callback = () => console.log('callback');
  const config = { theme: 'dark' };
  const items = [1, 2, 3];
  
  return (
    <MemoizedChild 
      callback={callback}  // Re-renders child!
      config={config}       // Re-renders child!
      items={items}         // Re-renders child!
    />
  );
}
```

### The Solution with useMemo

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  // Same references on every render
  const callback = useCallback(() => console.log('callback'), []);
  const config = useMemo(() => ({ theme: 'dark' }), []);
  const items = useMemo(() => [1, 2, 3], []);
  
  return (
    <MemoizedChild 
      callback={callback}  // Child doesn't re-render!
      config={config}       // Child doesn't re-render!
      items={items}         // Child doesn't re-render!
    />
  );
}
```

---

## Common Patterns

### Pattern 1: Computed Properties

```javascript
function UserProfile({ user, posts }) {
  const stats = useMemo(() => ({
    postsCount: posts.length,
    averageLikes: posts.length 
      ? posts.reduce((sum, post) => sum + post.likes, 0) / posts.length 
      : 0,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0)
  }), [posts]);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Posts: {stats.postsCount}</p>
      <p>Avg Likes: {stats.averageLikes}</p>
      <p>Total Views: {stats.totalViews}</p>
    </div>
  );
}
```

### Pattern 2: Expensive Filters

```javascript
function SearchResults({ items, filters }) {
  const visibleItems = useMemo(() => {
    return items
      .filter(item => {
        if (filters.search && !item.title.match(new RegExp(filters.search, 'i'))) {
          return false;
        }
        if (filters.minPrice && item.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice && item.price > filters.maxPrice) {
          return false;
        }
        if (filters.category && item.category !== filters.category) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price': return b.price - a.price;
          case 'name': return a.title.localeCompare(b.title);
          default: return 0;
        }
      });
  }, [items, filters]);
  
  return <ItemList items={visibleItems} />;
}
```

---

## Performance Optimization

### Measuring Performance

```javascript
function SlowComponent({ data }) {
  const [count, setCount] = useState(0);
  
  const expensiveValue = useMemo(() => {
    const start = performance.now();
    const result = data.reduce((sum, item) => {
      // Expensive computation
      return sum + Math.sqrt(item.value) * Math.cos(item.value);
    }, 0);
    const end = performance.now();
    console.log(`Calculation took ${end - start}ms`);
    return result;
  }, [data]);
  
  return (
    <div>
      <p>Value: {expensiveValue}</p>
      <button onClick={() => setCount(count + 1)}>Renders: {count}</button>
    </div>
  );
}
```

### Before vs After Comparison

```javascript
// ❌ WITHOUT useMemo
function BeforeOptimization({ data }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const sortedData = data
    .filter(item => item.name.includes(filter))
    .sort((a, b) => sortOrder === 'asc' 
      ? a.value - b.value 
      : b.value - a.value
    ); // Recalculates on every render!
  
  return (
    <div>
      {/* Sorted data recalculated even when filter/sortOrder unchanged */}
      <Input value={filter} onChange={e => setFilter(e.target.value)} />
    </div>
  );
}

// ✅ WITH useMemo
function AfterOptimization({ data }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const sortedData = useMemo(() => {
    return data
      .filter(item => item.name.includes(filter))
      .sort((a, b) => sortOrder === 'asc' 
        ? a.value - b.value 
        : b.value - a.value
      );
  }, [data, filter, sortOrder]); // Only recalculates when these change
  
  return (
    <div>
      <Input value={filter} onChange={e => setFilter(e.target.value)} />
      {/* No recalculation on every keystroke if sortOrder unchanged */}
    </div>
  );
}
```

---

## Real-World Examples

### Example 1: E-commerce Product Filtering

```javascript
function ProductGrid({ products, filters, sortBy }) {
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by category
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    
    // Filter by price range
    result = result.filter(p => 
      p.price >= filters.minPrice && p.price <= filters.maxPrice
    );
    
    // Filter by stock
    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    return result;
  }, [products, filters, sortBy]);
  
  return (
    <div className="product-grid">
      {filteredAndSortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Example 2: Dashboard Analytics

```javascript
function Dashboard({ sales, dateRange }) {
  const analytics = useMemo(() => {
    const filteredSales = sales.filter(sale => 
      sale.date >= dateRange.start && sale.date <= dateRange.end
    );
    
    return {
      totalRevenue: filteredSales.reduce((sum, sale) => sum + sale.amount, 0),
      averageOrderValue: filteredSales.length 
        ? filteredSales.reduce((sum, sale) => sum + sale.amount, 0) / filteredSales.length 
        : 0,
      totalOrders: filteredSales.length,
      topProducts: getTopProducts(filteredSales),
      salesTrend: getSalesTrend(filteredSales)
    };
  }, [sales, dateRange]);
  
  return (
    <div>
      <RevenueCard revenue={analytics.totalRevenue} />
      <OrderCard orders={analytics.totalOrders} avgOrder={analytics.averageOrderValue} />
      <TopProducts products={analytics.topProducts} />
      <TrendChart data={analytics.salesTrend} />
    </div>
  );
}
```

---

## Practice Exercise

### Calculate Fibonacci Numbers with Memoization

**Requirements:**
- ✅ Use useMemo for expensive Fibonacci calculations
- ✅ Display results efficiently
- ✅ Show performance improvement
- ✅ Handle user input

See practice file: `day-13/practice/fibonacci-memoization.jsx`

---

## Key Takeaways

### ✅ What You Learned Today

1. **useMemo**: Memoizes expensive computed values
2. **Performance**: Prevents unnecessary recalculations
3. **Referential Equality**: Maintains same object/array references
4. **Dependencies**: Always include used values
5. **Optimization**: Use for expensive operations

### 🎯 Key Concepts

- useMemo caches computed values
- Only recomputes when dependencies change
- Use for expensive calculations, not simple ones
- Maintain referential equality for props
- Measure performance before optimizing

### 📚 Next Steps

Tomorrow you'll learn:
- ✅ Context API for global state
- ✅ Provider and Consumer patterns
- ✅ useContext hook
- ✅ Building theme switchers

---

**Great work! 🎉 See you tomorrow for Day 14: Context API - Part 1!**
