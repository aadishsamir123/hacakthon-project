/**
 * Weather Service Module
 *
 * Provides weather-related functionality for the application including:
 * - IP-based geolocation detection
 * - Weather data fetching from Open-Meteo API (free, no API key required)
 * - Weather icon mapping for UI display
 * - Fallback weather data when API is unavailable
 */

/**
 * Gets user's location information based on their IP address
 * Uses ipapi.co service for geolocation detection
 *
 * @returns {Promise<Object>} Location object with city, country, latitude, longitude
 */
export const getLocationFromIP = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return {
      city: data.city,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    // Return default coordinates (NYC) if location detection fails
    return {
      city: "Your City",
      country: "Your Country",
      latitude: 40.7128,
      longitude: -74.006, // Default to NYC coordinates
    };
  }
};

/**
 * Fetches current weather data for a given location
 * Uses Open-Meteo API for real-time weather information
 * Includes fallback mechanism with simulated weather data
 *
 * @param {Object} location - Location object with latitude and longitude
 * @returns {Promise<Object>} Weather data object with temperature, description, etc.
 */
export const getWeatherData = async (location) => {
  try {
    // Using Open-Meteo free API - no API key required
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );

    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json();
      const current = weatherData.current_weather;

      // Convert weather codes from Open-Meteo API to human-readable descriptions
      const getWeatherDescription = (code) => {
        const weatherCodes = {
          0: "clear sky",
          1: "mainly clear",
          2: "partly cloudy",
          3: "overcast",
          45: "fog",
          48: "depositing rime fog",
          51: "light drizzle",
          53: "moderate drizzle",
          55: "dense drizzle",
          61: "slight rain",
          63: "moderate rain",
          65: "heavy rain",
          71: "slight snow",
          73: "moderate snow",
          75: "heavy snow",
          95: "thunderstorm",
          96: "thunderstorm with hail",
          99: "thunderstorm with heavy hail",
        };
        return weatherCodes[code] || "unknown weather";
      };

      return {
        city: location.city,
        country: location.country,
        temperature: Math.round(current.temperature),
        description: getWeatherDescription(current.weathercode),
        humidity: weatherData.hourly.relative_humidity_2m[0] || 50,
        windSpeed: Math.round(current.windspeed * 0.277778), // Convert km/h to m/s
      };
    } else {
      throw new Error("Weather API failed");
    }
  } catch (error) {
    console.error("Error fetching weather:", error);

    // Fallback weather system: Generate consistent weather based on location
    // This ensures users still get weather data when the API is unavailable
    const weatherConditions = [
      { condition: "clear sky", temp: 22, humidity: 45, wind: 3 },
      { condition: "partly cloudy", temp: 18, humidity: 60, wind: 5 },
      { condition: "overcast", temp: 15, humidity: 75, wind: 7 },
      { condition: "light rain", temp: 12, humidity: 85, wind: 8 },
      { condition: "sunny", temp: 25, humidity: 40, wind: 4 },
    ];

    // Use location name to consistently generate the same weather for the same place
    const locationHash =
      (location.city + location.country).length % weatherConditions.length;
    const baseWeather = weatherConditions[locationHash];

    // Add minor randomness while keeping weather realistic
    const tempVariation = (Math.random() - 0.5) * 10; // ±5 degrees
    const humidityVariation = (Math.random() - 0.5) * 20; // ±10%
    const windVariation = (Math.random() - 0.5) * 4; // ±2 m/s

    return {
      city: location.city,
      country: location.country,
      temperature: Math.round(baseWeather.temp + tempVariation),
      description: baseWeather.condition,
      humidity: Math.max(
        0,
        Math.min(100, Math.round(baseWeather.humidity + humidityVariation))
      ),
      windSpeed: Math.max(0, Math.round(baseWeather.wind + windVariation)),
    };
  }
};

/**
 * Maps weather descriptions to corresponding emoji icons
 * Provides visual representation for different weather conditions
 *
 * @param {string} description - Weather condition description
 * @returns {string} Weather emoji icon
 */
export const getWeatherIcon = (description) => {
  const iconMap = {
    "clear sky": "☀️",
    "mainly clear": "🌤️",
    sunny: "☀️",
    "partly cloudy": "⛅",
    overcast: "☁️",
    fog: "🌫️",
    "depositing rime fog": "🌫️",
    "light drizzle": "🌦️",
    "moderate drizzle": "🌦️",
    "dense drizzle": "🌦️",
    "slight rain": "🌧️",
    "moderate rain": "🌧️",
    "heavy rain": "⛈️",
    "light rain": "🌦️",
    rain: "🌧️",
    "heavy rain": "⛈️",
    "slight snow": "🌨️",
    "moderate snow": "❄️",
    "heavy snow": "❄️",
    snow: "❄️",
    thunderstorm: "⛈️",
    "thunderstorm with hail": "⛈️",
    "thunderstorm with heavy hail": "⛈️",
    windy: "💨",
  };

  // Return corresponding emoji or default partly cloudy icon
  return iconMap[description] || "🌤️";
};
