/*
  # Update loans and mileage tracking schema

  1. New Tables
    - `loans`
      - Basic loan information (id, user_id, name, type, etc.)
      - Financial details (principal, interest_rate, term_months, etc.)
      - Leasing-specific fields (residual_value, mileage_limit)
    - `mileage_updates`
      - Track mileage updates for leased vehicles
      - Store historical mileage data

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
    - Restrict access to user's own data

  3. Features
    - Automatic updated_at timestamp updates
    - Data validation through CHECK constraints
    - Cascading deletes for mileage updates
*/

-- Create loans table
CREATE TABLE loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('loan', 'lease')),
  principal numeric NOT NULL CHECK (principal > 0),
  interest_rate numeric NOT NULL CHECK (interest_rate >= 0),
  term_months integer NOT NULL CHECK (term_months > 0),
  start_date date NOT NULL,
  regular_payment numeric NOT NULL CHECK (regular_payment > 0),
  payment_frequency text NOT NULL CHECK (payment_frequency IN ('monthly', 'biweekly')),
  residual_value numeric CHECK (residual_value > 0),
  mileage_limit integer CHECK (mileage_limit > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mileage_updates table for tracking lease mileage
CREATE TABLE mileage_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans ON DELETE CASCADE NOT NULL,
  mileage integer NOT NULL CHECK (mileage >= 0),
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE mileage_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for loans
CREATE POLICY "Users can view their own loans"
  ON loans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own loans"
  ON loans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loans"
  ON loans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own loans"
  ON loans
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for mileage_updates
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

-- Create function to update loan's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();