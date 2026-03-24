// src/data/mockData.ts

import { calculateAQI } from '../lib/aqiCalculator';

export interface PollutantValues {
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
}

export interface WeeklyTrend {
  day: string;
  aqi: number;
}

export interface AIPrediction {
  time: string;
  actual: number | null;
  predicted: number;
}

export interface Hotspot {
  lat: number;
  lng: number;
  aqi: number;
  radius: number;
}

export interface DashboardData {
  currentAQI: number;
  pollutants: PollutantValues;
  weeklyTrend: WeeklyTrend[];
  aiPrediction24h: AIPrediction[];
  hotspots: Hotspot[];
}

// Realistic pollutant values for Pune - using the specified schema
const puneCurrentPollutants = {
  pm25: 85,   // µg/m³ (as specified)
  pm10: 120,  // µg/m³ (as specified)
  o3: 68,     // ppb (derived to match AQI ~165)
  no2: 45,    // ppb (as specified)
  so2: 32,    // ppb (derived)
  co: 1.2     // ppm (as specified)
};

// Calculate AQI from current pollutant values
const currentAQI = calculateAQI({
  pm25: puneCurrentPollutants.pm25,
  pm10: puneCurrentPollutants.pm10,
  o3: puneCurrentPollutants.o3,
  no2: puneCurrentPollutants.no2,
  so2: puneCurrentPollutants.so2,
  co: puneCurrentPollutants.co
});

export const mockDashboardData: DashboardData = {
  currentAQI: currentAQI, // Calculated from actual pollutant values
  pollutants: {
    pm25: puneCurrentPollutants.pm25,
    pm10: puneCurrentPollutants.pm10,
    co: puneCurrentPollutants.co,
    no2: puneCurrentPollutants.no2
  },
  weeklyTrend: [
    // Weekly progression matching specified data
    { day: "Mon", aqi: calculateAQI({ pm25: 52, pm10: 78, o3: 55, no2: 38, so2: 22, co: 1.1 }) },  // ~110
    { day: "Tue", aqi: calculateAQI({ pm25: 60, pm10: 92, o3: 62, no2: 42, so2: 26, co: 1.25 }) }, // ~130
    { day: "Wed", aqi: calculateAQI({ pm25: 58, pm10: 88, o3: 60, no2: 40, so2: 24, co: 1.2 }) },  // ~125
    { day: "Thu", aqi: calculateAQI({ pm25: 70, pm10: 105, o3: 65, no2: 48, so2: 28, co: 1.35 }) }, // ~150
    { day: "Fri", aqi: calculateAQI({ pm25: 85, pm10: 120, o3: 68, no2: 45, so2: 32, co: 1.2 }) },  // ~165
    { day: "Sat", aqi: calculateAQI({ pm25: 92, pm10: 135, o3: 75, no2: 52, so2: 36, co: 1.4 }) },  // ~180
    { day: "Sun", aqi: calculateAQI({ pm25: 68, pm10: 98, o3: 62, no2: 42, so2: 28, co: 1.3 }) }   // ~140
  ],
  aiPrediction24h: [
    { 
      time: "00:00", 
      actual: currentAQI,
      predicted: calculateAQI({ pm25: 83, pm10: 118, o3: 67, no2: 44, so2: 31, co: 1.19 }) // ~160
    },
    { 
      time: "06:00", 
      actual: null, 
      predicted: calculateAQI({ pm25: 92, pm10: 128, o3: 72, no2: 50, so2: 35, co: 1.35 }) // ~175
    },
    { 
      time: "12:00", 
      actual: null, 
      predicted: calculateAQI({ pm25: 102, pm10: 142, o3: 80, no2: 58, so2: 40, co: 1.5 }) // ~190
    },
    { 
      time: "18:00", 
      actual: null, 
      predicted: calculateAQI({ pm25: 97, pm10: 135, o3: 76, no2: 54, so2: 37, co: 1.42 }) // ~185
    }
  ],
  hotspots: [
    { 
      lat: 18.5204, 
      lng: 73.8567, 
      aqi: calculateAQI({ pm25: 110, pm10: 165, o3: 88, no2: 68, so2: 48, co: 1.8 }), // High pollution zone (~180)
      radius: 500 
    },
    { 
      lat: 18.5314, 
      lng: 73.8446, 
      aqi: calculateAQI({ pm25: 75, pm10: 112, o3: 68, no2: 48, so2: 30, co: 1.28 }), // Moderate pollution zone (~155)
      radius: 400 
    }
  ]
};
