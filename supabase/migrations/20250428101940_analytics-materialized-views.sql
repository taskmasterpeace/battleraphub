
-- Materialized views for analytics

-- Top 10 battler view

DROP MATERIALIZED VIEW IF EXISTS top_battlers_unweighted;

CREATE MATERIALIZED VIEW IF NOT EXISTS top_battlers_unweighted AS 
SELECT 
  b.name, 
  b.avatar, 
  b.location, 
  ba.score as avg_rating 
FROM 
  battler_analytics ba 
  left join battlers b on ba.battler_id = b.id 
where type = 1 AND attribute_id = 0 
order by score 
limit 10;

-- Average ratings by category

DROP MATERIALIZED VIEW IF EXISTS average_ratings_by_category;

CREATE MATERIALIZED VIEW IF NOT EXISTS average_ratings_by_category AS
SELECT 
    a.category,
    AVG(br.score::float) AS avg_rating
FROM 
    battler_ratings br
JOIN 
    attributes a ON br.attribute_id = a.id
GROUP BY 
    a.category;

-- Average ratings over time in months

DROP MATERIALIZED VIEW IF EXISTS average_ratings_over_time;

CREATE MATERIALIZED VIEW IF NOT EXISTS average_ratings_over_time AS
SELECT
    date_trunc('month', br.updated_at) AS month,
    AVG(br.score::float) AS avg_rating
FROM
    battler_ratings br
WHERE
    br.updated_at >= NOW() - INTERVAL '6 months'
GROUP BY
    date_trunc('month', br.updated_at)
ORDER BY
    month ASC;

-- Community Rating Distribution

DROP MATERIALIZED VIEW IF EXISTS community_rating_distribution;

CREATE MATERIALIZED VIEW IF NOT EXISTS community_rating_distribution AS
SELECT
    width_bucket(score::float, 0, 10, 10) AS bucket,
    COUNT(*) AS rating_count
FROM
    battler_ratings
GROUP BY
    bucket
ORDER BY
    bucket;

-- Average rating Trends Over Time in months by category

DROP MATERIALIZED VIEW IF EXISTS average_rating_trends_over_time_by_category;

CREATE MATERIALIZED VIEW IF NOT EXISTS average_rating_trends_over_time_by_category AS
SELECT
    date_trunc('month', br.updated_at) AS month,
    a.category,
    AVG(br.score::float) AS avg_rating
FROM
    battler_ratings br
JOIN
    attributes a ON br.attribute_id = a.id
WHERE
    br.updated_at >= NOW() - INTERVAL '12 months'
GROUP BY
    month, a.category
ORDER BY
    month, a.category;

-- Attributes with highest average ratings (Most Valued Attributes)

DROP MATERIALIZED VIEW IF EXISTS most_valued_attributes;

CREATE MATERIALIZED VIEW IF NOT EXISTS most_valued_attributes AS
SELECT
    a.id AS attribute_id,
    a.name AS attribute_name,
    a.category,
    AVG(br.score::float) AS avg_rating,
    COUNT(*) AS rating_count
FROM
    battler_ratings br
JOIN
    attributes a ON br.attribute_id = a.id
GROUP BY
    a.id, a.name, a.category
ORDER BY
    avg_rating DESC
LIMIT 10;

-- Most common positive badge

DROP MATERIALIZED VIEW IF EXISTS most_common_positive_badges;

CREATE MATERIALIZED VIEW IF NOT EXISTS most_common_positive_badges AS
SELECT
    b.id AS badge_id,
    b.name AS badge_name,
    b.is_positive,
    b.description,
    COUNT(bb.id) AS times_assigned
FROM
    battler_badges bb
JOIN
    badges b ON bb.badge_id = b.id
WHERE
    b.is_positive = TRUE
GROUP BY
    b.id, b.name, b.description
ORDER BY
    times_assigned DESC
LIMIT 5;

-- Most common negative badges

DROP MATERIALIZED VIEW IF EXISTS most_common_negative_badges;

CREATE MATERIALIZED VIEW IF NOT EXISTS most_common_negative_badges AS
SELECT
    b.id AS badge_id,
    b.name AS badge_name,
    b.description,
    COUNT(bb.id) AS times_assigned
FROM
    battler_badges bb
JOIN
    badges b ON bb.badge_id = b.id
WHERE
    b.is_positive = FALSE
GROUP BY
    b.id, b.name, b.description
ORDER BY
    times_assigned DESC
LIMIT 5;

-- Refresh materialized views every 6 hours

SELECT cron.schedule(
    'refresh-top_battlers_unweighted',
    '0 0 * * *', -- Run daily at 00:00
    'REFRESH MATERIALIZED VIEW CONCURRENTLY top_battlers_unweighted'
);

SELECT cron.schedule(
    'refresh-average_ratings_by_category',
    '5 0 * * *', -- Run daily at 00:05
    'REFRESH MATERIALIZED VIEW CONCURRENTLY average_ratings_by_category'
);

SELECT cron.schedule(
    'refresh-average_ratings_over_time',
    '10 0 * * *', -- Run daily at 00:10
    'REFRESH MATERIALIZED VIEW CONCURRENTLY average_ratings_over_time'
);

SELECT cron.schedule(
    'refresh-community_rating_distribution',
    '15 0 * * *', -- Run daily at 00:15
    'REFRESH MATERIALIZED VIEW CONCURRENTLY community_rating_distribution'
);

SELECT cron.schedule(
    'refresh-average_rating_trends_over_time_by_category',
    '20 0 * * *', -- Run daily at 00:20
    'REFRESH MATERIALIZED VIEW CONCURRENTLY average_rating_trends_over_time_by_category'
);

SELECT cron.schedule(
    'refresh-most_valued_attributes',
    '25 0 * * *', -- Run daily at 00:25
    'REFRESH MATERIALIZED VIEW CONCURRENTLY most_valued_attributes'
);

SELECT cron.schedule(
    'refresh-most_common_positive_badges',
    '30 0 * * *', -- Run daily at 00:30
    'REFRESH MATERIALIZED VIEW CONCURRENTLY most_common_positive_badges'
);

SELECT cron.schedule(
    'refresh-most_common_negative_badges',
    '35 0 * * *', -- Run daily at 00:35
    'REFRESH MATERIALIZED VIEW CONCURRENTLY most_common_negative_badges'
);

-- RPC function for role, category and attribute based analytics

DROP FUNCTION IF EXISTS get_top_battlers_by_rating;

CREATE OR REPLACE FUNCTION get_top_battlers_by_rating(
  p_role_id INTEGER,
  p_category battle_criteria,
  p_attribute_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  battler_id UUID,
  average_score NUMERIC,
  name TEXT
)
LANGUAGE SQL
AS $$
  SELECT 
    br.battler_id,
    AVG(br.score) AS average_score,
    b.name
  FROM 
    battler_ratings br
  JOIN users u ON br.user_id = u.id
  JOIN attributes a ON br.attribute_id = a.id
  JOIN battlers b ON b.id = br.battler_id
  WHERE 
    u.role_id = p_role_id
    AND a.category = p_category
    AND (p_attribute_id IS NULL OR a.id::TEXT = p_attribute_id)
  GROUP BY 
    br.battler_id, b.name
  ORDER BY 
    average_score DESC
  LIMIT 10;
$$;

