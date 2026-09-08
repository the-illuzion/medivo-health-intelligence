-- Migration 004: Audit Logs Metadata JSONB Column & User Event Indexes
ALTER TABLE analytics_schema.audit_logs
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON analytics_schema.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON analytics_schema.audit_logs (event_type);
