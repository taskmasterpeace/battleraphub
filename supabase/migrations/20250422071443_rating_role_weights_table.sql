CREATE TABLE rating_role_weights (
    role_id INT PRIMARY KEY,
    weight NUMERIC(4, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
    
-- trigger function to manage updated_at column
DROP TRIGGER IF EXISTS handle_updated_at ON "public"."rating_role_weights";

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON "public"."rating_role_weights"
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

ALTER TABLE rating_role_weights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access to authenticated user" ON rating_role_weights AS PERMISSIVE FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert access to authenticated user" ON rating_role_weights AS PERMISSIVE FOR
INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update access to authenticated user" ON rating_role_weights AS PERMISSIVE FOR
UPDATE TO authenticated USING (true);

CREATE POLICY "Enable delete access to authenticated user" ON rating_role_weights AS PERMISSIVE FOR
DELETE TO authenticated USING (true);
