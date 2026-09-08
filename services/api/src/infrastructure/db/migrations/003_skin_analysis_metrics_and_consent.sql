-- Migration 003: Skin Analysis Metrics JSONB, Consent & Risk Fields
ALTER TABLE skin_schema.skin_analyses
  ADD COLUMN IF NOT EXISTS grade VARCHAR(50) DEFAULT 'Optimal',
  ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS consent_version VARCHAR(50) DEFAULT 'v1.0',
  ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50) DEFAULT 'LOW';
