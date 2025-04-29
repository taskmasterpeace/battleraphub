-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create battler_analytics table
CREATE TABLE IF NOT EXISTS battler_analytics (
    id BIGSERIAL PRIMARY KEY,
    battler_id UUID NOT NULL REFERENCES battlers(id),
    score DECIMAL(10,2) NOT NULL,
    attribute_id INT NOT NULL,
    type SMALLINT NOT NULL CHECK (type IN (0, 1)), -- 0 for attribute, 1 for total_rating
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(battler_id, attribute_id, type)
);


-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_battler_analytics_battler_id ON battler_analytics(battler_id);
CREATE INDEX IF NOT EXISTS idx_battler_analytics_score ON battler_analytics(score);

-- Function to calculate and update analytics
CREATE OR REPLACE FUNCTION calculate_battler_analytics()
RETURNS void AS $$
BEGIN
    -- Calculate total rating for each battler
    INSERT INTO battler_analytics (battler_id, score, attribute_id, type)
    SELECT 
        br.battler_id,
        (SUM(br.score) / (COUNT(*) * 10.0)) * 10 as total_score,
        0 as attribute_id, -- Using a dummy UUID for total rating
        1 as type
    FROM battler_ratings br
    GROUP BY br.battler_id
    ON CONFLICT (battler_id, attribute_id, type) 
    DO UPDATE SET 
        score = EXCLUDED.score,
        updated_at = NOW();

    -- Calculate attribute-specific ratings
    INSERT INTO battler_analytics (battler_id, score, attribute_id, type)
    SELECT 
        br.battler_id,
        (SUM(br.score) / (COUNT(*) * 10.0)) * 10 as attribute_score,
        br.attribute_id,
        0 as type
    FROM battler_ratings br
    GROUP BY br.battler_id, br.attribute_id
    ON CONFLICT (battler_id, attribute_id, type) 
    DO UPDATE SET 
        score = EXCLUDED.score,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a cron job to run every 6 hours
SELECT cron.schedule(
    'calculate-battler-analytics',
    '0 */6 * * *', -- Every 6 hours
    'SELECT calculate_battler_analytics()'
);

-- Add RLS policies
ALTER TABLE battler_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access to public user" ON battler_analytics AS PERMISSIVE FOR
SELECT
    TO public USING (true);

CREATE POLICY "Enable read access to authenticated user" ON battler_analytics AS PERMISSIVE FOR
SELECT
    TO authenticated USING (true);

-- Grant necessary permissions
GRANT SELECT ON battler_analytics TO public;
GRANT EXECUTE ON FUNCTION calculate_battler_analytics() TO service_role; 