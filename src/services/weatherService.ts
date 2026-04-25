const API_KEY = import.meta.env.VITE_WEATHERAPI_API_KEY || "YOUR_WEATHERAPI_API_KEY"; // Replace with your actual key if not using .env
const BASE_URL = "https://api.weatherapi.com/v1";

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
      if (!API_KEY || API_KEY === "YOUR_WEATHERAPI_API_KEY") {
        console.warn("WeatherAPI Key is missing! Using mock data fallback.");
        return [];
      }
      
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Transform WeatherAPI response to match GeoLocation interface
      return data.map((item: any) => ({
        name: item.name,
        lat: item.lat,
        lon: item.lon,
        country: item.country,
        state: item.region
      }));
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
      if (!API_KEY || API_KEY === "YOUR_WEATHERAPI_API_KEY") {
          throw new Error("API Key missing");
      }

      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`Air Pollution API Error: ${response.statusText}`);
      }

      const data = await response.json();
      // Transform WeatherAPI response to match AirPollutionData interface
      const { location, current } = data;
      const aqi = current.air_quality;
      
      return {
        coord: {
          lon: location.lon,
          lat: location.lat
        },
        list: [{
          main: {
            aqi: convertWeatherAPIAQIToScale(aqi.us_epa_index) // Convert to 1-5 scale
          },
          components: {
            co: aqi.co || 0,
            no: aqi.no || 0,
            no2: aqi.no2 || 0,
            o3: aqi.o3 || 0,
            so2: aqi.so2 || 0,
            pm2_5: aqi.pm2_5 || 0,
            pm10: aqi.pm10 || 0,
            nh3: aqi.nh3 || 0
          },
          dt: Math.floor(new Date(current.last_updated).getTime() / 1000)
        }]
      };
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
      if (!API_KEY || API_KEY === "YOUR_WEATHERAPI_API_KEY") {
          throw new Error("API Key missing");
      }

      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`Forecast API Error: ${response.statusText}`);
      }

      const data = await response.json();
      // Transform WeatherAPI forecast response to match AirPollutionData interface
      const { location, forecast } = data;
      
      const list = forecast.forecastday.flatMap((day: any) => 
        day.hour.map((hour: any) => ({
          main: {
            aqi: convertWeatherAPIAQIToScale(hour.air_quality?.us_epa_index || 1)
          },
          components: {
            co: hour.air_quality?.co || 0,
            no: hour.air_quality?.no || 0,
            no2: hour.air_quality?.no2 || 0,
            o3: hour.air_quality?.o3 || 0,
            so2: hour.air_quality?.so2 || 0,
            pm2_5: hour.air_quality?.pm2_5 || 0,
            pm10: hour.air_quality?.pm10 || 0,
            nh3: hour.air_quality?.nh3 || 0
          },
          dt: Math.floor(new Date(hour.time).getTime() / 1000)
        }))
      );

      return {
        coord: {
          lon: location.lon,
          lat: location.lat
        },
        list
      };
    } catch (error) {
        console.error("Failed to fetch forecast:", error);
        throw error;
    }
  },

  /**
   * Get historical air pollution data
   */
  async getAirPollutionHistory(lat: number, lon: number, start: number, end: number): Promise<AirPollutionData> {
    try {
      if (!API_KEY || API_KEY === "YOUR_WEATHERAPI_API_KEY") {
          throw new Error("API Key missing");
      }

      // WeatherAPI requires specific dates for history. Calculate the number of days
      const startDate = new Date(start * 1000);
      const endDate = new Date(end * 1000);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const maxDays = Math.min(daysDiff, 10); // WeatherAPI history limited to 10 days for free tier

      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=${Math.min(maxDays, 10)}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`History API Error: ${response.statusText}`);
      }

      const data = await response.json();
      // Transform WeatherAPI response to match AirPollutionData interface
      const { location, forecast } = data;
      
      const list = forecast.forecastday.flatMap((day: any) => 
        day.hour.map((hour: any) => ({
          main: {
            aqi: convertWeatherAPIAQIToScale(hour.air_quality?.us_epa_index || 1)
          },
          components: {
            co: hour.air_quality?.co || 0,
            no: hour.air_quality?.no || 0,
            no2: hour.air_quality?.no2 || 0,
            o3: hour.air_quality?.o3 || 0,
            so2: hour.air_quality?.so2 || 0,
            pm2_5: hour.air_quality?.pm2_5 || 0,
            pm10: hour.air_quality?.pm10 || 0,
            nh3: hour.air_quality?.nh3 || 0
          },
          dt: Math.floor(new Date(hour.time).getTime() / 1000)
        }))
      );

      return {
        coord: {
          lon: location.lon,
          lat: location.lat
        },
        list
      };
    } catch (error) {
        console.error("Failed to fetch history:", error);
        throw error;
    }
  }
};

/**
 * Convert WeatherAPI US EPA Index (1-6) to standard AQI scale (1-5)
 */
function convertWeatherAPIAQIToScale(epaIndex: number): number {
  // EPA Index: 1=Good, 2=Moderate, 3=Unhealthy for Sensitive Groups, 4=Unhealthy, 5=Very Unhealthy, 6=Hazardous
  // Standard AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
  const mapping: { [key: number]: number } = {
    1: 1, // Good -> Good
    2: 2, // Moderate -> Fair
    3: 3, // Unhealthy for Sensitive Groups -> Moderate
    4: 4, // Unhealthy -> Poor
    5: 5, // Very Unhealthy -> Very Poor
    6: 5  // Hazardous -> Very Poor
  };
  return mapping[epaIndex] || 1;
}
