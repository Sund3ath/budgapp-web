/*
  # Update loans and mileage tracking schema

  This migration safely updates the schema by:
  1. Adding missing columns if they don't exist
  2. Updating constraints and policies
  3. Ensuring backward compatibility

  Changes:
  - Adds mileage tracking capabilities
  - Updates RLS policies
  - Adds updated_at trigger
*/

-- Add new columns to loans table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loans' AND column_name = 'residual_value'
  ) THEN
    ALTER TABLE loans ADD COLUMN residual_value numeric CHECK (residual_value > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loans' AND column_name = 'mileage_limit'
  ) THEN
    ALTER TABLE loans ADD COLUMN mileage_limit integer CHECK (mileage_limit > 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loans' AND column_name = 'type'
  ) THEN
    ALTER TABLE loans ADD COLUMN type text NOT NULL DEFAULT 'loan' CHECK (type IN ('loan', 'lease'));
  END IF;
END $$;

-- Create mileage_updates table if it doesn't exist
CREATE TABLE IF NOT EXISTS mileage_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans ON DELETE CASCADE NOT NULL,
  mileage integer NOT NULL CHECK (mileage >= 0),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on mileage_updates if not already enabled
ALTER TABLE IF EXISTS mileage_updates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Mileage updates policies
  DROP POLICY IF EXISTS "Users can view mileage updates for their loans" ON mileage_updates;
  DROP POLICY IF EXISTS "Users can create mileage updates for their loans" ON mileage_updates;
  DROP POLICY IF EXISTS "Users can delete mileage updates for their loans" ON mileage_updates;

  CREATE POLICY "Users can view mileage updates for their loans"
    ON mileage_updates
    FOR SELECT
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = mileage_updates.loan_id
      AND loans.user_id = auth.uid()
    ));

  CREATE POLICY "Users can create mileage updates for their loans"
    ON mileage_updates
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = mileage_updates.loan_id
      AND loans.user_id = auth.uid()
    ));

  CREATE POLICY "Users can delete mileage updates for their loans"
    ON mileage_updates
    FOR DELETE
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = mileage_updates.loan_id
      AND loans.user_id = auth.uid()
    ));
END $$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_loans_updated_at'
  ) THEN
    CREATE TRIGGER update_loans_updated_at
      BEFORE UPDATE ON loans
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;