/*
  # Add loan editing functionality

  1. Changes
    - Add RLS policy for updating loans
*/

-- Add policy for updating loans if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'loans' 
    AND policyname = 'Users can update their own loans'
  ) THEN
    CREATE POLICY "Users can update their own loans"
      ON loans
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;