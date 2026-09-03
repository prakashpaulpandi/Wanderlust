import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeatherByCoords, getWeatherIcon } from '../../services/weatherService';
import { getWeatherByCity } from '../../services/weatherService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useDebounce } from '../../hooks/useDebounce';
import './LocationWeather.css';

const LocationWeather = () => {
  const { loading: geoLoading, error: geoError, coordinates, denied, requestLocation } = useGeolocation();
  const [cityInput, setCityInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const debouncedCity = useDebounce(cityInput, 600);

  // Auto-fetch when coords arrive
  useEffect(() => {
    if (!coordinates) return;
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(null);
    getWeatherByCoords(coordinates.lat, coordinates.lon)
      .then((data) => { if (!cancelled) setWeather(data); })
      .catch((err) => { if (!cancelled) setWeatherError(err.message); })
      .finally(() => { if (!cancelled) setWeatherLoading(false); });
    return () => { cancelled = true; };
  }, [coordinates]);

  // Search by city
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await getWeatherByCity(cityInput.trim());
      setWeather(data);
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const isLoading = geoLoading || weatherLoading;

  return (
    <div className="loc-weather">
      <div className="loc-weather__controls">
        {/* Geolocation button */}
        <button
          type="button"
          className="btn btn--outline loc-weather__geo-btn"
          onClick={requestLocation}
          disabled={isLoading}
          id="use-my-location-btn"
          aria-label="Use my current location"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
          {geoLoading ? 'Locating...' : 'Use My Location'}
        </button>

        <span className="loc-weather__divider" aria-hidden="true">or</span>

        {/* City search */}
        <form className="loc-weather__search-form" onSubmit={handleCitySearch} role="search">
          <label htmlFor="city-search" className="sr-only">Search for a city</label>
          <input
            id="city-search"
            type="search"
            className="input loc-weather__search-input"
            placeholder="Search any city..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            disabled={isLoading}
            aria-label="City name"
          />
          <button
            type="submit"
            className="btn btn--primary"
            disabled={!cityInput.trim() || isLoading}
            id="search-city-btn"
            aria-label="Search city weather"
          >
            {weatherLoading ? <div className="spinner" style={{width:16,height:16}} /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Error states */}
      {(geoError || weatherError) && (
        <div className="loc-weather__error" role="alert">
          <span aria-hidden="true">{denied ? '🚫' : '⚠️'}</span>
          <p>{geoError || weatherError}</p>
        </div>
      )}

      {/* Weather result */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            className="loc-weather__loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            aria-busy="true" aria-live="polite"
          >
            <div className="spinner" />
            <p>Fetching weather data...</p>
          </motion.div>
        )}
        {!isLoading && weather && (
          <motion.div
            key="weather"
            className="loc-weather__result"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            role="region"
            aria-label={`Weather for ${weather.name}`}
          >
            <div className="loc-weather__main">
              <img
                src={getWeatherIcon(weather.weather[0].icon)}
                alt={weather.weather[0].description}
                className="loc-weather__icon"
                width="64"
                height="64"
              />
              <div>
                <p className="loc-weather__city">
                  📍 {weather.name}, {weather.sys.country}
                </p>
                <p className="loc-weather__temp">{Math.round(weather.main.temp)}°C</p>
                <p className="loc-weather__condition">{weather.weather[0].description}</p>
              </div>
            </div>
            <div className="loc-weather__details">
              <span>💧 {weather.main.humidity}%</span>
              <span>💨 {Math.round(weather.wind.speed)} m/s</span>
              <span>🌡️ Feels {Math.round(weather.main.feels_like)}°C</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationWeather;
