-- Create contacts table for storing contact form submissions
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_email ON contacts(email);