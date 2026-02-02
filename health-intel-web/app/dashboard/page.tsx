"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api"; 
import { Hospital, Activity, Users, AlertTriangle } from "lucide-react";

// Load Map dynamically (prevents SSR errors)
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function DashboardPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getHospitals();
        setHospitals(data.hospitals || []);
      } catch (err) {
        console.error("Failed to fetch hospitals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* 1. Top Bar / Title */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">National Overview</h1>
          <p className="text-sm text-slate-500">Real-time monitoring of healthcare facilities across the nation.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
            System Operational
          </span>
        </div>
      </header>

      {/* 2. Stats Row */}
      <div className="p-8 pb-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Hospital className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Facilities</p>
            <p className="text-2xl font-bold text-slate-900">{loading ? "..." : hospitals.length}</p>
          </div>
        </div>

        {/* Stat Card 2 (Placeholder Data for now) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Active Patients</p>
            <p className="text-2xl font-bold text-slate-900">-</p>
          </div>
        </div>

        {/* Stat Card 3 (Placeholder) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Critical Alerts</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>
      </div>

      {/* 3. The Map (Takes remaining height) */}
      <div className="flex-1 p-8 min-h-[500px]">
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 relative">
          <Map hospitals={hospitals} />
          
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Activity className="h-8 w-8 text-emerald-600 animate-bounce" />
                <p className="text-sm font-medium text-slate-600">Connecting to secure network...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}