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

-- Create newsletter_subscriptions table
CREATE TABLE newsletter_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  interests TEXT[], -- Array of interests
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_created_at ON newsletter_subscriptions(created_at DESC);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active);