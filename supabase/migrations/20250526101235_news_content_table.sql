CREATE TABLE IF NOT EXISTS news_contents(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Metadata
  reading_time TEXT,
  headline TEXT,
  blurb TEXT,
  published_at TIMESTAMPTZ,
  event_date TIMESTAMPTZ,
  tags TEXT[],
  main_content TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.news_contents;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON news_contents
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE news_contents ENABLE ROW LEVEL SECURITY;

-- read policy
CREATE POLICY "Enable read access to public" ON public.news_contents AS PERMISSIVE FOR
SELECT TO public USING (true);

-- insert policy
CREATE POLICY "Enable insert access to service role" ON public.news_contents AS PERMISSIVE FOR
INSERT TO service_role WITH CHECK (true);

-- update policy
CREATE POLICY "Enable update access to service role" ON public.news_contents AS PERMISSIVE FOR
UPDATE TO service_role USING (true);

-- delete policy
CREATE POLICY "Enable delete access to service role" ON public.news_contents AS PERMISSIVE FOR
DELETE TO service_role USING (true);