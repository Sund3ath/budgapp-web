/*
  # Add current_mileage column to loans table

  1. Changes
    - Add current_mileage column to loans table
    - Add check constraint to ensure current_mileage is non-negative
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'loans' AND column_name = 'current_mileage'
  ) THEN
    ALTER TABLE loans ADD COLUMN current_mileage integer CHECK (current_mileage >= 0);
  END IF;
END $$;