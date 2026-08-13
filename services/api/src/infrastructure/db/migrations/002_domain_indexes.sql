-- Migration 002: Add B-Tree & Partial Indexes across Domain Schemas
CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_schema.users (email);
CREATE INDEX IF NOT EXISTS idx_skin_analyses_user ON skin_schema.skin_analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointment_schema.appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointment_schema.appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON payment_schema.orders (user_id);
