import { useState, useEffect } from 'react';

function UserDataFetch() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUser();
  }, [userId]);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>User Profile</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>User ID: </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          min="1"
          max="10"
          style={{ padding: '5px', marginLeft: '10px' }}
        />
      </div>
      
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div className="spinner">Loading...</div>
        </div>
      )}
      
      {error && (
        <div style={{ padding: '20px', color: 'red', background: '#ffe6e6' }}>
          Error: {error}
        </div>
      )}
      
      {!loading && !error && user && (
        <div style={{
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          background: 'white'
        }}>
          <h3>{user.name}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Website:</strong> {user.website}</p>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Address:</h4>
            <p>
              {user.address.street}, {user.address.city}, {user.address.zipcode}
            </p>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Company:</h4>
            <p>{user.company.name}</p>
            <p><em>{user.company.catchPhrase}</em></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDataFetch;

