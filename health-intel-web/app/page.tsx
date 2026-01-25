"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Plus, Building2, Loader2 } from "lucide-react";

// Load Map Dynamically to avoid "window is not defined"
const Map = dynamic(() => import("../components/Map"), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-slate-400">
      <p>Loading Map...</p>
    </div>
  )
});

export default function Dashboard() {
  // We initialize with an empty array because we are waiting for Real Data
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH DATA FROM RUST BACKEND
  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/v1/hospitals");
        const json = await res.json();
        
        if (json.data && json.data.hospitals) {
            setHospitals(json.data.hospitals);
        }
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHospitals();
  }, []);

  // Filter Logic
  const filteredHospitals = hospitals.filter((hospital) => {
    // Handle case where backend might return 'hospital_type' (DB column) or 'type'
    const type = hospital.hospital_type || hospital.type; 
    const matchesFilter = filter === "ALL" || type === filter;
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      {/* SIDEBAR */}
      <aside className="w-96 flex flex-col border-r border-slate-200 bg-white h-full shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-emerald-600" />
            Health Intel
          </h1>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search hospitals..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 mt-4">
            {["ALL", "PUBLIC", "PRIVATE"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  filter === type 
                    ? "bg-emerald-600 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* List Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600"/></div>
          ) : (
            filteredHospitals.map((hospital) => (
              <div 
                key={hospital.id} 
                className="group p-4 rounded-xl border border-slate-100 bg-white hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 truncate w-4/5">
                    {hospital.name}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${
                    (hospital.hospital_type || hospital.type) === "PUBLIC" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {(hospital.hospital_type || hospital.type) === "PUBLIC" ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-500 mt-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  {hospital.city}, {hospital.state}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* MAP AREA */}
      <main className="flex-1 relative bg-slate-100">
        <Map hospitals={filteredHospitals} />
        
        <button className="absolute bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 z-[1000]">
          <Plus className="h-6 w-6" />
          <span className="font-medium pr-1">Add Hospital</span>
        </button>
      </main>
    </div>
  );
}