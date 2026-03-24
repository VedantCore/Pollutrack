import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
}

const PollutionMap: React.FC<PollutionMapProps> = ({ center = [18.5204, 73.8567], hotspots = [] }) => {
  const position: [number, number] = center; // Use prop or default to Pune
  
  return (
    <GlassCard className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 h-[400px] p-0 overflow-hidden relative border-0">
        {/* @ts-ignore: React Leaflet types mismatch for center prop */}
        <MapContainer center={position} zoom={13} style={mapContainerStyle} scrollWheelZoom={false} className="z-0">
            <TileLayer
                // @ts-ignore: React Leaflet types mismatch for attribution prop
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {hotspots.map((hotspot, index) => (
              <Circle
                key={index}
                // @ts-ignore: Legacy Leaflet types vs React Leaflet props
                center={[hotspot.lat, hotspot.lng]}
                pathOptions={{ fillColor: 'red', color: 'red' }}
                radius={hotspot.radius}
                stroke={false}
              >
                  <Popup>
                    <div className="text-slate-900 font-semibold">
                      Hotspot Zone {index + 1}<br/>
                      AQI: {hotspot.aqi}
                    </div>
                  </Popup>
              </Circle>
            ))}
            <Marker position={position}>
                <Popup>
                    <div className="text-slate-900 font-semibold p-1">
                        <strong className="block text-indigo-600 mb-1">MIT ADT Campus</strong>
                        AQI: 87 (Moderate)<br/>
                        <span className="text-xs text-slate-500">Updated: Just now</span>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
        <div className="absolute top-4 left-4 z-[400] bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-slate-700 shadow-lg pointer-events-none">
            Live Monitoring Map
        </div>
    </GlassCard>
  );
};



export default PollutionMap;
