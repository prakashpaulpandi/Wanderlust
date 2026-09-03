import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeatherByCoords, getWeatherByCity, getWeatherIcon } from '../../services/weatherService';
import { useGeolocation } from '../../hooks/useGeolocation';
import './WeatherWidget.css';

const WeatherWidget = ({ lat, lon, cityName }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchWeather = async () => {
      try {
        let data;
        if (lat !== undefined && lon !== undefined) {
          data = await getWeatherByCoords(lat, lon);
        } else if (cityName) {
          data = await getWeatherByCity(cityName);
        }
        if (!cancelled && data) setWeather(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchWeather();
    return () => { cancelled = true; };
  }, [lat, lon, cityName]);

  if (loading) {
    return (
      <div className="weather-widget weather-widget--loading" aria-busy="true" aria-label="Loading weather">
        <div className="weather-widget__skeleton">
          <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton" style={{ width: '40%', height: '14px' }} />
            <div className="skeleton" style={{ width: '60%', height: '28px' }} />
            <div className="skeleton" style={{ width: '50%', height: '12px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget weather-widget--error" role="alert">
        <div className="weather-widget__error-icon" aria-hidden="true">⚠️</div>
        <div>
          <p className="weather-widget__error-title">Weather unavailable</p>
          <p className="weather-widget__error-msg">{error}</p>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const condition = weather.weather[0];
  const iconUrl = getWeatherIcon(condition.icon);

  const details = [
    { label: 'Humidity', value: `${weather.main.humidity}%`, icon: '💧' },
    { label: 'Wind', value: `${Math.round(weather.wind.speed)} m/s`, icon: '💨' },
    { label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km`, icon: '👁️' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="weather-widget"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        role="region"
        aria-label={`Current weather in ${weather.name}`}
      >
        {/* Main */}
        <div className="weather-widget__main">
          <div className="weather-widget__icon-wrap">
            <img
              src={iconUrl}
              alt={condition.description}
              className="weather-widget__icon"
              width="64"
              height="64"
            />
          </div>
          <div className="weather-widget__info">
            <p className="weather-widget__location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {weather.name}
            </p>
            <div className="weather-widget__temp-row">
              <span className="weather-widget__temp">{temp}°C</span>
              <span className="weather-widget__feels">Feels like {feelsLike}°C</span>
            </div>
            <p className="weather-widget__description">{condition.description}</p>
          </div>
        </div>

        {/* Details */}
        <div className="weather-widget__details">
          {details.map((d) => (
            <div key={d.label} className="weather-widget__detail">
              <span className="weather-widget__detail-icon" aria-hidden="true">{d.icon}</span>
              <div>
                <p className="weather-widget__detail-value">{d.value}</p>
                <p className="weather-widget__detail-label">{d.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherWidget;
