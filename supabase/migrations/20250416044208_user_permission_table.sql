-- tags table
CREATE TABLE
    IF NOT EXISTS user_permissions (
        user_id UUID REFERENCES users (id),
        permission TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- trigger function to manage updated_at column

DROP TRIGGER IF EXISTS handle_updated_at ON public.user_permissions;

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON user_permissions
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access to authenticated user" ON user_permissions AS PERMISSIVE FOR
SELECT
    TO authenticated USING (true); 

-- insert policy
CREATE POLICY "Enable insert access to service role" ON user_permissions AS PERMISSIVE FOR
INSERT TO service_role WITH CHECK (true);

-- update policy
CREATE POLICY "Enable update access to service role" ON user_permissions AS PERMISSIVE FOR
UPDATE TO service_role USING (true);

-- delete policy
CREATE POLICY "Enable delete access to service role" ON user_permissions AS PERMISSIVE FOR
DELETE TO service_role USING (true);