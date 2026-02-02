"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:3000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.meta?.message || "Login failed");
      }

      // ✅ SUCCESS: Save the VIP Badge (Token)
      localStorage.setItem("health_token", json.data.token);
      localStorage.setItem("user_info", JSON.stringify(json.data.user));

      // Redirect to Dashboard
      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-100 rounded-2xl mb-4">
            <Activity className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Health Intel Admin</h1>
          <p className="text-slate-500 mt-2 text-sm">Secure access for Ministry Officials</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                name="email"
                type="email" 
                placeholder="admin@health.gov.ng"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                name="password"
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Access Dashboard <ArrowRight className="h-5 w-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">Restricted System • Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Activity, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setLoading(false);
//       router.push("/dashboard");
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-100">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex p-3 bg-emerald-100 rounded-2xl mb-4">
//             <Activity className="h-8 w-8 text-emerald-600" />
//           </div>
//           <h1 className="text-2xl font-bold text-slate-900">Health Intel Admin</h1>
//           <p className="text-slate-500 mt-2 text-sm">Secure access for Ministry Officials</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
//               <input 
//                 type="email" 
//                 placeholder="admin@health.gov.ng"
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Password</label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
//               <input 
//                 type="password" 
//                 placeholder="••••••••"
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
//                 required
//               />
//             </div>
//           </div>

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-95 mt-6"
//           >
//             {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Access Dashboard <ArrowRight className="h-5 w-5" /></>}
//           </button>
//         </form>

//         <div className="mt-8 text-center">
//           <p className="text-xs text-slate-400">Restricted System • Authorized Personnel Only</p>
//         </div>
//       </div>
//     </div>
//   );
// }