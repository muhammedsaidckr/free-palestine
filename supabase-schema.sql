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

-- Create petition_signatures table
CREATE TABLE petition_signatures (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  city TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE petition_signatures ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_petition_email ON petition_signatures(email);
CREATE INDEX idx_petition_created_at ON petition_signatures(created_at DESC);
CREATE INDEX idx_petition_ip ON petition_signatures(ip_address);

-- Create statistics table for Gaza/Palestine situation data
CREATE TABLE palestine_statistics (
  id BIGSERIAL PRIMARY KEY,
  casualties INTEGER NOT NULL,
  injured INTEGER NOT NULL,
  displaced_percentage INTEGER NOT NULL DEFAULT 90,
  aid_packages INTEGER NOT NULL DEFAULT 45000,
  source_url TEXT,
  source_name TEXT DEFAULT 'Gaza Health Ministry',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE palestine_statistics ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_statistics_last_updated ON palestine_statistics(last_updated DESC);
CREATE INDEX idx_statistics_active ON palestine_statistics(is_active);
CREATE INDEX idx_statistics_created_at ON palestine_statistics(created_at DESC);

-- Insert initial data (based on current static values)
INSERT INTO palestine_statistics (casualties, injured, displaced_percentage, aid_packages, source_name, source_url) 
VALUES (58573, 139607, 90, 45000, 'Gaza Health Ministry', 'https://www.palestineredcrescent.org/');

-- Create view for latest statistics
CREATE VIEW latest_palestine_statistics AS
SELECT * FROM palestine_statistics 
WHERE is_active = true 
ORDER BY last_updated DESC 
LIMIT 1;