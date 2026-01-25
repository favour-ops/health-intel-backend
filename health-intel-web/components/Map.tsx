"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default icon issue in React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function Map({ hospitals }: { hospitals: any[] }) {
  // Default center: Abuja, Nigeria
  const defaultCenter: [number, number] = [9.0765, 7.3986];

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={6} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {hospitals.map((hospital) => {
        // FIX: Check for 'latitude' OR 'lat' (handling both Real DB and old Mock data)
        const lat = hospital.latitude || hospital.lat;
        const lng = hospital.longitude || hospital.lng;

        // Only render if valid coordinates exist
        if (!lat || !lng) return null;

        return (
          <Marker 
            key={hospital.id} 
            position={[lat, lng]} 
            icon={icon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-800">{hospital.name}</h3>
                <p className="text-xs text-slate-500">{hospital.city}, {hospital.state}</p>
                <div className={`mt-2 text-xs font-bold inline-block px-2 py-0.5 rounded ${
                  (hospital.hospital_type || hospital.type) === "PUBLIC" 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-purple-100 text-purple-700"
                }`}>
                  {hospital.hospital_type || hospital.type}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}