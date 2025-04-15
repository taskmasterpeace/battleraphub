-- tags table
CREATE TABLE
    IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() 
    );

-- Attach

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.battlers;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON battlers
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access to public" ON tags AS PERMISSIVE FOR
SELECT
    TO public USING (true);