import { useState, useEffect } from 'react';

function LiveSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    const timer = setTimeout(() => {
      setLoading(true);
      
      // Simulate API call with JSONPlaceholder
      fetch(`https://jsonplaceholder.typicode.com/posts?title_like=${query}`)
        .then(res => res.json())
        .then(data => {
          // Filter by title since API doesn't support search
          const filtered = data.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered.slice(0, 5));
          setError(null);
        })
        .catch(err => {
          setError('Failed to search');
          setResults([]);
        })
        .finally(() => setLoading(false));
    }, 300); // Debounce 300ms
    
    return () => clearTimeout(timer);
  }, [query]);
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Live Search</h2>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      
      <div style={{ marginTop: '20px' }}>
        {loading && <div>Searching...</div>}
        
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        {!loading && !error && query && results.length === 0 && (
          <div>No results found for "{query}"</div>
        )}
        
        {results.length > 0 && (
          <div>
            <h3>Results:</h3>
            {results.map(post => (
              <div
                key={post.id}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white'
                }}
              >
                <h4>{post.title}</h4>
                <p style={{ color: '#666' }}>{post.body.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveSearch;

