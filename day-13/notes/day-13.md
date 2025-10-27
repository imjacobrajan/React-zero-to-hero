# Day 13: useMemo Hook - Mastering Value Memoization for Performance
## Introduction
Welcome to Day 13! Today you'll master **useMemo** - React's powerful hook for memoizing expensive computations and optimizing performance. By the end of today, you'll:
- ✅ Understand value memoization
- ✅ Know when to use useMemo vs useCallback
- ✅ Optimize expensive calculations
- ✅ Prevent unnecessary re-computations
- ✅ Build performant React applications
- ✅ Understand referential equality
- ✅ Master Fibonacci and complex algorithm memoization
- ✅ Avoid common performance pitfalls
---


## What is useMemo?


### Understanding useMemo
**useMemo** is a React hook that returns a memoized value, computed only when dependencies change.
**Analogy**: Think of useMemo like a **smart calculator**:
- You perform an expensive calculation (2 + 2)
- You save the result in memory (memoize: 4)
- Next time you need the same result with same inputs, you recall it instantly (return 4)
- You only recalculate when inputs change (2 + 3 → new calculation)


### Basic Syntax
```javascript
const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b] // Dependencies
);
```
**Key Points:**
- Returns a memoized **value** (not a function)
- Only recalculates when dependencies change
- Ideal for expensive computations
- Helps with referential equality


### Simple Example
```javascript
import { useState, useMemo } from 'react';
function ExpensiveCalculation({ items, multiplier }) {
  const [count, setCount] = useState(0);
  // Without useMemo - calculates on EVERY render!
  const expensiveValue = items.reduce((sum, item) => {
    console.log('Computing...'); // Runs every time!
    return sum + item.value * multiplier;
  }, 0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <p>Expensive value: {expensiveValue}</p>
    </div>
  );
}
// ✅ WITH useMemo - only recalculates when items or multiplier change
function OptimizedCalculation({ items, multiplier }) {
  const [count, setCount] = useState(0);
  const expensiveValue = useMemo(() => {
    console.log('Computing...'); // Only runs when deps change!
    return items.reduce((sum, item) => {
      return sum + item.value * multiplier;
    }, 0);
  }, [items, multiplier]);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <p>Expensive value: {expensiveValue}</p>
    </div>
  );
}
```
---


## Understanding Memoization


### What is Memoization?
**Memoization** is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.


### How useMemo Works
```javascript
// First render: items = [1, 2, 3], multiplier = 2
// useMemo: Computes result → stores 12
// Second render: items = [1, 2, 3], multiplier = 2  
// useMemo: Checks deps, same → returns cached 12
// Third render: items = [1, 2, 3], multiplier = 3
// useMemo: Checks deps, changed → recomputes → returns 18
```


### Visual Comparison
```javascript
// WITHOUT useMemo
Render 1: Compute() → 5ms
Render 2: Compute() → 5ms
Render 3: Compute() → 5ms
Total: 15ms
// WITH useMemo
Render 1: Compute() → 5ms (stored)
Render 2: Return cached → 0.001ms
Render 3: Return cached → 0.001ms
Total: 5.002ms (70% faster!)
```
---


## useMemo Syntax


### Basic Usage
```javascript
const memoizedValue = useMemo(() => {
  // Expensive computation
  return expensiveOperation(a, b);
}, [a, b]);
```


### Empty Dependency Array
```javascript
const expensiveValue = useMemo(() => {
  return computeOnce();
}, []); // Only computes once
```


### Complete Example
```javascript
function ComplexComponent({ items, filter }) {
  const [sortOrder, setSortOrder] = useState('asc');
  const [userPrefs, setUserPrefs] = useState({});
  // Expensive filtering operation
  const filteredItems = useMemo(() => {
    console.log('Filtering items...');
    return items.filter(item => {
      // Complex filter logic
      if (filter.type && item.type !== filter.type) return false;
      if (filter.price && item.price > filter.price) return false;
      return item.name.includes(filter.search || '');
    });
  }, [items, filter]);
  // Expensive sorting operation
  const sortedItems = useMemo(() => {
    console.log('Sorting items...');
    return [...filteredItems].sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      return b.price - a.price;
    });
  }, [filteredItems, sortOrder]);
  // Expensive data transformation
  const transformedData = useMemo(() => {
    console.log('Transforming data...');
    return sortedItems.map(item => ({
      ...item,
      displayPrice: `$${item.price.toFixed(2)}`,
      inCart: userPrefs.cartItems?.includes(item.id) || false
    }));
  }, [sortedItems, userPrefs]);
  return (
    <div>
      <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
        Sort: {sortOrder}
      </button>
      <div>
        {transformedData.map(item => (
          <div key={item.id}>
            {item.name} - {item.displayPrice}
          </div>
        ))}
      </div>
    </div>
  );
}
```
---


## When to Use useMemo


### ✅ Good Use Cases


#### 1. Expensive Calculations
```javascript
function Fibonacci({ n }) {
  const fibonacci = useMemo(() => {
    console.log('Calculating Fibonacci for:', n);
    const fib = (num) => {
      if (num <= 1) return 1;
      return fib(num - 1) + fib(num - 2);
    };
    return fib(n);
  }, [n]);
  return <div>Fibonacci({n}) = {fibonacci}</div>;
}
```


#### 2. Filtering and Sorting Large Arrays
```javascript
function ProductList({ products, search, category, sortBy }) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [filteredProducts, sortBy]);
  return (
    <div>
      {sortedProducts.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```


#### 3. Formatting Large Datasets
```javascript
function DataTable({ rawData, dateFormat }) {
  const formattedData = useMemo(() => {
    return rawData.map(row => ({
      ...row,
      date: new Date(row.timestamp).toLocaleDateString(dateFormat),
      price: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(row.amount)
    }));
  }, [rawData, dateFormat]);
  return (
    <table>
      {formattedData.map(row => (
        <tr key={row.id}>
          <td>{row.date}</td>
          <td>{row.price}</td>
        </tr>
      ))}
    </table>
  );
}
```


#### 4. Object/Array Creation with Stable References
```javascript
function Component({ userId }) {
  const config = useMemo(() => ({
    userId,
    apiEndpoint: `/api/users/${userId}`,
    fetchOptions: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  }), [userId]);
  // config object reference is stable
  useEffect(() => {
    fetch(config.apiEndpoint, config.fetchOptions);
  }, [config]);
  return <div>...</div>;
}
```


### ❌ When NOT to Use useMemo
```javascript
// ❌ BAD: Simple computation, no optimization needed
function SimpleComponent({ a, b }) {
  const sum = useMemo(() => a + b, [a, b]); // Unnecessary!
  return <div>{sum}</div>;
}
// ✅ GOOD: Just compute directly
function SimpleComponent({ a, b }) {
  const sum = a + b;
  return <div>{sum}</div>;
}
// ❌ BAD: Dependencies change frequently
function BadMemo({ items }) {
  const processed = useMemo(() => {
    return items.map(item => item.value);
  }, [items]); // items changes every render = no benefit!
}
// ✅ GOOD: Only memoize when it helps
function GoodMemo({ items }) {
  // Check if memoization is actually needed
  const processed = items.map(item => item.value);
}
```
---


## useMemo vs useCallback


### Key Differences
| Feature | useMemo | useCallback |
|---------|---------|-------------|
| What it memoizes | **Values** | **Functions** |
| Returns | Computed value | Function reference |
| Use case | Expensive calculations | Callbacks to children |
| Example | `const sum = useMemo(() => a + b, [a, b])` | `const fn = useCallback(() => {}, [])` |


### Comparison Examples
```javascript
// ❌ WRONG: Using useCallback for values
const sum = useCallback(() => a + b, [a, b]);
// Returns a function, not the sum!
// ✅ CORRECT: Using useMemo for values
const sum = useMemo(() => a + b, [a, b]);
// Returns the computed sum
// ❌ WRONG: Using useMemo for functions
const handleClick = useMemo(() => () => {}, []);
// Unnecessary wrapper function
// ✅ CORRECT: Using useCallback for functions
const handleClick = useCallback(() => {}, []);
// Returns memoized function
```


### When to Use Each
```javascript
function Component({ items, userId }) {
  // ✅ useMemo: Expensive value computation
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);
  // ✅ useCallback: Memoized callback for children
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  // ✅ useMemo: Formatted data (value)
  const formattedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      displayName: item.name.toUpperCase()
    }));
  }, [items]);
  return <MemoizedChild onClick={handleClick} data={formattedItems} />;
}
```
---


## Expensive Calculations


### Fibonacci Sequence
```javascript
function Fibonacci({ n }) {
  const [count, setCount] = useState(0);
  // Without useMemo - calculates on EVERY render!
  const fibWithout = useMemo(() => {
    const fib = (num) => {
      if (num <= 1) return 1;
      return fib(num - 1) + fib(num - 2);
    };
    return fib(n);
  }, [n]);
  console.log('Render:', count, 'Fibonacci:', fibWithout);
  return (
    <div>
      <p>Fibonacci of {n}: {fibWithout}</p>
      <button onClick={() => setCount(count + 1)}>Re-render</button>
      <p>Rendered {count} times</p>
    </div>
  );
}
```


### Complex Array Operations
```javascript
function DataAnalytics({ data, filters }) {
  const [viewMode, setViewMode] = useState('table');
  // Expensive: Filter data
  const filteredData = useMemo(() => {
    console.log('Filtering data...');
    return data.filter(item => {
      // Complex filter logic
      if (filters.dateRange && !isInRange(item.date, filters.dateRange)) {
        return false;
      }
      if (filters.categories.length && !filters.categories.includes(item.category)) {
        return false;
      }
      if (filters.minPrice && item.price < filters.minPrice) {
        return false;
      }
      return true;
    });
  }, [data, filters]);
  // Expensive: Calculate statistics
  const stats = useMemo(() => {
    console.log('Calculating stats...');
    const total = filteredData.reduce((sum, item) => sum + item.price, 0);
    const avg = total / filteredData.length;
    const min = Math.min(...filteredData.map(item => item.price));
    const max = Math.max(...filteredData.map(item => item.price));
    return { total, avg, min, max, count: filteredData.length };
  }, [filteredData]);
  // Expensive: Group by category
  const groupedData = useMemo(() => {
    console.log('Grouping data...');
    return filteredData.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [filteredData]);
  return (
    <div>
      <div>
        <button onClick={() => setViewMode(viewMode === 'table' ? 'chart' : 'table')}>
          View: {viewMode}
        </button>
      </div>
      <div>
        <h3>Statistics</h3>
        <p>Total: ${stats.total.toFixed(2)}</p>
        <p>Average: ${stats.avg.toFixed(2)}</p>
        <p>Range: ${stats.min} - ${stats.max}</p>
        <p>Items: {stats.count}</p>
      </div>
      {viewMode === 'table' && (
        <table>
          {filteredData.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
            </tr>
          ))}
        </table>
      )}
      {viewMode === 'chart' && (
        <div>
          {Object.entries(groupedData).map(([category, items]) => (
            <div key={category}>
              {category}: {items.length} items
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```


### Image Processing
```javascript
function ImageGallery({ images, filters }) {
  const processedImages = useMemo(() => {
    console.log('Processing images...');
    return images.map(img => {
      let processed = { ...img };
      if (filters.brightness !== 100) {
        processed.brightness = filters.brightness;
      }
      if (filters.contrast !== 100) {
        processed.contrast = filters.contrast;
      }
      if (filters.saturate) {
        processed.saturated = true;
      }
      return processed;
    });
  }, [images, filters]);
  return (
    <div className="gallery">
      {processedImages.map(img => (
        <img key={img.id} src={img.src} alt={img.alt} />
      ))}
    </div>
  );
}
```
---


## Referential Equality


### The Problem
```javascript
function Component({ userId }) {
  // ❌ BAD: New object created every render
  const config = {
    userId,
    apiEndpoint: `/api/users/${userId}`
  };
  useEffect(() => {
    fetch(config.apiEndpoint);
  }, [config]); // config changes every render = infinite loop!
}
// ✅ GOOD: Stable reference with useMemo
function Component({ userId }) {
  const config = useMemo(() => ({
    userId,
    apiEndpoint: `/api/users/${userId}`
  }), [userId]);
  useEffect(() => {
    fetch(config.apiEndpoint);
  }, [config]); // config only changes when userId changes
}
```


### Stable References for Children
```javascript
const MemoizedChild = React.memo(({ options }) => {
  console.log('Child rendered');
  return <div>Options: {JSON.stringify(options)}</div>;
});
function Parent() {
  const [count, setCount] = useState(0);
  // ❌ BAD: New object every render
  const options = { theme: 'dark', lang: 'en' };
  // ✅ GOOD: Stable reference
  const options = useMemo(() => ({
    theme: 'dark',
    lang: 'en'
  }), []); // Empty deps = never changes
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoizedChild options={options} />
    </div>
  );
}
```


### Array References
```javascript
function Parent() {
  const [items, setItems] = useState([1, 2, 3]);
  const [filter, setFilter] = useState('');
  // ❌ BAD: New array every render
  const filtered = items.filter(item => item.includes(filter));
  // ✅ GOOD: Stable reference
  const filtered = useMemo(() => {
    return items.filter(item => item.includes(filter));
  }, [items, filter]);
  return <MemoizedChild items={filtered} />;
}
const MemoizedChild = React.memo(({ items }) => {
  console.log('Child rendered with items:', items);
  return <div>{items.join(', ')}</div>;
});
```
---


## Advanced Patterns


### Pattern 1: Chained Memoization
```javascript
function ComplexDataProcessor({ rawData, filters }) {
  // Step 1: Filter
  const filtered = useMemo(() => {
    return rawData.filter(item => matchesFilter(item, filters));
  }, [rawData, filters]);
  // Step 2: Transform
  const transformed = useMemo(() => {
    return filtered.map(item => transformItem(item));
  }, [filtered]);
  // Step 3: Group
  const grouped = useMemo(() => {
    return transformed.reduce((acc, item) => {
      const key = item.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [transformed]);
  // Step 4: Calculate stats
  const stats = useMemo(() => {
    const values = transformed.map(item => item.value);
    return {
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [transformed]);
  return (
    <div>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
```


### Pattern 2: Conditional Memoization
```javascript
function ConditionalMemo({ data, compute }) {
  const result = useMemo(() => {
    if (!compute || !data.length) {
      return null;
    }
    // Only compute if compute is true
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data, compute]);
  if (!result) return <div>No data to compute</div>;
  return <div>Result: {result}</div>;
}
```


### Pattern 3: Multiple Memoized Values
```javascript
function Dashboard({ data }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  // Multiple memoized computations
  const filtered = useMemo(() => {
    if (filterBy === 'all') return data;
    return data.filter(item => item.category === filterBy);
  }, [data, filterBy]);
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });
  }, [filtered, sortBy]);
  const stats = useMemo(() => {
    const total = sorted.reduce((sum, item) => sum + item.value, 0);
    const avg = total / sorted.length;
    return { total, avg };
  }, [sorted]);
  return (
    <div>
      <div>
        <button onClick={() => setSortBy('date')}>Sort by Date</button>
        <button onClick={() => setSortBy('price')}>Sort by Price</button>
      </div>
      <div>Total: {stats.total}</div>
      <div>Average: {stats.avg}</div>
    </div>
  );
}
```
---


## Performance Optimization


### Before Optimization
```javascript
function SlowComponent({ items }) {
  const [count, setCount] = useState(0);
  // Runs on EVERY render, even when count changes!
  const processedItems = items.map(item => {
    // Expensive operation
    const complex = expensiveCalculation(item);
    return {
      ...item,
      complex,
      formatted: formatValue(complex)
    };
  });
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <div>{processedItems.map(item => <div key={item.id}>{item.name}</div>)}</div>
    </div>
  );
}
```


### After Optimization
```javascript
function FastComponent({ items }) {
  const [count, setCount] = useState(0);
  // Only runs when items changes!
  const processedItems = useMemo(() => {
    return items.map(item => {
      // Expensive operation
      const complex = expensiveCalculation(item);
      return {
        ...item,
        complex,
        formatted: formatValue(complex)
      };
    });
  }, [items]); // Only depends on items
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <div>{processedItems.map(item => <div key={item.id}>{item.name}</div>)}</div>
    </div>
  );
}
```


### Measuring Performance
```javascript
function PerformanceDemo({ data }) {
  const [count, setCount] = useState(0);
  const startTime = performance.now();
  const processed = useMemo(() => {
    // Simulate expensive computation
    return data.map(item => ({
      ...item,
      computed: item.value * 2,
      formatted: new Intl.NumberFormat().format(item.value)
    }));
  }, [data]);
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  return (
    <div>
      <p>Compute time: {renderTime.toFixed(2)}ms</p>
      <p>Render count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Re-render</button>
    </div>
  );
}
```
---


## Common Patterns


### Pattern 1: Filtering and Sorting
```javascript
function ProductList({ products, search, sortBy }) {
  const filtered = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });
  }, [filtered, sortBy]);
  return (
    <ul>
      {sorted.map(product => (
        <li key={product.id}>{product.name} - ${product.price}</li>
      ))}
    </ul>
  );
}
```


### Pattern 2: Data Transformation
```javascript
function DataTable({ rawData, columns }) {
  const transformedData = useMemo(() => {
    return rawData.map(row => ({
      ...row,
      formattedDate: new Date(row.timestamp).toLocaleDateString(),
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(row.price),
      displayColumns: columns.map(col => row[col])
    }));
  }, [rawData, columns]);
  return (
    <table>
      <tbody>
        {transformedData.map((row, i) => (
          <tr key={i}>
            <td>{row.formattedDate}</td>
            <td>{row.formattedPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```


### Pattern 3: Statistics Calculation
```javascript
function AnalyticsDashboard({ data, timeRange }) {
  const filtered = useMemo(() => {
    const start = new Date(timeRange.start);
    const end = new Date(timeRange.end);
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }, [data, timeRange]);
  const stats = useMemo(() => {
    const values = filtered.map(item => item.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
    return { sum, avg, min, max, median, count: values.length };
  }, [filtered]);
  return (
    <div>
      <h2>Statistics</h2>
      <p>Total: {stats.sum.toFixed(2)}</p>
      <p>Average: {stats.avg.toFixed(2)}</p>
      <p>Min: {stats.min}</p>
      <p>Max: {stats.max}</p>
      <p>Median: {stats.median}</p>
      <p>Items: {stats.count}</p>
    </div>
  );
}
```
---


## Real-World Applications


### Application 1: Search and Filter
```javascript
function SearchableList({ items }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filter, setFilter] = useState('all');
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      // Category filter
      const matchesCategory = filter === 'all' || item.category === filter;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, filter]);
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      return 0;
    });
  }, [filteredItems, sortBy]);
  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="date">Date</option>
      </select>
      <ul>
        {sortedItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```


### Application 2: Chart Data Preparation
```javascript
function ChartComponent({ rawData, chartType }) {
  const [timeRange, setTimeRange] = useState('week');
  const chartData = useMemo(() => {
    const now = new Date();
    const ranges = {
      week: 7,
      month: 30,
      year: 365
    };
    const days = ranges[timeRange];
    return rawData
      .filter(item => {
        const itemDate = new Date(item.date);
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      })
      .reduce((acc, item) => {
        const date = new Date(item.date).toISOString().split('T')[0];
        if (!acc[date]) acc[date] = { date, total: 0, count: 0 };
        acc[date].total += item.value;
        acc[date].count += 1;
        acc[date].avg = acc[date].total / acc[date].count;
        return acc;
      }, {});
  }, [rawData, timeRange]);
  return (
    <div>
      <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
        <option value="week">Last Week</option>
        <option value="month">Last Month</option>
        <option value="year">Last Year</option>
      </select>
      <div>Chart with {Object.keys(chartData).length} data points</div>
    </div>
  );
}
```
---


## Common Pitfalls


### Pitfall 1: Memoizing Everything
```javascript
// ❌ BAD: Unnecessary memoization
function OverMemoized({ a, b }) {
  const sum = useMemo(() => a + b, [a, b]);
  const product = useMemo(() => a * b, [a, b]);
  const difference = useMemo(() => Math.abs(a - b), [a, b]);
  // Too many useMemo calls add overhead!
}
// ✅ GOOD: Only memoize expensive operations
function Reasonable({ items }) {
  // Simple operations don't need memoization
  const sum = items.reduce((a, b) => a + b.value, 0);
  // Complex operations do
  const complex = useMemo(() => {
    return items.map(complexCalculation);
  }, [items]);
}
```


### Pitfall 2: Missing Dependencies
```javascript
// ❌ BAD: Missing dependency
function Component({ items }) {
  const [filter, setFilter] = useState('');
  const filtered = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items]); // Missing filter!
  // Bug: won't update when filter changes
}
// ✅ GOOD: All dependencies
function Component({ items }) {
  const [filter, setFilter] = useState('');
  const filtered = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]); // Correct!
}
```


### Pitfall 3: Dependency Array Issues
```javascript
// ❌ BAD: Dependencies change too often
function Component({ items }) {
  const processed = useMemo(() => {
    return items.map(transform);
  }, [items]); // items might be new array every render!
}
// ✅ GOOD: Extract stable values
function Component({ items }) {
  // Extract unique ID or timestamp
  const itemsId = useMemo(() => 
    items.map(i => i.id).join(',')
  , [items]);
  const processed = useMemo(() => {
    return items.map(transform);
  }, [itemsId]); // Stable dependency
}
```
---


## Best Practices


### ✅ DO
1. **Use for expensive computations**
   ```javascript
   const expensive = useMemo(() => compute(intensive), [deps]);
   ```
2. **Use for stable references**
   ```javascript
   const config = useMemo(() => ({ theme, lang }), [theme, lang]);
   ```
3. **Profile before optimizing**
   ```javascript
   console.time('computation');
   const result = expensive();
   console.timeEnd('computation');
   // Optimize only if time is significant
   ```
4. **Combine with React.memo**
   ```javascript
   const MemoizedChild = React.memo(Child);
   const data = useMemo(() => process(items), [items]);
   return <MemoizedChild data={data} />;
   ```


### ❌ DON'T
1. **Don't memoize simple operations**
   ```javascript
   const sum = a + b; // Don't use useMemo here!
   ```
2. **Don't forget dependencies**
   ```javascript
   useMemo(() => compute(a, b), []); // Missing a, b!
   ```
3. **Don't over-memoize**
   ```javascript
   // Too many useMemo calls add overhead
   ```
4. **Don't memoize primitive literals**
   ```javascript
   useMemo(() => 42, []); // Pointless!
   ```
---


## Interview Preparation


### Common Questions


#### Q1: What is useMemo and when should you use it?
**Answer**: useMemo memoizes computed values to avoid recalculating on every render. Use it for expensive calculations, stable object/array references, and when passing values to memoized children.


#### Q2: What's the difference between useMemo and useCallback?
**Answer**: useMemo memoizes **values**, useCallback memoizes **functions**. useMemo returns the computed result, useCallback returns the same function reference.


#### Q3: When would you NOT use useMemo?
**Answer**: Don't use useMemo for simple operations, when dependencies change frequently, or when the overhead of memoization exceeds benefits.


#### Q4: How does useMemo handle dependencies?
**Answer**: useMemo compares dependencies using `Object.is()`. If dependencies haven't changed, it returns the cached value. If they've changed, it recalculates and caches the new value.


#### Q5: Can useMemo prevent re-renders?
**Answer**: useMemo itself doesn't prevent re-renders. But providing stable references (via useMemo) to memoized children (via React.memo) can prevent child re-renders.
---


## Practice Exercise


### Requirements:
- ✅ Calculate Fibonacci numbers with memoization
- ✅ Optimize expensive array filtering
- ✅ Implement search with stable references
- ✅ Use useMemo for data transformations


### Solution:
See practice file: `day-13/practice/fibonacci-memoization.jsx`
---


## Key Takeaways


### ✅ What You Learned Today
1. **useMemo**: Hook for memoizing computed values
2. **Memoization**: Caching expensive calculations
3. **Performance**: Preventing unnecessary computations
4. **Dependencies**: Include all used values
5. **Referential Equality**: Stable object/array references
6. **vs useCallback**: Memoize values, not functions
7. **Best Practices**: Profile first, don't overuse


### 🎯 Key Concepts
- useMemo caches computation results
- Only recalculates when dependencies change
- Ideal for expensive operations
- Provides stable references
- Combine with React.memo for optimization
- Don't overuse - it has overhead
- Profile before optimizing


### 📚 Next Steps
Tomorrow you'll learn:
- ✅ Context API for global state
- ✅ Creating context and providers
- ✅ useContext hook
- ✅ Building theme switchers
- ✅ Avoiding prop drilling
---
**Great work! 🎉 You've mastered useMemo!**
**You're now ready to learn Context API for global state! 🚀**
---


## Summary Cheat Sheet


### useMemo Quick Reference
```javascript
// Basic usage
const memoized = useMemo(() => compute(a, b), [a, b]);
// Expensive calculation
const expensive = useMemo(() => {
  return heavyComputation(data);
}, [data]);
// Stable reference
const config = useMemo(() => ({
  theme,
  options
}), [theme]);
// Chained memoization
const filtered = useMemo(() => filter(data), [data]);
const transformed = useMemo(() => transform(filtered), [filtered]);
```


### When to Use useMemo
| Scenario | Use useMemo? |
|----------|--------------|
| Expensive calculation | ✅ Yes |
| Simple addition | ❌ No |
| Stable object reference | ✅ Yes |
| Primitive value | ❌ No |
| Filtering large array | ✅ Yes |
| Inline object literal | ❌ No |
| Data transformation | ✅ Yes |
| Basic math | ❌ No |
---
**Complete! You've mastered useMemo from basics to advanced patterns! 🎯**
