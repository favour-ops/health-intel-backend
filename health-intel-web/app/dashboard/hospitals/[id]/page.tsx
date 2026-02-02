"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Hospital, Department, Staff } from "@/types";
import { 
  Building2, MapPin, Users, Stethoscope, 
  Activity, AlertCircle 
} from "lucide-react";

export default function HospitalDetailPage() {
  const params = useParams();
  const hospitalId = params.id as string;

  // State for Real Data
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!hospitalId) return;

    // Fetch ALL data in parallel (Real endpoints)
    const fetchData = async () => {
      try {
        const [hospRes, deptRes, staffRes] = await Promise.all([
          api.getHospital(hospitalId),
          api.getHospitalDepartments(hospitalId),
          api.getHospitalStaff(hospitalId)
        ]);

        setHospital(hospRes.hospital);
        setDepartments(deptRes || []);
        setStaff(staffRes || []);
      } catch (err) {
        console.error("Failed to load hospital data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hospitalId]);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading facility data...</div>;
  if (!hospital) return <div className="p-12 text-center text-red-500">Hospital not found</div>;

  return (
    <div className="space-y-6">
      {/* 1. Hospital Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{hospital.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {hospital.city}, {hospital.state}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                  hospital.hospital_type === 'PUBLIC' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'
                }`}>
                  {hospital.hospital_type}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
             <div className="text-sm text-slate-500">Facility ID</div>
             <div className="font-mono text-xs text-slate-400">{hospital.id}</div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-6">
        {["overview", "departments", "staff", "patients"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab 
                ? "text-emerald-600 border-b-2 border-emerald-600" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Tab Content Areas */}
      
      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={Stethoscope} label="Medical Staff" value={staff.length} color="blue" />
          <StatCard icon={Activity} label="Departments" value={departments.length} color="purple" />
          <StatCard icon={Users} label="Total Patients" value="-" color="amber" />
        </div>
      )}

      {/* DEPARTMENTS TAB */}
      {activeTab === "departments" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Department Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.length === 0 ? (
                <tr><td colSpan={3} className="p-6 text-center text-slate-500">No departments found.</td></tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{dept.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{dept.department_type}</span>
                    </td>
                    <td className="px-6 py-4 text-emerald-600 text-xs font-medium">Operational</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* STAFF TAB */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-slate-500">No staff registered.</td></tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.role === 'DOCTOR' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PATIENTS TAB (Placeholder for now) */}
      {activeTab === "patients" && (
        <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
           <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
           <p className="text-slate-500">Patient records access restricted in Government Overview.</p>
        </div>
      )}

    </div>
  );
}

// Helper Component for Stats Cards
function StatCard({ icon: Icon, label, value, color }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };
  
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}