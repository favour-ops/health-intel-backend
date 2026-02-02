"use client";

import React, { useState } from "react";
import { X, Building2, MapPin, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface CreateHospitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateHospitalModal({ isOpen, onClose, onSuccess }: CreateHospitalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    hospital_type: "PUBLIC",
    state: "Lagos", // Default
    city: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createHospital(formData);
      onSuccess(); // Refresh the list
      onClose();   // Close modal
      
      // Reset form
      setFormData({ name: "", hospital_type: "PUBLIC", state: "Lagos", city: "" });
    } catch (err: any) {
      setError(err.message || "Failed to create hospital");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Register New Facility
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Facility Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Federal Medical Centre"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Type Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Facility Type</label>
            <div className="grid grid-cols-2 gap-3">
              {["PUBLIC", "PRIVATE"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, hospital_type: type})}
                  className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                    formData.hospital_type === type
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              >
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Rivers">Rivers</option>
                <option value="Kano">Kano</option>
                {/* Add more states as needed */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Ikeja"
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Registering..." : "Register Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}