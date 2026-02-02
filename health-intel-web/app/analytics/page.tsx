"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar"; // Import the sidebar
import { Loader2, TrendingUp, AlertTriangle, BedDouble } from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stateStats, setStateStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/api/v1/hospitals");
        const json = await res.json();
        const hospitals = json.data.hospitals || json.data || [];

        // --- Logic: Group by State ---
        const statsMap: Record<string, any> = {};

        hospitals.forEach((h: any) => {
          const state = h.state || "Unknown";
          if (!statsMap[state]) {
            statsMap[state] = { name: state, facilities: 0, beds: 0, occupied: 0, critical: 0 };
          }
          
          statsMap[state].facilities += 1;
          statsMap[state].beds += (h.total_beds || 0);
          statsMap[state].occupied += (h.occupied_beds || 0);
          
          // Check critical status
          const occupancy = h.total_beds ? (h.occupied_beds / h.total_beds) : 0;
          if (occupancy >= 0.8) statsMap[state].critical += 1;
        });

        // Convert to array and sort by critical count (descending)
        setStateStats(Object.values(statsMap).sort((a: any, b: any) => b.critical - a.critical));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <AdminSidebar /> {/* The Navigation Rail */}
      
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-blue-600" /> National Analytics
        </h1>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="animate-spin text-slate-400 h-8 w-8"/></div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">State</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Facilities</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Capacity (Beds)</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Avg. Occupancy</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-red-600">Critical Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stateStats.map((stat) => {
                   const occupancyPct = stat.beds ? Math.round((stat.occupied / stat.beds) * 100) : 0;
                   return (
                    <tr key={stat.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-800">{stat.name}</td>
                      <td className="p-4 text-slate-600">{stat.facilities}</td>
                      <td className="p-4 text-slate-600 flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-slate-400"/> {stat.beds.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${occupancyPct > 80 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${occupancyPct}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500">{occupancyPct}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {stat.critical > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">
                            <AlertTriangle className="h-3 w-3" /> {stat.critical} Hospitals
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">Normal</span>
                        )}
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}