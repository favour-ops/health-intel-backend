"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const publicIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const privateIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- NEW: Helper for Traffic Light Colors ---
const getCapacityColor = (beds: number) => {
  if (beds === 0) return "bg-red-100 text-red-700 border-red-200";
  if (beds < 20) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};
// --------------------------------------------

export default function Map({ hospitals }: { hospitals: any[] }) {
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
        const lat = hospital.latitude || hospital.lat;
        const lng = hospital.longitude || hospital.lng;
        const type = (hospital.hospital_type || hospital.type || "PUBLIC").toUpperCase();

        if (!lat || !lng) return null;

        return (
          <Marker 
            key={hospital.id} 
            position={[lat, lng]} 
            icon={type === "PUBLIC" ? publicIcon : privateIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-slate-800">{hospital.name}</h3>
                <p className="text-xs text-slate-500">{hospital.city}, {hospital.state}</p>
                
                <div className="flex gap-2 mt-2">
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    type === "PUBLIC" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {type}
                  </div>
                  
                  {/* --- NEW: Visual Health Indicator --- */}
                  {hospital.total_beds !== null && (
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getCapacityColor(hospital.total_beds || 0)}`}>
                      {hospital.total_beds} Beds
                    </div>
                  )}
                  {/* ------------------------------------ */}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}