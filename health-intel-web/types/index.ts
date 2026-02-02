// types/index.ts

// --- GOVERNMENT LEVEL ENTITIES ---

export interface Hospital {
  id: string;
  name: string;
  hospital_type: "PUBLIC" | "PRIVATE";
  state: string;
  city: string;
  is_active: boolean;
  created_at: string;
}

// --- HOSPITAL LEVEL ENTITIES ---

export interface Department {
  id: string;
  hospital_id: string; // Links back to a facility
  name: string;
  department_type: "MEDICAL" | "ADMIN" | "SUPPORT";
}

export interface Staff {
  id: string;
  hospital_id: string;
  department_id: string;
  first_name: string;
  last_name: string;
  role: "DOCTOR" | "NURSE" | "ADMIN" | "SUPPORT";
  email: string;
  is_active: boolean;
}

export interface Patient {
  id: string;
  hospital_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
}

export interface Visit {
  id: string;
  hospital_id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  start_time: string;
  reason: string;
}

export interface Equipment {
  id: string;
  name: string;
  condition: "NEW" | "GOOD" | "FAIR" | "POOR" | "BROKEN";
  is_operational: boolean;
}

// --- GENERIC API RESPONSE ---
export interface ApiResponse<T> {
  status: string;
  data: T;
  meta: {
    message: string | null;
    count: number | null;
  };
}