# 📈 Analytics Documentation

## 📊 Overview Tab – Analytics Dashboard

> The **Overview** tab provides a summary of the top-performing battlers and how users rate across categories over time.

---

### 🥇 Top Rated Battlers

- 🏆 **What’s shown:** Battlers ranked by their overall average rating
- 📊 **Display:** Horizontal bar chart
- 🧮 **Calculation:** Average of all ratings received by a battler across three categories: writing, performance, personal

**Example:**
- ✍️ Writing: 8, 9, 7
- 🎤 Performance: 8, 9
- 👤 Personal: 7, 6, 8
- ➡️ **Average Rating** = (8 + 9 + 7 + 8 + 9 + 7 + 6 + 8) / 8 = **7.75**

---

### 📚 Category Averages

- 📋 **What’s shown:** Average rating given per category by all users
- 📊 **Display:** Vertical bar chart
- 🧮 **Calculation:** All scores in each category are averaged

**Example:**
- ✍️ Writing scores = 9, 8, 7, 6
- ➡️ **Category Average** = (9 + 8 + 7 + 6) / 4 = **7.5**

---

### 📈 Rating Trends

- 📅 **What’s shown:** Monthly trend of all community ratings
- 📉 **Display:** Line graph over time
- 🧮 **Calculation:** All ratings given in a month are averaged to show changes over time

**Example:**
- 📆 April: 260 total points from 40 ratings → **6.5**
- 📆 May: 420 total points from 60 ratings → **7.0**

---

## 🏅 Role-Based Analytics: Top Battlers by Fan Ratings

This page highlights the **top battlers** based on ratings provided by users with a specific **role** (e.g., fans, critics). Quickly spot who’s dominating in **writing**, **performance**, or other rating criteria.

---

### 🔍 What You’re Seeing

#### 🏆 Top Battlers Chart
- 📊 **Top 10 battlers** for the selected role and rating category
- 📏 **Bars** represent average scores given by users of that role
- 🏷️ Each battler’s name and their average score are displayed

#### 🃏 Battler Cards
- 🖼️ **Profile Image**
- 🧑 **Name**
- 🌍 **Location**
- ⭐ **Average Score**

---

### 🎯 How Rankings Are Calculated

- 🧮 **Average rating score** a battler received from users with the selected role (e.g., Fans) for a specific category (like **writing**)

**Criteria:**
- 👥 Only ratings by users with the **selected role** are considered
- 🗂️ Filter by:
  - 🏷️ **Category** (e.g., Writing, Delivery, Performance)
  - 🧩 **Attribute** (optional finer breakdown)

**Formula:**
```
Average Score = Sum of Scores from Selected Role / Number of Ratings
```
- 📝 Only battlers who have received ratings from that role and category will appear in the list

---


## 🧑‍🎤 Battler Analytics Tab (For each battler)

The **Battler Analysis** section shows how battlers perform across various skill areas and how they’re recognized by the community. Get insights into strengths, common traits, and areas where battlers stand out (or fall short).

### 🧩 Attribute Breakdown

See how a battler performs across key attributes:
- ✍️ Wordplay
- 💥 Punchlines
- 🧠 Schemes
- 🎯 Angles
- 🎤 Delivery
- 🕺 Stage Presence
- 🙌 Crowd Control
- 🎭 Showmanship
- 🔥 Authenticity
- 🧠 Battle IQ
- 📅 Preparation
- 🔄 Consistency

Each attribute is rated based on community feedback. Ratings are averaged to show strengths and improvement areas.

---

### ✅ Most Common Positive Badges

This section highlights the **top 5 positive badges** that are most frequently awarded to battlers. These badges reflect recurring strengths observed by the community — for example, someone might regularly receive a badge for being a "Punchline King" or a "Scheme Specialist".

These results are based on how often each badge is assigned across all battlers and reflect what the community values most in battle performances.

---

### ❌ Most Common Negative Badges

This section showcases the **top 5 negative badges** that are most frequently given. These badges indicate areas where battlers are often critiqued — like being repetitive or lacking preparation.

The chart is based on community feedback and helps identify common challenges that battlers face.

---

### ℹ️ How Data Is Calculated

- **Attribute Breakdown** is based on the average ratings submitted by users for each attribute per battler.
- **Badge Rankings** are calculated by counting how often each badge has been assigned across all battlers. The top 5 most frequent ones — both positive and negative — are shown in the charts.

Use this dashboard to explore trends, compare performances, and better understand what makes a battler stand out.

---

## 🌐 Community Trends

The **Community Trends** section provides a bird’s-eye view of how battlers are rated by the community. Understand which skills are most valued and how sentiment evolves over time.

---

### 📊 Community Rating Distribution

Bar chart shows how often each rating range is used across all battler evaluations. It helps users identify whether the community tends to give low, moderate, or high ratings.

---

### 🏆 Most Valued Attributes


This section lists the top 10 attributes in horizontal bar chart that receive the highest praise from the community. It helps identify which specific skills or qualities are most appreciated—such as Preparation, Wordplay, or Stage Presence.

All scores for each attribute are averaged. The attributes are then sorted by their average rating, and the top 10 are shown based on the highest community-rated attributes.

---

### 📈 Rating Trends Over Time

This line chart tracks how average ratings for different attribute categories (Writing, Performance, Personal) change month by month. It helps users understand trends in community opinions and whether perceptions are improving, declining, or remaining steady.

Ratings are grouped by both month and category. The average score is calculated for each group over the past 12 months. This reveals long-term trends in how different aspects of battler performance are rated.

---

> These features provide valuable insights into community behavior and highlight what matters most in competitive evaluations.
