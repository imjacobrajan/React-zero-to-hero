import { useState, useMemo } from 'react';

function FibonacciCalculator() {
  const [n, setN] = useState(10);
  const [showAll, setShowAll] = useState(false);
  
  // Memoized expensive Fibonacci calculation
  const fibonacciValues = useMemo(() => {
    const fib = [0, 1];
    for (let i = 2; i <= n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib;
  }, [n]);
  
  const currentValue = fibonacciValues[n];
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Fibonacci Calculator with useMemo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Calculate Fibonacci(n): 
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            min="0"
            max="100"
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>
      
      <div style={{
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3>Result: F({n}) = {currentValue?.toLocaleString() || 0}</h3>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          />
          Show all values
        </label>
      </div>
      
      {showAll && (
        <div>
          <h3>All Fibonacci Values:</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '10px',
            marginTop: '10px'
          }}>
            {fibonacciValues.map((value, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontSize: '14px'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  F({index})
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e8f4f8',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>Performance Note:</strong> The useMemo hook prevents
        recalculating Fibonacci values when other state changes (like toggling
        'Show all'). Without useMemo, the entire array would be recalculated
        on every render.
      </div>
    </div>
  );
}

export default FibonacciCalculator;

