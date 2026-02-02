-- Add migration script here
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL, -- Nullable (might be in storage)
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100),
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('NEW', 'GOOD', 'FAIR', 'POOR', 'BROKEN')),
    is_operational BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_equipment_hospital_id ON equipment(hospital_id);
CREATE INDEX idx_equipment_department_id ON equipment(department_id);
CREATE INDEX idx_equipment_condition ON equipment(condition);
CREATE INDEX idx_equipment_is_operational ON equipment(is_operational);
