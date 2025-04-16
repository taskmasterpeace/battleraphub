create type battle_criteria as enum ('writing', 'performance', 'personal');

-- badges table
CREATE TABLE
    IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        is_positive BOOLEAN NOT NULL,
        category battle_criteria NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- attributes table
CREATE TABLE
    IF NOT EXISTS attributes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category battle_criteria NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- battler badges table
CREATE TABLE
    IF NOT EXISTS battler_badges (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users (id),
        battler_id UUID REFERENCES battlers (id),
        badge_id INTEGER REFERENCES badges (id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- battler rating table
CREATE TABLE
    IF NOT EXISTS battler_ratings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users (id),
        battler_id UUID REFERENCES battlers (id),
        score NUMERIC(2, 2) NOT NULL,
        prev_score NUMERIC(2, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

-- Trigger function to manage updated_at column

-- Badges table
DROP TRIGGER IF EXISTS handle_updated_at ON public.badges;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON badges
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Attributes table
DROP TRIGGER IF EXISTS handle_updated_at ON public.attributes;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON attributes
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Battler rating table
DROP TRIGGER IF EXISTS handle_updated_at ON public.battler_ratings;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE
    ON battler_ratings
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE battler_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE battler_ratings ENABLE ROW LEVEL SECURITY;

-- Allow read access to public on badges and attributes tables

CREATE POLICY "Enable read access to public" ON badges AS PERMISSIVE FOR
SELECT
    TO public USING (true);

CREATE POLICY "Enable read access to public" ON attributes AS PERMISSIVE FOR
SELECT
    TO public USING (true);

-- Battler badges table: authenticated

CREATE POLICY "Enable read access to authenticated user" ON battler_badges AS PERMISSIVE FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert access to authenticated user" ON battler_badges AS PERMISSIVE FOR
INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable delete access to authenticated user" ON battler_badges AS PERMISSIVE FOR
DELETE TO authenticated USING (auth.uid() = user_id);

-- Battler rating table: authenticated

CREATE POLICY "Enable read access to authenticated user" ON battler_ratings AS PERMISSIVE FOR
SELECT
    TO authenticated USING (true);

CREATE POLICY "Enable insert access to authenticated user" ON battler_ratings AS PERMISSIVE FOR
INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable delete access to authenticated user" ON battler_ratings AS PERMISSIVE FOR
DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Enable update access to authenticated user" ON battler_ratings AS PERMISSIVE FOR
UPDATE TO authenticated USING (auth.uid() = user_id);