import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Layers } from 'lucide-react';
import GlassCard from './ui/GlassCard';
// Removed mockData import

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon path issues with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const mapContainerStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "1rem",
  zIndex: 0
};

interface Hotspot {
  lat: number;
  lng: number;
  aqi: number;
  radius: number;
}

interface PollutionMapProps {
  center?: [number, number];
  hotspots?: Hotspot[];
  locationName?: string;
}

const PollutionMap: React.FC<PollutionMapProps> = ({ center = [18.5204, 73.8567], hotspots = [], locationName }) => {
  const [showZones, setShowZones] = useState(true);
  const position: [number, number] = center; // Use prop or default to Pune
  
  const getZoneColor = (aqi: number) => {
    if (aqi <= 50) return '#22c55e'; // Green - Good
    if (aqi <= 100) return '#f97316'; // Orange - Moderate
    return '#ef4444'; // Red - Severe
  };

  const getZoneLabel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    return 'Severe';
  };

  return (
    <GlassCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-[400px] p-0 overflow-hidden relative border-0">
        {/* @ts-ignore: React Leaflet types mismatch for center prop */}
        <MapContainer center={position} zoom={13} style={mapContainerStyle} scrollWheelZoom={true} className="z-0" dragging={true}>
            <TileLayer
                // @ts-ignore: React Leaflet types mismatch for attribution prop
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {showZones && hotspots.map((hotspot, index) => (
              <Circle
                key={index}
                // @ts-ignore: Legacy Leaflet types vs React Leaflet props
                center={[hotspot.lat, hotspot.lng]}
                pathOptions={{ fillColor: getZoneColor(hotspot.aqi), color: getZoneColor(hotspot.aqi) }}
                radius={hotspot.radius}
                stroke={false}
                fillOpacity={0.4}
              >
                  <Popup>
                    <div className="text-slate-900 font-semibold">
                      Prediction Zone {index + 1}<br/>
                      <span style={{ color: getZoneColor(hotspot.aqi) }}>
                        AQI: {hotspot.aqi} ({getZoneLabel(hotspot.aqi)})
                      </span>
                    </div>
                  </Popup>
              </Circle>
            ))}
            <Marker position={position}>
                <Popup>
                    <div className="text-slate-900 font-semibold p-1">
                        <strong className="block text-indigo-600 mb-1">{locationName || "MIT ADT Campus"}</strong>
                        AQI: {hotspots[0]?.aqi || 87} (Moderate)<br/>
                        <span className="text-xs text-slate-500">Updated: Just now</span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
        <div className="absolute top-4 left-4 z-[400] bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-slate-700 shadow-lg pointer-events-none">
            Monitoring: {locationName || "MIT ADT Campus"}
        </div>
        
        <button 
          onClick={() => setShowZones(!showZones)}
          className={`absolute top-4 right-4 z-[400] backdrop-blur-md px-3 py-2 rounded-lg text-xs font-semibold border shadow-lg transition-colors flex items-center gap-2 ${
            showZones 
              ? 'bg-indigo-600/90 text-white border-indigo-500' 
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
          }`}
        >
          <Layers className="w-4 h-4" />
          {showZones ? 'Hide AI Zones' : 'Show AI Zones'}
        </button>
    </GlassCard>
  );
};



export default PollutionMap;
