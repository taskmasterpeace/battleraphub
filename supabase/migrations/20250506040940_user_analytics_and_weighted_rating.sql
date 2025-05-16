-- Create weighted_battler_analytics table

CREATE TABLE IF NOT EXISTS weighted_battler_analytics (
    battler_id UUID NOT NULL REFERENCES battlers(id),
    score DECIMAL(10,2) NOT NULL,
    attribute_id INT NOT NULL,
    type SMALLINT NOT NULL CHECK (type IN (0, 1)), -- 0 = attribute, 1 = total_rating
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    primary key (battler_id, attribute_id, type)
);

-- Function to calculate and update weighted battler analytics
CREATE OR REPLACE FUNCTION calculate_weighted_battler_analytics()
RETURNS void AS $$
BEGIN
    -- Calculate total weighted rating per battler
    INSERT INTO weighted_battler_analytics (battler_id, score, attribute_id, type)
    SELECT 
        br.battler_id,
        (SUM(br.score * COALESCE(rrw.weight, 1)) / SUM(10 * COALESCE(rrw.weight, 1))) * 10 AS total_weighted_score,
        0 AS attribute_id, -- total rating
        1 AS type
    FROM battler_ratings br
    JOIN users u ON br.user_id = u.id
    LEFT JOIN rating_role_weights rrw ON u.role_id = rrw.role_id
    GROUP BY br.battler_id
    ON CONFLICT (battler_id, attribute_id, type)
    DO UPDATE SET
        score = EXCLUDED.score,
        updated_at = NOW();

    -- Calculate weighted rating per battler per attribute
    INSERT INTO weighted_battler_analytics (battler_id, score, attribute_id, type)
    SELECT 
        br.battler_id,
        (SUM(br.score * COALESCE(rrw.weight, 1)) / SUM(10 * COALESCE(rrw.weight, 1))) * 10 AS weighted_attribute_score,
        br.attribute_id,
        0 AS type
    FROM battler_ratings br
    JOIN users u ON br.user_id = u.id
    LEFT JOIN rating_role_weights rrw ON u.role_id = rrw.role_id
    GROUP BY br.battler_id, br.attribute_id
    ON CONFLICT (battler_id, attribute_id, type)
    DO UPDATE SET
        score = EXCLUDED.score,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Schedule a cron job for weighted analytics
SELECT cron.schedule(
    'calculate-weighted-battler-analytics',
    '0 */6 * * *', -- Every 6 hours
    'SELECT calculate_weighted_battler_analytics()'
);


-- Top raters: Users who have rated the most distinct battlers

DROP MATERIALIZED VIEW IF EXISTS top_raters;

CREATE MATERIALIZED VIEW IF NOT EXISTS top_raters AS
SELECT
  u.id AS user_id,
  u.name,
  u.avatar,
  COUNT(DISTINCT br.battler_id) AS ratings_given
FROM
  battler_ratings br
JOIN
  users u ON br.user_id = u.id
GROUP BY
  u.id
ORDER BY
  ratings_given DESC;


-- Most Consistent Users

DROP MATERIALIZED VIEW IF EXISTS most_consistent_users;

CREATE MATERIALIZED VIEW IF NOT EXISTS most_consistent_users AS
SELECT
  u.id AS user_id,
  u.name,
  u.avatar,
  COUNT(br.id) AS ratings_given,
  ROUND(AVG(br.score)::numeric, 2) AS average_rating,
  ROUND(STDDEV(br.score)::numeric, 2) AS rating_stddev
FROM
  battler_ratings br
JOIN
  users u ON u.id = br.user_id
GROUP BY
  u.id
HAVING
  COUNT(br.id) >= 5 -- Filter out users with very few ratings
ORDER BY
  ratings_given DESC;


-- Most Influential Users

DROP MATERIALIZED VIEW IF EXISTS most_influenced_users;

CREATE MATERIALIZED VIEW IF NOT EXISTS most_influenced_users AS
SELECT
  u.id AS user_id,
  u.name,
  u.avatar,
  COUNT(br.id) AS ratings_given,
  ROUND(AVG(ABS(br.score - ba.score))::numeric, 2) AS avg_diff_from_community
FROM
  battler_ratings br
JOIN
  users u ON u.id = br.user_id
JOIN
  battler_analytics ba
    ON ba.battler_id = br.battler_id
    AND ba.attribute_id = br.attribute_id::int
    AND ba.type = 0
GROUP BY
  u.id
HAVING
  COUNT(br.id) >= 5
ORDER BY
  ratings_given DESC;

-- Most Accurate (Consistency + Influence) Users: standard deviation and average difference from community

DROP MATERIALIZED VIEW IF EXISTS most_accurate_users;

CREATE MATERIALIZED VIEW IF NOT EXISTS most_accurate_users AS
WITH consistency AS (
  SELECT
    br.user_id,
    STDDEV(br.score) AS stddev
  FROM
    battler_ratings br
  GROUP BY
    br.user_id
),
influence AS (
  SELECT
    br.user_id,
    AVG(ABS(br.score - ba.score)) AS avg_diff
  FROM
    battler_ratings br
  JOIN
    battler_analytics ba
    ON ba.battler_id = br.battler_id
    AND ba.attribute_id = br.attribute_id::int
    AND ba.type = 0
  GROUP BY
    br.user_id
)
SELECT
  u.id AS user_id,
  u.name,
  u.avatar,
  ROUND(c.stddev::numeric, 2) AS rating_stddev,
  ROUND(i.avg_diff::numeric, 2) AS avg_diff_from_community,
  ROUND((c.stddev + i.avg_diff)::numeric, 2) AS accuracy_score
FROM
  users u
JOIN consistency c ON u.id = c.user_id
JOIN influence i ON u.id = i.user_id
ORDER BY
  accuracy_score DESC;


DROP MATERIALIZED VIEW IF EXISTS top_battlers_weighted;

CREATE MATERIALIZED VIEW IF NOT EXISTS top_battlers_weighted AS 
SELECT 
  b.id AS battler_id,
  b.name, 
  b.avatar, 
  b.location, 
  wba.score AS avg_rating,
  COALESCE(
    array_agg(
      DISTINCT jsonb_build_object(
        'name', bd.name,
        'is_positive', bd.is_positive
      )
    ) FILTER (WHERE bd.name IS NOT NULL),
    '{}'
  ) AS assigned_badges
FROM 
  weighted_battler_analytics wba 
  LEFT JOIN battlers b ON wba.battler_id = b.id
  LEFT JOIN battler_badges bb ON bb.battler_id = b.id
  LEFT JOIN badges bd ON bd.id = bb.badge_id
WHERE 
  wba.type = 1 
  AND wba.attribute_id = 0 
GROUP BY 
  b.id, b.name, b.avatar, b.location, wba.score
ORDER BY 
  wba.score DESC
LIMIT 10;


-- Top Assigned Badges by Battlers

DROP MATERIALIZED VIEW IF EXISTS top_assigned_badges_by_battlers;

CREATE MATERIALIZED VIEW IF NOT EXISTS top_assigned_badges_by_battlers AS
WITH badge_counts AS (
    SELECT 
        bb.battler_id,
        bb.badge_id,
        COUNT(*) AS assign_count
    FROM battler_badges bb
    GROUP BY bb.battler_id, bb.badge_id
),
battler_totals AS (
    SELECT 
        battler_id,
        SUM(assign_count) AS total_assignments
    FROM badge_counts
    GROUP BY battler_id
),
badge_with_type AS (
    SELECT 
        bc.battler_id,
        bc.badge_id,
        bc.assign_count,
        b.name AS badge_name,
        b.description AS description,
        b.is_positive
    FROM badge_counts bc
    JOIN badges b ON bc.badge_id = b.id
),
ranked AS (
    SELECT 
        bwt.*,
        bt.total_assignments,
        ROW_NUMBER() OVER (
            PARTITION BY bwt.battler_id, bwt.is_positive
            ORDER BY bwt.assign_count DESC
        ) AS rn
    FROM badge_with_type bwt
    JOIN battler_totals bt ON bwt.battler_id = bt.battler_id
)
SELECT 
    battler_id,
    badge_id,
    badge_name,
    description,
    is_positive,
    assign_count,
    ROUND((assign_count::decimal / total_assignments) * 100, 2) AS percentage
FROM ranked
WHERE rn <= 5
ORDER BY battler_id, is_positive DESC, rn;

-- Refresh materialized views every 6 hours

SELECT cron.schedule(
    'refresh-top_raters',
    '0 1 * * *', -- Run daily at 01:00
    'REFRESH MATERIALIZED VIEW top_raters'
);

SELECT cron.schedule(
    'refresh-most_consistent_users',
    '5 1 * * *', -- Run daily at 01:05
    'REFRESH MATERIALIZED VIEW most_consistent_users'
);

SELECT cron.schedule(
    'refresh-most_influenced_users',
    '10 1 * * *', -- Run daily at 01:10
    'REFRESH MATERIALIZED VIEW most_influenced_users'
);

SELECT cron.schedule(
    'refresh-most_accurate_users',
    '15 1 * * *', -- Run daily at 01:15
    'REFRESH MATERIALIZED VIEW most_accurate_users'
);

SELECT cron.schedule(
    'refresh-top_battlers_weighted',
    '20 1 * * *', -- Run daily at 01:20
    'REFRESH MATERIALIZED VIEW top_battlers_weighted'
);

SELECT cron.schedule(
    'refresh-top_assigned_badges_by_battlers',
    '25 1 * * *', -- Run daily at 01:25
    'REFRESH MATERIALIZED VIEW top_assigned_badges_by_battlers'
);

-- Alter users table to add location:string and website:string if not already present

-- Check if location column exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='location') THEN
        ALTER TABLE users ADD COLUMN location TEXT;
    END IF;
END $$;

-- Check if website column exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='website') THEN
        ALTER TABLE users ADD COLUMN website TEXT;
    END IF;
END $$;

--  RLS Policies for weighted_battler_analytics table

ALTER TABLE weighted_battler_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable select for public" ON weighted_battler_analytics;

CREATE POLICY "Enable select for public" ON weighted_battler_analytics
FOR SELECT TO public USING (
    true
);

-- Permission for calculate_weighted_battler_analytics

GRANT SELECT ON weighted_battler_analytics TO public;
GRANT EXECUTE ON FUNCTION calculate_weighted_battler_analytics() TO service_role; 

