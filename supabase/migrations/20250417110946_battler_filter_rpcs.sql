-- Filter battlers with tags

DROP FUNCTION IF EXISTS battler_filter(tags INT[], search_name TEXT, limitnum INT, offsetnum INT);

CREATE OR REPLACE FUNCTION battler_filter(
  tags INT[],
  search_name TEXT DEFAULT NULL,
  limitnum INT DEFAULT 10,
  offsetnum INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  avatar TEXT,
  location TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.name, b.avatar, b.location
  FROM battlers b
  LEFT JOIN battler_tags bt ON b.id = bt.battler_id
  WHERE 
    (
      tags IS NULL OR tags = '{}'::INT[] OR
      bt.tag_id IN (SELECT unnest(tags))
    ) 
    AND
    (
      search_name IS NULL OR b.name ILIKE '%' || search_name || '%'
    )
  GROUP BY b.id
  OFFSET offsetnum
  LIMIT limitnum;
END;
$$ LANGUAGE plpgsql
SET search_path = 'public';

-- Count the number of battlers with all the tags

DROP FUNCTION IF EXISTS battler_filter_count(tags INT[], search_name TEXT);

CREATE OR REPLACE FUNCTION battler_filter_count(tags INT[], search_name TEXT DEFAULT NULL)
RETURNS TABLE (
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*) FROM (
  SELECT COUNT(b.id)
  FROM battlers b
  LEFT JOIN battler_tags bt ON b.id = bt.battler_id
  WHERE 
    (
      tags IS NULL OR tags = '{}'::INT[] OR
      bt.tag_id IN (SELECT unnest(tags))
    )
    AND
    (
      search_name IS NULL OR b.name ILIKE '%' || search_name || '%'
    )
  GROUP BY b.id
  ) AS filtered_battlers;
END;
$$ LANGUAGE plpgsql
SET search_path = 'public';