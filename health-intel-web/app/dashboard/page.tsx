"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Plus, Building2, Loader2, MapPin, Trash2, Pencil, Users, Wind, Fan, Ambulance, Activity, AlertTriangle } from "lucide-react";
import AddHospitalModal from "../../components/AddHospitalModal"; // Adjusted path
import AdminSidebar from "../../components/AdminSidebar"; // NEW: Import the Master Sidebar

// Load Map Dynamically
const Map = dynamic(() => import("../../components/Map"), { // Adjusted path
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-slate-400"><p>Loading Map...</p></div>
});

const getOccupancyColor = (percentage: number) => {
  if (percentage >= 80) return "bg-red-500";
  if (percentage >= 50) return "bg-orange-500";
  return "bg-emerald-500";
};

export default function Dashboard() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState<any>(null);

  // Analytics State
  const [stats, setStats] = useState({ total: 0, beds: 0, critical: 0 });

  const fetchHospitals = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/v1/hospitals");
      const json = await res.json();
      if (json.data) {
          const list = Array.isArray(json.data) ? json.data : json.data.hospitals;
          setHospitals(list || []);
          
          // Calculate Stats
          let totalBeds = 0;
          let criticalCount = 0;
          
          list.forEach((h: any) => {
            totalBeds += (h.total_beds || 0);
            const pct = h.total_beds ? (h.occupied_beds / h.total_beds) : 0;
            if (pct >= 0.8) criticalCount++;
          });
          
          setStats({
            total: list.length,
            beds: totalBeds,
            critical: criticalCount
          });
      }
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHospitals(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); 
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/v1/hospitals/${id}`, { method: "DELETE" });
      if (res.ok) fetchHospitals(); 
    } catch (err) { alert("Error connecting to server."); }
  };

  const handleEdit = (e: React.MouseEvent, hospital: any) => {
    e.stopPropagation(); 
    setEditingHospital(hospital); 
    setIsModalOpen(true); 
  };

  const handleAdd = () => {
    setEditingHospital(null); 
    setIsModalOpen(true);
  };

  const filteredHospitals = hospitals.filter((hospital) => {
    const type = (hospital.hospital_type || hospital.type || "PUBLIC").toUpperCase(); 
    const matchesFilter = filter === "ALL" || type === filter;
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. NEW MASTER SIDEBAR */}
      <AdminSidebar />

      {/* 2. WRAPPER FOR EXISTING DASHBOARD CONTENT */}
      <div className="flex flex-1 h-screen overflow-hidden">
        
        {/* EXISTING: Hospital List Sidebar */}
        <aside className="w-96 flex flex-col border-r border-slate-200 bg-white h-full shadow-sm z-10">
          
          {/* Header Section */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Building2 className="text-emerald-600" />
              Health Intel
            </h1>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-center">
                <div className="text-xs text-slate-500 font-semibold uppercase">Facilities</div>
                <div className="text-lg font-bold text-slate-800">{stats.total}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm text-center">
                <div className="text-xs text-slate-500 font-semibold uppercase">Nat. Beds</div>
                <div className="text-lg font-bold text-blue-600">{stats.beds.toLocaleString()}</div>
              </div>
              <div className={`p-2 rounded-lg border shadow-sm text-center ${stats.critical > 0 ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
                <div className="text-xs text-slate-500 font-semibold uppercase flex justify-center items-center gap-1">
                  {stats.critical > 0 && <AlertTriangle className="h-3 w-3 text-red-500"/>} Critical
                </div>
                <div className={`text-lg font-bold ${stats.critical > 0 ? "text-red-600" : "text-slate-800"}`}>
                  {stats.critical}
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search hospitals..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              {["ALL", "PUBLIC", "PRIVATE"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                    filter === type 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md" 
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-600"/></div>
            ) : (
              filteredHospitals.map((hospital) => {
                const occupied = hospital.occupied_beds || 0;
                const total = hospital.total_beds || 1; 
                const percentage = Math.min((occupied / total) * 100, 100);
                
                return (
                  <div 
                    key={hospital.id} 
                    className="group p-4 rounded-xl border border-slate-100 bg-white hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 truncate w-3/5">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide mr-1 ${
                            (hospital.hospital_type || hospital.type) === "PUBLIC" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                            {(hospital.hospital_type || hospital.type) === "PUBLIC" ? "PUB" : "PVT"}
                        </span>
                        <button onClick={(e) => handleEdit(e, hospital)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100">
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={(e) => handleDelete(e, hospital.id, hospital.name)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100">
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-slate-500 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {hospital.city}, {hospital.state}
                    </div>

                    {/* Occupancy Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {occupied} / {hospital.total_beds} Occupied</span>
                        <span className={percentage >= 80 ? "text-red-600 font-bold" : ""}>{percentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${getOccupancyColor(percentage)}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>

                    {/* Resource Badges */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {hospital.has_oxygen && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-semibold border border-cyan-100">
                          <Wind className="h-3 w-3" /> Oxygen
                        </span>
                      )}
                      {hospital.has_ventilators && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-100">
                          <Fan className="h-3 w-3" /> Ventilators
                        </span>
                      )}
                      {hospital.has_ambulance && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-[10px] font-semibold border border-orange-100">
                          <Ambulance className="h-3 w-3" /> Ambulance
                        </span>
                      )}
                      {hospital.has_emergency && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-[10px] font-semibold border border-red-100">
                          <Activity className="h-3 w-3" /> Emergency
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* EXISTING: Map Area */}
        <main className="flex-1 relative bg-slate-100">
          <Map hospitals={filteredHospitals} />
          <button onClick={handleAdd} className="absolute bottom-8 right-8 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 z-[1000]">
            <Plus className="h-6 w-6" /> <span className="font-medium pr-1">Add Hospital</span>
          </button>
          <AddHospitalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchHospitals} hospitalToEdit={editingHospital} />
        </main>
      </div>
    </div>
  );
}