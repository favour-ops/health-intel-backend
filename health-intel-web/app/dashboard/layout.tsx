"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Landmark,           // Icon for Government
  Map,                // Icon for Overview
  Building2,          // Icon for Hospitals
  LogOut 
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // 1. Security Check
    const token = localStorage.getItem("health_token");
    const userInfo = localStorage.getItem("user_info");
    
    if (!token) {
      router.push("/login");
    } else if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserEmail(user.email);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("health_token");
    localStorage.removeItem("user_info");
    router.push("/login");
  };

  const navItems = [
    { label: "National Overview", icon: Map, href: "/dashboard" },
    { label: "Hospital Registry", icon: Building2, href: "/dashboard/hospitals" },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* --- THE EXTREME LEFT SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 z-50">
        
        {/* Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Landmark className="text-white h-6 w-6" />
          </div>
          <div>
            <span className="block font-bold text-lg tracking-tight leading-none">Health Intel</span>
            <span className="block text-[10px] text-emerald-400 font-mono mt-1">GOV. PORTAL</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Monitoring
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 font-bold border border-emerald-700 text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Super Admin</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-red-950/50 hover:text-red-300 px-4 py-2 rounded-lg transition-all text-sm border border-transparent hover:border-red-900/50"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA (No other sidebars here!) --- */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}