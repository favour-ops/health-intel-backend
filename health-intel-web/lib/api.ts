// lib/api.ts

const API_BASE_URL = "http://127.0.0.1:3000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  // 1. Get Token (Browser side)
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("health_token") || "";
  }

  // 2. Prepare Headers
  // FIX: Explicitly type as Record<string, string> so we can add "Authorization"
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 3. Execute Request
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  // 4. Handle Auth Failures
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login"; // Kick them out if token expires
    }
    throw new Error(json.meta?.message || "An error occurred");
  }

  return json.data;
}

export const api = {
  // --- AUTH ---
  login: (data: any) => fetchAPI<any>("/login", { method: "POST", body: JSON.stringify(data) }),

  // --- HOSPITALS (GOVERNMENT VIEW) ---
  getHospitals: () => fetchAPI<{ hospitals: any[] }>("/hospitals"),
  createHospital: (data: any) => fetchAPI("/hospitals", { method: "POST", body: JSON.stringify(data) }),
  updateHospital: (id: string, data: any) => fetchAPI(`/hospitals/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // --- HOSPITAL DETAIL VIEW ---
  getHospital: (id: string) => fetchAPI<{ hospital: any }>(`/hospitals/${id}`),
  getHospitalDepartments: (id: string) => fetchAPI<any[]>(`/hospitals/${id}/departments`),
  getHospitalStaff: (id: string) => fetchAPI<any[]>(`/staff?hospital_id=${id}`),
  
  // --- DEPARTMENTS ---
  createDepartment: (data: any) => fetchAPI("/departments", { method: "POST", body: JSON.stringify(data) }),
  
  // --- STAFF ---
  createStaff: (data: any) => fetchAPI("/staff", { method: "POST", body: JSON.stringify(data) }),
  
  // --- PATIENTS ---
  createPatient: (data: any) => fetchAPI("/patients", { method: "POST", body: JSON.stringify(data) }),

  // --- VISITS ---
  createVisit: (data: any) => fetchAPI("/visits", { method: "POST", body: JSON.stringify(data) }),
};