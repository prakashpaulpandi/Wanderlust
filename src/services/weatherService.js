// Weather service using OpenWeather API
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getApiKey = () => import.meta.env.VITE_OPENWEATHER_API_KEY || '';

export const getWeatherByCoords = async (lat, lon) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenWeather API key is missing. Please check your .env file.');
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!response.ok) throw new Error(`Weather API error: ${response.statusText}`);
  return response.json();
};

export const getWeatherByCity = async (city) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenWeather API key is missing. Please check your .env file.');
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
  );
  if (!response.ok) throw new Error(`City not found: ${city}`);
  return response.json();
};

export const getForecast = async (lat, lon) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('OpenWeather API key is missing. Please check your .env file.');
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=5`
  );
  if (!response.ok) throw new Error(`Forecast API error: ${response.statusText}`);
  return response.json();
};

export const getWeatherIcon = (iconCode) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
