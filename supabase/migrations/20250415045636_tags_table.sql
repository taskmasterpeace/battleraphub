-- tags table
CREATE TABLE
    IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
    );

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.tags;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON tags
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access to public" ON tags AS PERMISSIVE FOR
SELECT
    TO public USING (true);