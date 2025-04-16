-- tags table
CREATE TABLE
    IF NOT EXISTS battler_tags (
        battler_id UUID REFERENCES battlers (id),
        tag_id INTEGER REFERENCES tags (id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.battler_tags;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON battler_tags
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE battler_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access to public" ON battler_tags AS PERMISSIVE FOR
SELECT
    TO public USING (true); 

-- insert policy
CREATE POLICY "Enable insert access to authenticated user" ON battler_tags AS PERMISSIVE FOR
INSERT TO authenticated WITH CHECK (true);

-- update policy
CREATE POLICY "Enable update access to authenticated user" ON battler_tags AS PERMISSIVE FOR
UPDATE TO authenticated USING (true);

-- delete policy
CREATE POLICY "Enable delete access to authenticated user" ON battler_tags AS PERMISSIVE FOR
DELETE TO authenticated USING (true);