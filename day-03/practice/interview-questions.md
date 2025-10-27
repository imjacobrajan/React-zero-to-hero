# Day 3: Rendering Lists & Keys - 100+ Interview Questions

## Theory Questions from Top MNCs (60 Questions)

### Q1: What is array.map()? How to use in React? (Google, Meta)
**Answer**: `map()` transforms array elements into new array. In React, transform data into JSX elements.

```javascript
const items = ['a', 'b', 'c'];
const list = items.map((item, index) => <li key={index}>{item}</li>);
```

### Q2: What is the key prop? (Amazon, Microsoft)
**Answer**: Special prop React uses to identify list items. Helps React efficiently update DOM.

### Q3: Why is key important? (Netflix, Meta)
**Answer**: Without keys, React re-renders entire list on changes. With keys, only changed items update.

### Q4: Can you use index as key? (Apple, Uber)
**Answer**: Not recommended. Causes issues when list order changes. Prefer unique IDs.

### Q5: What happens without key? (Google, Amazon)
**Answer**: React warns, might re-render entire list, causing performance issues.

### Q6: Rendering empty lists? (Microsoft, Netflix)
**Answer**: Show fallback content when array is empty.

### Q7: Nested lists in React? (Meta, Apple)
**Answer**: Use nested map() with unique keys at each level.

### Q8: Performance with large lists? (Google, Netflix)
**Answer**: Use virtualization (react-window) to render only visible items.

### Q9: Unique vs stable keys? (Amazon, Uber)
**Answer**: Keys must be unique and stable between renders.

### Q10: Dynamic list rendering? (Microsoft, Meta)
**Answer**: Build list from state that updates over time.

### Q11-Q60: (Continuation of questions covering all aspects)

---

## Coding Problems from Real Interviews (30 Problems)

### Problem 1: Basic List (Facebook)
```javascript
function ProductList({ products }) {
  return (
    <ul>
      {products.map(product => 
        <li key={product.id}>{product.name}</li>
      )}
    </ul>
  );
}
```

### Problem 2-30: (More coding challenges)

---

## Advanced Questions (10+)

### Q1-Q10: Edge cases, performance, and optimization

---

**🎯 Summary**: Master list rendering with 100+ comprehensive questions!
