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
  verified BOOLEAN DEFAULT FALSE,
  auth_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Trigger function to add entry into public.users table when a new user is created in auth schema

-- Trigger function
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_name text;
  user_email text;
  user_avatar text;
begin
  user_name := new.raw_user_meta_data->>'name';
  user_email := new.email;
  user_avatar := new.raw_user_meta_data->>'avatar_url';

  if user_avatar is not null and user_avatar <> '' then
    insert into public.users (auth_id, name, email, avatar)
    values (new.id, user_name, user_email, user_avatar);
  else
    insert into public.users (auth_id, name, email)
    values (new.id, user_name, user_email);
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
