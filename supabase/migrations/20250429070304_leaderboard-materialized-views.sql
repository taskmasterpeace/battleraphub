
-- community stats

DROP MATERIALIZED VIEW IF EXISTS leaderboard_community_stats;

CREATE MATERIALIZED VIEW leaderboard_community_stats AS
SELECT
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days') AS new_users_this_week,
  (SELECT COUNT(*) FROM battler_ratings) AS total_ratings,
  (SELECT COUNT(*) FROM battler_ratings WHERE created_at >= NOW() - INTERVAL '7 days') AS new_ratings_this_week,
  (SELECT ROUND(AVG(score), 2) FROM battler_ratings) AS avg_rating,
  (SELECT COUNT(DISTINCT user_id) FROM battler_ratings WHERE created_at >= NOW() - INTERVAL '30 days') AS active_users_last_30_days;

-- rating distribution

DROP MATERIALIZED VIEW IF EXISTS leaderboard_rating_distribution;

CREATE MATERIALIZED VIEW leaderboard_rating_distribution AS
SELECT
  bucket,
  COUNT(*) AS count,
  ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM battler_ratings), 2) AS percentage
FROM (
  SELECT
    CASE
      WHEN score BETWEEN 0 AND 2.99 THEN '1-2'
      WHEN score BETWEEN 3 AND 4.99 THEN '3-4'
      WHEN score BETWEEN 5 AND 6.99 THEN '5-6'
      WHEN score BETWEEN 7 AND 8.99 THEN '7-8'
      WHEN score BETWEEN 9 AND 10 THEN '9-10'
    END AS bucket
  FROM battler_ratings
) binned
GROUP BY bucket
ORDER BY bucket;

-- active roles by ratings

DROP MATERIALIZED VIEW IF EXISTS leaderboard_active_roles_by_ratings;

CREATE MATERIALIZED VIEW leaderboard_active_roles_by_ratings AS
SELECT
  u.role_id,
  COUNT(*) AS ratings_count,
  ROUND(
    100.0 * COUNT(*) / (
      SELECT COUNT(*)
      FROM battler_ratings br
      JOIN users u2 ON br.user_id = u2.id
      WHERE br.created_at >= NOW() - INTERVAL '30 days'
    ), 2
  ) AS percentage
FROM battler_ratings br
JOIN users u ON br.user_id = u.id
WHERE br.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.role_id
ORDER BY ratings_count DESC;


-- Schedule cron jobs to refresh materialized views

SELECT cron.schedule('refresh-leaderboard-community-stats', '0 1 * * *', 'REFRESH MATERIALIZED VIEW leaderboard_community_stats');
SELECT cron.schedule('refresh-leaderboard-rating-distribution', '5 1 * * *', 'REFRESH MATERIALIZED VIEW leaderboard_rating_distribution');
SELECT cron.schedule('refresh-leaderboard-active-roles-by-ratings', '10 1 * * *', 'REFRESH MATERIALIZED VIEW leaderboard_active_roles_by_ratings');
