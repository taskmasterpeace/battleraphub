-- battlers table
CREATE TABLE
    IF NOT EXISTS battlers (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        added_by UUID REFERENCES users (id),
        name TEXT,
        avatar TEXT,
        banner TEXT,
        location TEXT,
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.battlers;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON battlers
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE battlers ENABLE ROW LEVEL SECURITY;

-- read policy
CREATE POLICY "Enable read access to public" ON public.battlers AS PERMISSIVE FOR
SELECT
    TO public USING (true);

-- insert policy
CREATE POLICY "Enable insert access to service role" ON public.battlers AS PERMISSIVE FOR
INSERT TO service_role WITH CHECK (true);

-- update policy
CREATE POLICY "Enable update access to service role" ON public.battlers AS PERMISSIVE FOR
UPDATE TO service_role USING (true);

-- delete policy
CREATE POLICY "Enable delete access to service role" ON public.battlers AS PERMISSIVE FOR
DELETE TO service_role USING (true);