"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, MapPin, Activity, Ambulance, Save, Loader2, Search, Users, Wind, Fan } from "lucide-react";

interface AddHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hospitalToEdit?: any;
}

const NIGERIAN_STATES = [
  "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", "Bauchi State", 
  "Bayelsa State", "Benue State", "Borno State", "Cross River State", "Delta State", 
  "Ebonyi State", "Edo State", "Ekiti State", "Enugu State", "FCT", "Gombe State", 
  "Imo State", "Jigawa State", "Kaduna State", "Kano State", "Katsina State", 
  "Kebbi State", "Kogi State", "Kwara State", "Lagos State", "Nasarawa State", 
  "Niger State", "Ogun State", "Ondo State", "Osun State", "Oyo State", 
  "Plateau State", "Rivers State", "Sokoto State", "Taraba State", 
  "Yobe State", "Zamfara State"
].sort();

export default function AddHospitalModal({ isOpen, onClose, onSuccess, hospitalToEdit }: AddHospitalModalProps) {
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    hospital_type: "PUBLIC",
    state: "",
    city: "",
    latitude: "",
    longitude: "",
    total_beds: "",
    occupied_beds: "",
    has_emergency: false,
    // --- NEW RESOURCES ---
    has_oxygen: false,
    has_ventilators: false,
    has_ambulance: false,
  });

  useEffect(() => {
    if (hospitalToEdit) {
      setFormData({
        name: hospitalToEdit.name || "",
        hospital_type: (hospitalToEdit.hospital_type || hospitalToEdit.type || "PUBLIC").toUpperCase(),
        state: hospitalToEdit.state || "",
        city: hospitalToEdit.city || "",
        latitude: hospitalToEdit.latitude ? hospitalToEdit.latitude.toString() : "",
        longitude: hospitalToEdit.longitude ? hospitalToEdit.longitude.toString() : "",
        total_beds: hospitalToEdit.total_beds ? hospitalToEdit.total_beds.toString() : "",
        occupied_beds: hospitalToEdit.occupied_beds ? hospitalToEdit.occupied_beds.toString() : "0",
        has_emergency: hospitalToEdit.has_emergency || false,
        // Load new booleans
        has_oxygen: hospitalToEdit.has_oxygen || false,
        has_ventilators: hospitalToEdit.has_ventilators || false,
        has_ambulance: hospitalToEdit.has_ambulance || false,
      });
    } else {
      setFormData({
        name: "", hospital_type: "PUBLIC", state: "", city: "",
        latitude: "", longitude: "", total_beds: "", occupied_beds: "", has_emergency: false,
        has_oxygen: false, has_ventilators: false, has_ambulance: false
      });
    }
  }, [hospitalToEdit, isOpen]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generic Toggle Handler
  const handleToggle = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
  };

  const handleAutoGeocode = async () => {
    if (!formData.city || !formData.state) {
      setError("Please select a State and enter a City first.");
      return;
    }
    setGeocoding(true);
    setError("");
    try {
      const query = `${formData.city}, ${formData.state}, Nigeria`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();

      if (data && data.length > 0) {
        const location = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(location.lat).toFixed(6),
          longitude: parseFloat(location.lon).toFixed(6)
        }));
      } else {
        setError(`Could not find coordinates for "${formData.city}".`);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to map service.");
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      total_beds: formData.total_beds ? parseInt(formData.total_beds) : 0,
      occupied_beds: formData.occupied_beds ? parseInt(formData.occupied_beds) : 0,
    };

    try {
      const url = hospitalToEdit 
        ? `http://127.0.0.1:3000/api/v1/hospitals/${hospitalToEdit.id}`
        : "http://127.0.0.1:3000/api/v1/hospitals";
        
      const method = hospitalToEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save hospital");

      onSuccess(); 
      onClose();
    } catch (err) {
      setError("Failed to connect to server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {hospitalToEdit ? "Edit Facility" : "Register Facility"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Core Info */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">Hospital Name <span className="text-red-500">*</span></label>
            <input
              required
              name="name"
              placeholder="e.g. Lagos City General Hospital"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            
            <div className="flex gap-4 pt-1">
              {["PUBLIC", "PRIVATE"].map((type) => (
                <label key={type} className={`flex-1 cursor-pointer border rounded-lg p-3 flex items-center justify-center gap-2 transition-all ${
                  formData.hospital_type === type 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium ring-1 ring-emerald-500" 
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}>
                  <input
                    type="radio"
                    name="hospital_type"
                    value={type}
                    checked={formData.hospital_type === type}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {type === "PUBLIC" ? <Building2 className="h-4 w-4"/> : <Activity className="h-4 w-4"/>}
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">State <span className="text-red-500">*</span></label>
              <select 
                name="state" 
                required
                value={formData.state} 
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Select State</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">City <span className="text-red-500">*</span></label>
              <input
                required
                name="city"
                placeholder="e.g. Ikeja"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Coordinates
              </label>
              <button 
                type="button" 
                onClick={handleAutoGeocode}
                disabled={geocoding || !formData.city}
                className="text-xs flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {geocoding ? <Loader2 className="h-3 w-3 animate-spin"/> : <Search className="h-3 w-3"/>}
                Auto-Detect Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>
              <div>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Occupancy Section */}
          <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Users className="h-3 w-3" /> Real-Time Capacity
            </h3>
            
            <div className="flex gap-4">
               <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Capacity</label>
                <input
                  name="total_beds"
                  type="number"
                  placeholder="e.g. 150"
                  value={formData.total_beds}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1 text-blue-600 flex items-center gap-1">
                  <Users className="h-3 w-3"/> Occupied
                </label>
                <input
                  name="occupied_beds"
                  type="number"
                  placeholder="0"
                  value={formData.occupied_beds}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg border border-blue-200 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* --- NEW: Life-Saving Resources Section --- */}
          <div className="space-y-3">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Life-Saving Resources</h3>
             <div className="grid grid-cols-2 gap-3">
                {/* Oxygen */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.has_oxygen ? "bg-cyan-50 border-cyan-200 ring-1 ring-cyan-200" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}>
                  <input type="checkbox" className="w-4 h-4 accent-cyan-600" checked={formData.has_oxygen} onChange={handleToggle("has_oxygen")} />
                  <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Wind className="h-3 w-3 text-cyan-600"/> Oxygen</span>
                     <span className="text-[10px] text-slate-400">Available</span>
                  </div>
                </label>

                {/* Ventilators */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.has_ventilators ? "bg-purple-50 border-purple-200 ring-1 ring-purple-200" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}>
                  <input type="checkbox" className="w-4 h-4 accent-purple-600" checked={formData.has_ventilators} onChange={handleToggle("has_ventilators")} />
                  <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Fan className="h-3 w-3 text-purple-600"/> Ventilators</span>
                     <span className="text-[10px] text-slate-400">Functional</span>
                  </div>
                </label>

                {/* Ambulance */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.has_ambulance ? "bg-orange-50 border-orange-200 ring-1 ring-orange-200" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}>
                  <input type="checkbox" className="w-4 h-4 accent-orange-600" checked={formData.has_ambulance} onChange={handleToggle("has_ambulance")} />
                  <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Ambulance className="h-3 w-3 text-orange-600"/> Ambulance</span>
                     <span className="text-[10px] text-slate-400">Ready</span>
                  </div>
                </label>

                {/* Emergency Unit */}
                <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.has_emergency ? "bg-red-50 border-red-200 ring-1 ring-red-200" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}>
                  <input type="checkbox" className="w-4 h-4 accent-red-600" checked={formData.has_emergency} onChange={handleToggle("has_emergency")} />
                  <div className="flex flex-col">
                     <span className="text-sm font-semibold text-slate-700 flex items-center gap-1"><Activity className="h-3 w-3 text-red-600"/> Emergency</span>
                     <span className="text-[10px] text-slate-400">24/7 Unit</span>
                  </div>
                </label>
             </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg flex items-center justify-center gap-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Save className="h-5 w-5" />}
              {hospitalToEdit ? "Update Facility" : "Save Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}