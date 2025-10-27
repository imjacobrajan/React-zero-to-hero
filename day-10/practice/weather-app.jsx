import { useState } from 'react';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    
    try {
      // Note: You'll need an API key from openweathermap.org
      const API_KEY = 'YOUR_API_KEY'; // Replace with your key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };
  
  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(to bottom, #87CEEB, #4682B4)',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Weather App</h1>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '4px 0 0 4px'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#FF6347',
              color: 'white',
              border: 'none',
              borderRadius: '0 4px 4px 0',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Search
          </button>
        </div>
      </form>
      
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '8px'
        }}>
          Loading weather data...
        </div>
      )}
      
      {error && (
        <div style={{
          padding: '20px',
          background: '#ffcccc',
          color: '#cc0000',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
      
      {weather && !loading && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
            {weather.name}, {weather.sys.country}
          </h2>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{ width: '100px' }}
            />
            <h3 style={{ margin: '10px 0' }}>
              {Math.round(weather.main.temp)}°C
            </h3>
            <p style={{ color: '#666', fontSize: '18px' }}>
              {weather.weather[0].description}
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#666' }}>Feels Like</p>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#666' }}>Humidity</p>
              <strong>{weather.main.humidity}%</strong>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#666' }}>Wind</p>
              <strong>{weather.wind.speed} m/s</strong>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#666' }}>Pressure</p>
              <strong>{weather.main.pressure} hPa</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;

