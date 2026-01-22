CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    hospital_type TEXT NOT NULL CHECK (hospital_type IN ('PUBLIC', 'PRIVATE')),
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
