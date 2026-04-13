/**
 * AQI Calculator based on EPA Air Quality Index standards
 * Converts pollutant concentrations to AQI values
 */

interface PollutantConcentrations {
  pm25?: number;  // PM2.5 in µg/m³
  pm10?: number;  // PM10 in µg/m³
  o3?: number;    // Ozone in ppb
  no2?: number;   // Nitrogen Dioxide in ppb
  so2?: number;   // Sulfur Dioxide in ppb
  co?: number;    // Carbon Monoxide in ppm
}

interface AQIBreakpoint {
  aqiLo: number;
  aqiHi: number;
  pollutantLo: number;
  pollutantHi: number;
}

// PM2.5 Breakpoints (µg/m³)
const PM25_BREAKPOINTS: AQIBreakpoint[] = [
  { aqiLo: 0, aqiHi: 50, pollutantLo: 0, pollutantHi: 12.0 },
  { aqiLo: 51, aqiHi: 100, pollutantLo: 12.1, pollutantHi: 35.4 },
  { aqiLo: 101, aqiHi: 150, pollutantLo: 35.5, pollutantHi: 55.4 },
  { aqiLo: 151, aqiHi: 200, pollutantLo: 55.5, pollutantHi: 150.4 },
  { aqiLo: 201, aqiHi: 300, pollutantLo: 150.5, pollutantHi: 250.4 },
  { aqiLo: 301, aqiHi: 500, pollutantLo: 250.5, pollutantHi: 500.4 }
];

// PM10 Breakpoints (µg/m³)
const PM10_BREAKPOINTS: AQIBreakpoint[] = [
  { aqiLo: 0, aqiHi: 50, pollutantLo: 0, pollutantHi: 54 },
  { aqiLo: 51, aqiHi: 100, pollutantLo: 55, pollutantHi: 154 },
  { aqiLo: 101, aqiHi: 150, pollutantLo: 155, pollutantHi: 254 },
  { aqiLo: 151, aqiHi: 200, pollutantLo: 255, pollutantHi: 354 },
  { aqiLo: 201, aqiHi: 300, pollutantLo: 355, pollutantHi: 424 },
  { aqiLo: 301, aqiHi: 500, pollutantLo: 425, pollutantHi: 604 }
];

// Ozone (1-hour) Breakpoints (ppb)
const O3_BREAKPOINTS: AQIBreakpoint[] = [
  { aqiLo: 0, aqiHi: 50, pollutantLo: 0, pollutantHi: 54 },
  { aqiLo: 51, aqiHi: 100, pollutantLo: 55, pollutantHi: 70 },
  { aqiLo: 101, aqiHi: 150, pollutantLo: 71, pollutantHi: 85 },
  { aqiLo: 151, aqiHi: 200, pollutantLo: 86, pollutantHi: 105 },
  { aqiLo: 201, aqiHi: 300, pollutantLo: 106, pollutantHi: 200 },
  { aqiLo: 301, aqiHi: 500, pollutantLo: 201, pollutantHi: 604 }
];

// NO2 Breakpoints (ppb)
const NO2_BREAKPOINTS: AQIBreakpoint[] = [
  { aqiLo: 0, aqiHi: 50, pollutantLo: 0, pollutantHi: 53 },
  { aqiLo: 51, aqiHi: 100, pollutantLo: 54, pollutantHi: 100 },
  { aqiLo: 101, aqiHi: 150, pollutantLo: 101, pollutantHi: 360 },
  { aqiLo: 151, aqiHi: 200, pollutantLo: 361, pollutantHi: 649 },
  { aqiLo: 201, aqiHi: 300, pollutantLo: 650, pollutantHi: 1249 },
  { aqiLo: 301, aqiHi: 500, pollutantLo: 1250, pollutantHi: 2049 }
];

// SO2 Breakpoints (ppb)
const SO2_BREAKPOINTS: AQIBreakpoint[] = [
  { aqiLo: 0, aqiHi: 50, pollutantLo: 0, pollutantHi: 35 },
  { aqiLo: 51, aqiHi: 100, pollutantLo: 36, pollutantHi: 75 },
  { aqiLo: 101, aqiHi: 150, pollutantLo: 76, pollutantHi: 185 },
  { aqiLo: 151, aqiHi: 200, pollutantLo: 186, pollutantHi: 304 },
  { aqiLo: 201, aqiHi: 300, pollutantLo: 305, pollutantHi: 604 },
  { aqiLo: 301, aqiHi: 500, pollutantLo: 605, pollutantHi: 1004 }
];

// CO Breakpoints (ppm)
const CO_BREAKPOINTS: AQIBreakpoint[] = [
  { aqiLo: 0, aqiHi: 50, pollutantLo: 0, pollutantHi: 4.4 },
  { aqiLo: 51, aqiHi: 100, pollutantLo: 4.5, pollutantHi: 9.4 },
  { aqiLo: 101, aqiHi: 150, pollutantLo: 9.5, pollutantHi: 12.4 },
  { aqiLo: 151, aqiHi: 200, pollutantLo: 12.5, pollutantHi: 15.4 },
  { aqiLo: 201, aqiHi: 300, pollutantLo: 15.5, pollutantHi: 30.4 },
  { aqiLo: 301, aqiHi: 500, pollutantLo: 30.5, pollutantHi: 50.4 }
];

/**
 * Calculate AQI from a pollutant concentration using linear interpolation
 */
function calculateSubIndex(
  concentration: number,
  breakpoints: AQIBreakpoint[]
): number {
  // Find the appropriate breakpoint range
  for (const bp of breakpoints) {
    if (concentration >= bp.pollutantLo && concentration <= bp.pollutantHi) {
      // Linear interpolation formula
      const aqi =
        ((bp.aqiHi - bp.aqiLo) / (bp.pollutantHi - bp.pollutantLo)) *
          (concentration - bp.pollutantLo) +
        bp.aqiLo;
      return Math.round(aqi);
    }
  }

  // If concentration is beyond the highest breakpoint
  const lastBp = breakpoints[breakpoints.length - 1];
  if (concentration > lastBp.pollutantHi) {
    return lastBp.aqiHi;
  }

  return 0;
}

/**
 * Calculate overall AQI from pollutant concentrations
 * Returns the maximum sub-index among all pollutants
 */
export function calculateAQI(
  pollutants: PollutantConcentrations
): number {
  const subIndices: number[] = [];

  // Calculate sub-index for each available pollutant
  if (pollutants.pm25 !== undefined) {
    subIndices.push(calculateSubIndex(pollutants.pm25, PM25_BREAKPOINTS));
  }
  
  if (pollutants.pm10 !== undefined) {
    subIndices.push(calculateSubIndex(pollutants.pm10, PM10_BREAKPOINTS));
  }
  
  if (pollutants.o3 !== undefined) {
    subIndices.push(calculateSubIndex(pollutants.o3, O3_BREAKPOINTS));
  }
  
  if (pollutants.no2 !== undefined) {
    subIndices.push(calculateSubIndex(pollutants.no2, NO2_BREAKPOINTS));
  }
  
  if (pollutants.so2 !== undefined) {
    subIndices.push(calculateSubIndex(pollutants.so2, SO2_BREAKPOINTS));
  }
  
  if (pollutants.co !== undefined) {
    subIndices.push(calculateSubIndex(pollutants.co, CO_BREAKPOINTS));
  }

  // Return the maximum sub-index (worst pollutant determines overall AQI)
  return subIndices.length > 0 ? Math.max(...subIndices) : 0;
}

/**
 * Get AQI description based on index value
 */
export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

/**
 * Get health recommendations based on AQI
 */
export function getHealthRecommendation(aqi: number): string {
  if (aqi <= 50) {
    return 'Air quality is satisfactory. Enjoy outdoor activities.';
  } else if (aqi <= 100) {
    return 'Air quality is acceptable. Unusually sensitive people should limit outdoor exertion.';
  } else if (aqi <= 150) {
    return 'Sensitive groups (children, elderly, people with respiratory issues) should limit outdoor exertion.';
  } else if (aqi <= 200) {
    return 'All groups may experience health effects. General public should limit outdoor exertion.';
  } else if (aqi <= 300) {
    return 'Health alert: The entire population is more likely to be affected.';
  } else {
    return 'Health warning: Everyone should avoid outdoor exertion. Seek indoor shelter.';
  }
}
