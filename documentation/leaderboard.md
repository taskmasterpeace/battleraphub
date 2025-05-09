# Community Leaderboard Documentation

Welcome to the **Community Leaderboard** — a live dashboard showing the top contributors, raters, and reviewers in the platform. This page promotes transparency, reliability, and engagement in the battle rating ecosystem.

---

## ✨ What is the Leaderboard?

The Leaderboard is a ranked list of community members based on their activity, rating consistency, and alignment with community consensus. It gives recognition to active and reliable users and helps others find trustworthy raters.

---

## 📊 Community Stats (Top Panel)

### **Total Users**

Number of registered users in the community.

### **Total Ratings**

Sum of all ratings submitted by users.

### **Average Rating**

Community-wide average rating across all battlers and attributes.

### **Active Users**

Number of users who submitted at least one rating in the last 30 days.

### **Most Active User Roles**

Distribution of ratings by user roles: Media, Fan, or Battler.

### **Rating Distribution**

Histogram showing how many ratings fall into different scoring brackets (e.g., 1-2, 3-4, ..., 9-10).

---

## 🏆 Highlighted Metrics (Right Panel)

### **Most Consistent Ratings**

* **What it means:** This user gives steady, predictable scores without erratic shifts.
* **How it’s calculated:** We compute the **standard deviation** of the user's scores across all rated battlers.
* **Lower = more consistent**.

#### Example:

User A rates \[8, 8, 9] → stddev = 0.47
User B rates \[1, 5, 10] → stddev = 3.68
User A is more consistent.

### **Most Active Reviewer**

* **What it means:** The user who rated the most battlers in the last 30 days.
* **Why it matters:** Indicates recent activity and contribution volume.

### **Community Influencer**

* **What it means:** This user gives ratings that closely match the **community average**.
* **How it’s calculated:** For each rating:

  * Compute absolute difference between user's score and the average rating for that battler-attribute pair.
  * Average these differences. Lower = more influenced/aligned.

#### Example:

| Battler                                                  | User Score | Community Avg | Diff |
| -------------------------------------------------------- | ---------- | ------------- | ---- |
| A                                                        | 8          | 7.8           | 0.2  |
| B                                                        | 7          | 7.3           | 0.3  |
| C                                                        | 9          | 9.0           | 0.0  |
| Avg diff = (0.2 + 0.3 + 0.0) / 3 = 0.17 (highly aligned) |            |               |      |

---

## 📊 User Leaderboard (Bottom Panel)

This section contains **top contributors** based on different filters:

### **Tabs:**

* **Overall**: Sorted by combination of activity and influence.
* **Consistency**: Sorted by lowest standard deviation (most consistent raters).
* **Influence**: Sorted by lowest avg diff from community (most community-aligned).

### **Columns:**

* Rank
* Username and handle
* Number of Ratings submitted

---

## 🔧 How to Use This Page

* **Find reliable reviewers**: Use the Consistency and Influence tabs to find trustworthy users.
* **Spot active community members**: Use "Most Active" and "Top Raters" to find people contributing recently.
* **Benchmark yourself**: Understand how your ratings compare to others. Aim to be more consistent and accurate.
* **Community trust**: Follow raters with high accuracy and alignment to increase trust in the platform.

---

## 🚀 How to Improve Your Scores

* Be thoughtful: Avoid rating in a rush or with bias.
* Stay informed: Watch battles or read transcripts before rating.
* Aim for objectivity: Rate based on content, not popularity.
* Be active: Rate more battlers to increase your impact.

---

## ✉️ Questions or Feedback?

Contact support or reach out in the community forum to report issues or suggest features for the leaderboard.

---

Stay fair. Stay sharp. Help build a more accurate and community-driven battle rating system.

---

**Last Updated:** May 2025
