-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id                      uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email                   text NOT NULL,
  status                  text NOT NULL DEFAULT 'started'
                            CHECK (status IN ('started', 'completed')),
  current_section         integer NOT NULL DEFAULT 0,
  answers                 jsonb NOT NULL DEFAULT '{}',
  valuation_low           numeric,
  valuation_high          numeric,
  ebitda_multiple_low     numeric,
  ebitda_multiple_high    numeric,
  abandoned_email_count   integer NOT NULL DEFAULT 0,
  last_abandoned_email_at timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  completed_at            timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_evaluations_email  ON evaluations (email);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON evaluations (status);
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations (created_at DESC);

-- Enable Row Level Security
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- RLS policies: allow anonymous/authenticated access for the survey flow
CREATE POLICY "Allow inserts"
  ON evaluations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow select by id"
  ON evaluations FOR SELECT
  USING (true);

CREATE POLICY "Allow updates"
  ON evaluations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Verify
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'evaluations'
ORDER BY ordinal_position;
