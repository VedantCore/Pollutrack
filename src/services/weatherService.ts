const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "YOUR_OPENWEATHER_API_KEY"; // Replace with your actual key if not using .env
const BASE_URL = "https://api.openweathermap.org";

export interface GeoLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface AirPollutionData {
  coord: {
    lon: number;
    lat: number;
  };
  list: {
    main: {
      aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }[];
}

export const weatherService = {
  /**
   * Search for a city by name to get coordinates
   */
  async searchCity(query: string): Promise<GeoLocation[]> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
        console.warn("OpenWeather API Key is missing! Using mock data fallback.");
        // Fallback mock check to prevent crashing if key is missing
        return [];
      }
      
      const response = await fetch(
        `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to search city:", error);
      throw error;
    }
  },

  /**
   * Get air pollution data for specific coordinates
   */
  async getAirPollution(lat: number, lon: number): Promise<AirPollutionData> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
          throw new Error("API Key missing");
      }

      const response = await fetch(
        `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Air Pollution API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch air pollution data:", error);
      throw error;
    }
  },

  /**
   * Get forecast air pollution data
   */
  async getAirPollutionForecast(lat: number, lon: number): Promise<AirPollutionData> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
          throw new Error("API Key missing");
      }

      const response = await fetch(
        `${BASE_URL}/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Forecast API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
        console.error("Failed to fetch forecast:", error);
        throw error;
    }
  },

  /**
   * Get city name from coordinates using reverse geocoding
   */
  async getCityName(lat: number, lon: number): Promise<string> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
          return "Current Location"; // Fallback to "Current Location" if API key is not available
      }

      const response = await fetch(
        `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Reverse Geocoding API Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].name;
      }
      return "Current Location";
    } catch (error) {
        console.error("Failed to fetch city name:", error);
        return "Current Location";
    }
  },

  /**
   * Get historical air pollution data
   */
  async getAirPollutionHistory(lat: number, lon: number, start: number, end: number): Promise<AirPollutionData> {
    try {
      if (!API_KEY || API_KEY === "YOUR_OPENWEATHER_API_KEY") {
          throw new Error("API Key missing");
      }

      const response = await fetch(
        `${BASE_URL}/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`History API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
        console.error("Failed to fetch history:", error);
        throw error;
    }
  }
};
