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

-- Create videos table for YouTube video content
CREATE TABLE videos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_id TEXT NOT NULL UNIQUE, -- YouTube video ID
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('documentary', 'news', 'testimony', 'solidarity', 'educational')),
  duration TEXT, -- YouTube duration format (PT15M30S)
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_is_featured ON videos(is_featured);
CREATE INDEX idx_videos_is_active ON videos(is_active);
CREATE INDEX idx_videos_sort_order ON videos(sort_order);
CREATE INDEX idx_videos_created_at ON videos(created_at DESC);

-- Insert sample video data
INSERT INTO videos (title, description, video_id, thumbnail_url, category, duration, published_at, is_featured, sort_order) VALUES
('Filistin Tarihi: Nakba''dan Günümüze', 'Filistin halkının yaşadığı tarihi süreç ve Nakba''nın etkilerini anlatan belgesel.', 'n_3pkGHmJOs', 'https://img.youtube.com/vi/n_3pkGHmJOs/maxresdefault.jpg', 'documentary', 'PT45M30S', '2023-10-15 10:00:00+00', true, 1),
('Gazze''den Canlı Tanıklık', 'Gazze''de yaşayan bir ailenin gözünden günlük yaşam ve direniş.', 'BT5L4YU_Fl4', 'https://img.youtube.com/vi/BT5L4YU_Fl4/maxresdefault.jpg', 'testimony', 'PT12M45S', '2024-01-20 15:30:00+00', true, 2),
('Türkiye''den Filistin''e Destek Yürüyüşü', 'İstanbul''da düzenlenen Filistin dayanışma yürüyüşünden görüntüler.', 'Y1NndUlk_nQ', 'https://img.youtube.com/vi/Y1NndUlk_nQ/maxresdefault.jpg', 'solidarity', 'PT8M20S', '2024-02-10 12:00:00+00', true, 3),
('Filistin Kültürü ve Gelenekleri', 'Filistin halkının zengin kültürel mirasını tanıtan eğitici video.', 'dQ1QlJNMVwU', 'https://img.youtube.com/vi/dQ1QlJNMVwU/maxresdefault.jpg', 'educational', 'PT25M15S', '2023-12-05 09:00:00+00', false, 4),
('Uluslararası Hukuk ve Filistin', 'Filistin meselesinin uluslararası hukuk açısından değerlendirilmesi.', 'kLp_Hh6DKWc', 'https://img.youtube.com/vi/kLp_Hh6DKWc/maxresdefault.jpg', 'educational', 'PT35M50S', '2024-01-30 14:00:00+00', false, 5),
('Son Dakika: Gazze''deki Gelişmeler', 'Gazze''deki son gelişmeler ve güncel durum hakkında haber bülteni.', 'VgMHeA0VjTM', 'https://img.youtube.com/vi/VgMHeA0VjTM/maxresdefault.jpg', 'news', 'PT6M30S', '2024-03-01 18:00:00+00', false, 6);

-- Create view for featured videos
CREATE VIEW featured_videos AS
SELECT * FROM videos 
WHERE is_active = true AND is_featured = true 
ORDER BY sort_order ASC, published_at DESC;

-- Create view for videos by category
CREATE VIEW videos_by_category AS
SELECT 
  category,
  COUNT(*) as video_count,
  MAX(published_at) as latest_video
FROM videos 
WHERE is_active = true 
GROUP BY category;

-- Create function to increment video view count
CREATE OR REPLACE FUNCTION increment_video_views(video_id_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE videos 
  SET view_count = view_count + 1, 
      updated_at = NOW() 
  WHERE video_id = video_id_param AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS) for videos table
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policies for videos table
-- Public can read active videos
CREATE POLICY "Public can view active videos" ON videos
FOR SELECT USING (is_active = true);

-- Authenticated users with admin role can do everything
CREATE POLICY "Admins can manage videos" ON videos
FOR ALL USING (
  auth.role() = 'authenticated' AND 
  (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin' OR
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin' OR
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'editor' OR
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'editor'
  )
);

-- Create a function to handle user role assignment after signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Set default role to 'user' for new signups
  NEW.raw_user_meta_data = 
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create admin user function (to be run manually)
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT
) RETURNS void AS $$
BEGIN
  -- This function should be called manually to create admin users
  -- Example: SELECT create_admin_user('admin@ozgurfilistin.tr', 'secure_password');
  
  RAISE NOTICE 'Admin user creation should be done through Supabase Auth UI or Dashboard';
  RAISE NOTICE 'Email: %', admin_email;
  RAISE NOTICE 'After creating the user, update their metadata with: {"role": "admin"}';
END;
$$ LANGUAGE plpgsql;