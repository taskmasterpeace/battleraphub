## Analytics calculation

There are 3 criteria
1. Writing
2. Performance
3. Personal

There are different attributes in each criteria where user can give their rating for battlers
which is stored in **battler_rating** table

Schema of battler_rating
```
id
user_id
battler_id
score
prev_score
attribute_id
created_at
updated_at
```

Questions:
What do we need to store?

Battlers:
total_rating - (Sum of all rating / maximum rating user can get) * 10
each attribute rating - (Sum of attribute / maximum rating for this attribute) * 10

<!-- Total users
Total ratings?
Avg. of total rating
Active users based on last 30 days - Based on how many unique user have given rating in last 30 days?

Most active user roles? -->

Data format

battler_analytics:

battler_id
score
attribute_id - Do not use joins for getting attribute name
type - (0 - attribute, 1 - total_rating)

Action:
How, where and when we can calculate this metrics?

Cron job running every 6 hours - It will be PostgreSQL (supbase) cron jobs