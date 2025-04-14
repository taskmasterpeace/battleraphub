-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT,
  image TEXT,
  avatar TEXT,
  bio TEXT,
  role_id INT references roles(id),
  youtube_channel_name TEXT,
  youtube TEXT,
  twitter TEXT,
  instagram TEXT,
  verified BOOLEAN,
  created_at TIMESTAMP
);

--  types of roles: admin, battler, media, fan, league_owner/investor
insert into roles (name) values ('admin'), ('battler'), ('media'), ('fan'), ('league_owner/investor');
