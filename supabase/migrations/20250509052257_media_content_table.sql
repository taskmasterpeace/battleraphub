DROP TABLE IF EXISTS media_content;
DROP TYPE IF EXISTS media_type;

CREATE TYPE media_type AS ENUM ('video', 'article', 'youtube_video');
create table media_content (
    id uuid default uuid_generate_v4() primary key,
    user_id UUID REFERENCES users (id) not null,
    type media_type not null,
    date timestamp not null,
    title text not null,
    description text,
    thumbnail_img text,
    link text,
    views int,
    likes int,
    tag text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.media_content;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON media_content
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE media_content ENABLE ROW LEVEL SECURITY;

-- insert policy to authenticated user
CREATE POLICY "Enable insert access to authenticated user" ON media_content AS PERMISSIVE FOR
INSERT TO authenticated WITH CHECK (true);

-- update policy to authenticated user
CREATE POLICY "Enable update access to authenticated user" ON media_content AS PERMISSIVE FOR
UPDATE TO authenticated USING ((select auth.uid()) = id);

-- delete policy to authenticated user
CREATE POLICY "Enable delete access to authenticated user" ON media_content AS PERMISSIVE FOR
DELETE TO authenticated USING ((select auth.uid()) = id);

-- read policy to public user
CREATE POLICY "Enable read access to public" ON media_content AS PERMISSIVE FOR
SELECT TO public USING (true);


-- Create random_media_users_view
DROP MATERIALIZED VIEW IF EXISTS random_media_users_view;

CREATE MATERIALIZED VIEW random_media_users_view AS
SELECT * FROM users
WHERE role_id = 3
ORDER BY RANDOM()
LIMIT 3;

SELECT cron.schedule(
    'weekly-random-media-user-change',
    '0 0 */7 * *',  -- Run every 7 days at midnight
    $$ 
    REFRESH MATERIALIZED VIEW CONCURRENTLY random_media_users_view;
    $$
);