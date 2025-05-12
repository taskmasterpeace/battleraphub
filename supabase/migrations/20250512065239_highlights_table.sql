-- Highlights table schema (id uuid, entity_type text, entity_id uuid, created_at timestamp, updated_at timestamp) UNIQUE(entity_type, entity_id)

CREATE TABLE IF NOT EXISTS highlights (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_type, entity_id)
);

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.highlights;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON highlights
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

-- read policy
CREATE POLICY "Enable read access to public" ON public.highlights AS PERMISSIVE FOR
SELECT TO public USING (true);

-- insert policy
CREATE POLICY "Enable insert access to service role" ON public.highlights AS PERMISSIVE FOR
INSERT TO service_role WITH CHECK (true);

-- update policy
CREATE POLICY "Enable update access to service role" ON public.highlights AS PERMISSIVE FOR
UPDATE TO service_role USING (true);

-- delete policy
CREATE POLICY "Enable delete access to service role" ON public.highlights AS PERMISSIVE FOR
DELETE TO service_role USING (true);