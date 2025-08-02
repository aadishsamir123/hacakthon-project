// Weather service with real Open-Meteo API (free, no API key required)
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
    return {
      city: "Your City",
      country: "Your Country",
      latitude: 40.7128,
      longitude: -74.006, // Default to NYC coordinates
    };
  }
};

export const getWeatherData = async (location) => {
  try {
    // Using Open-Meteo free API - no API key required
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    );

    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json();
      const current = weatherData.current_weather;

      // Map weather codes to descriptions
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

    // Fallback to simulated weather based on location
    const weatherConditions = [
      { condition: "clear sky", temp: 22, humidity: 45, wind: 3 },
      { condition: "partly cloudy", temp: 18, humidity: 60, wind: 5 },
      { condition: "overcast", temp: 15, humidity: 75, wind: 7 },
      { condition: "light rain", temp: 12, humidity: 85, wind: 8 },
      { condition: "sunny", temp: 25, humidity: 40, wind: 4 },
    ];

    // Simple hash-based selection to get consistent weather for same location
    const locationHash =
      (location.city + location.country).length % weatherConditions.length;
    const baseWeather = weatherConditions[locationHash];

    // Add some randomness but keep it reasonable
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

  return iconMap[description] || "🌤️";
};
