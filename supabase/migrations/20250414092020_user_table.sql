-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  image TEXT,
  avatar TEXT,
  bio TEXT,
  role_id INT,
  youtube_channel_name TEXT,
  youtube TEXT,
  twitter TEXT,
  instagram TEXT,
  verified BOOLEAN,
  auth_id TEXT,
  created_at TIMESTAMP
);
