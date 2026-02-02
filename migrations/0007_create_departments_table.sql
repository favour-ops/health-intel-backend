-- Add migration script here
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    department_type VARCHAR(50) NOT NULL CHECK (department_type IN ('MEDICAL', 'ADMIN', 'SUPPORT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(hospital_id, name)
);

CREATE INDEX idx_departments_hospital_id ON departments(hospital_id);