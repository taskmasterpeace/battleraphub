-- trigger function to manage last_updated column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
    RETURNS TRIGGER
    SECURITY INVOKER
    SET search_path = 'public'
    AS $$
    BEGIN
        NEW.updated_at = now();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- trigger function to manage updated_at column
DROP TRIGGER IF EXISTS handle_updated_at ON "public"."users";

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON "public"."users"
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- trigger function to add entry into public.users table when a new user is created in auth schema

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = 'public'
as $$
declare
  user_name text;
  user_email text;
  user_avatar text;
begin
  user_name := new.raw_user_meta_data->>'name';
  user_email := new.email;
  user_avatar := new.raw_user_meta_data->>'avatar_url';

  if user_avatar is not null and user_avatar <> '' then
    insert into public.users (id, name, email, avatar)
    values (new.id, user_name, user_email, user_avatar);
  else
    insert into public.users (id, name, email)
    values (new.id, user_name, user_email);
  end if;

  return new;
end;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- read policy
CREATE POLICY "Enable read access to authenticated user" ON "public"."users" AS PERMISSIVE FOR
SELECT TO authenticated USING (true);

-- update policy
CREATE POLICY "Enable update to authenticated user" ON "public"."users" AS PERMISSIVE FOR
UPDATE TO authenticated USING ((select auth.uid()) = id);

-- delete policy
CREATE POLICY "Enable delete for users based on user_id" ON "public"."users" AS PERMISSIVE FOR
DELETE to authenticated using ((select auth.uid()) = id);

-- insert policy
create policy "Prevent client insert" on "public"."users" as PERMISSIVE for INSERT to public with check (false);
