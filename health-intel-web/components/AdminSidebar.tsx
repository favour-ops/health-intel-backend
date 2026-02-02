"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings, LogOut, Activity } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Command Center", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="w-20 bg-slate-900 flex flex-col items-center py-6 h-screen sticky top-0 z-50">
      {/* Logo */}
      <div className="bg-emerald-500 p-2 rounded-xl mb-8">
        <Activity className="h-6 w-6 text-white" />
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-4 w-full px-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-emerald-600/20 text-emerald-400" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-[9px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <Link href="/login" className="mb-4 text-slate-500 hover:text-red-400 p-2 transition-colors">
        <LogOut className="h-6 w-6" />
      </Link>
    </div>
  );
}