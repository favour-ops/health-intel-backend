"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api"; 
import { Hospital } from "@/types"; 
import AddHospitalModal from "@/components/AddHospitalModal"; // Ensure this matches your file name
import { 
  Building2, MapPin, Plus, Search, 
  ArrowRight, Loader2, RefreshCw 
} from "lucide-react";

export default function HospitalRegistryPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. LOAD DATA (Runs once when page loads)
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Helper function to fetch data
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await api.getHospitals();
      setHospitals(data.hospitals || []);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Failed to load hospitals. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital Registry</h1>
          <p className="text-sm text-slate-500">
            Manage and monitor accredited healthcare facilities.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Manual Refresh Button (Optional but helpful) */}
          <button 
            onClick={fetchHospitals}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Register New Facility
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, state, or ID..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          />
        </div>
        <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white">
          <option>All Types</option>
          <option>Public</option>
          <option>Private</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        {loading && hospitals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Loading registry...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <p>{error}</p>
            <button onClick={fetchHospitals} className="mt-2 text-sm underline hover:text-red-600">Try Again</button>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Building2 className="h-12 w-12 text-slate-300 mb-3" />
            <p>No hospitals registered yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Facility Name</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Type</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Location</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospitals.map((hospital) => (
                <tr key={hospital.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{hospital.name}</p>
                        <p className="text-xs text-slate-500 font-mono">ID: {hospital.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      hospital.hospital_type === 'PUBLIC' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {hospital.hospital_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {hospital.city}, {hospital.state}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      hospital.is_active 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${hospital.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {hospital.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/dashboard/hospitals/${hospital.id}`}
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-xs border border-emerald-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition-colors bg-emerald-50"
                    >
                      Manage
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Integration */}
      <AddHospitalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // 2. REFRESH DATA (Runs immediately after successful add)
          fetchHospitals(); 
        }}
      />
    </div>
  );
}