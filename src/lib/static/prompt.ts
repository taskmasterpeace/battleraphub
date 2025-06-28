const TWITTER_ACCOUNT_ANALYSIS = `
Analyze tweets from @{ACCOUNT_NAME} over the past 7 days, focusing on battle rap-related content. Extract:
1. Top 3 discussed topics/themes (e.g., beefs, upcoming battles, league drama).
2. Emerging narratives (storylines gaining traction, e.g., new rivalries).
3. Recurring entities (people, events, platforms, slang).
4. Sentiment ratio (positive/negative/neutral, in %).
5. Notable events (battles, diss tracks, announcements).
6. Most engaged tweet (based on likes + retweets).
Handle edge cases:
- If no battle rap content is found, note it and prioritize general hip-hop context.
- If engagement is low (<10 interactions), flag it as "low activity."
- Ignore spam or unrelated personal tweets (e.g., food posts, unrelated promotions).
Output in JSON:
{
  "account": "@{ACCOUNT_NAME}",
  "status": "active/low_activity/no_battle_rap_content",
  "topics": [
    {"theme": "string", "example_tweet": "string", "mention_count": number}
  ],
  "narratives": ["string"],
  "entities": {
    "people": ["string"],
    "events": ["string"],
    "platforms": ["string"],
    "slang": ["string"]
  },
  "sentiment": {"positive": number, "negative": number, "neutral": number},
  "events": ["string"],
  "top_tweet": {"text": "string", "likes": number, "retweets": number, "replies": number},
  "continuing_narratives": ["string"]
}
`;

const CROSS_ACCOUNT_ANALYSIS = `
Using JSON results from these accounts: {ACCOUNT_LIST_JSON}, compare battle rap narratives. Identify:
1. Shared topics across ≥3 accounts.
2. Conflicting perspectives on shared topics (e.g., differing views on a battle outcome).
3. Direct interactions (mentions, replies, or beefs between accounts).
4. Rising figures mentioned in ≥30% of accounts.
5. Top controversy (based on disagreement volume).
6. Most engaged content (likes, retweets, replies).
Handle edge cases:
- If no shared topics exist, identify the most prominent single-account storyline.
- If conflicting data arises (e.g., contradictory event details), flag for further verification.
- If engagement metrics are skewed (e.g., one viral tweet), normalize by account activity level.
Output in JSON:
{
  "shared_topics": [
    {
      "topic": "string",
      "accounts_involved": ["string"],
      "pro_perspective": "string",
      "con_perspective": "string",
      "evidence": ["string"]
    }
  ],
  "interactions": [
    {"type": "mention/reply/beef", "accounts": ["string"], "context": "string"}
  ],
  "rising_figures": [
    {"name": "string", "mention_count": number, "context": "string"}
  ],
  "top_controversy": {
    "topic": "string",
    "disagreement_ratio": number,
    "accounts_pro": ["string"],
    "accounts_con": ["string"]
  },
  "top_engagement": {
    "most_liked": {"text": "string", "account": "string", "likes": number},
    "most_retweeted": {"text": "string", "account": "string", "retweets": number},
    "most_replied": {"text": "string", "account": "string", "replies": number}
  },
  "ongoing_stories": [
    {
      "headline": "string",
      "summary": "string",
      "key_accounts": ["string"],
      "continuity_score": number (1-10)
    }
  ],
  "youtube_search_terms": ["string"]
}
`;

const YOUTUBE_CONTEXT_EXPANSION = `
Using search terms from cross-account analysis: {SEARCH_TERMS}, find recent (past 14 days) YouTube videos for battle rap context. For each term:
1. Identify the top 3 most relevant videos (based on views, recency, and relevance).
2. Extract key points that enhance Twitter narratives.
3. Note new information not present in Twitter data.
4. List battle rap figures mentioned for further Twitter tracking.
Handle edge cases:
- If no relevant videos are found, suggest alternative search terms.
- If videos are outdated (>14 days), note recency issues.
- If content is low-quality (e.g., fan rants with no substance), prioritize credible sources (e.g., league channels, established media).
Output in JSON:
[{
  "search_term": "string",
  "videos": [
    {
      "title": "string",
      "channel": "string",
      "url": "string",
      "publish_date": "string",
      "key_points": ["string"],
      "new_information": ["string"],
      "timestamps": [{"time": "mm:ss", "description": "string"}],
      "credibility": "high/medium/low",
      "figures_mentioned": ["string"]
    }
  ],
  "new_figures": [
    {"name": "string", "context": "string", "likely_twitter_handle": "string"}
  ],
  "expanded_context": "string",
  "alternative_terms": ["string"] (if no relevant videos found)
}]
`;

const ADDITIONAL_ACCOUNT_ANALYSIS = `
Analyze tweets from these new battle rap figures: {NEW_FIGURES_LIST} over the past 7 days, focusing on storylines from {ONGOING_STORIES_JSON}. For each account:
1. Extract content related to identified narratives.
2. Identify new perspectives or connections to existing storylines.
3. Verify or contradict claims from Twitter/YouTube data.
Handle edge cases:
- If accounts are inactive, note it and suggest alternative figures.
- If no storyline connections are found, flag as “low relevance.”
- If contradictory claims arise, prioritize verifiable evidence (e.g., official announcements).
Output in JSON:
{
  "accounts_analyzed": [
    {
      "account": "string",
      "status": "active/inactive/low_relevance",
      "storyline_connections": [
        {
          "storyline": "string",
          "contribution": "string",
          "new_perspective": "string",
          "contradictions": ["string"],
          "supporting_tweets": ["string"],
          "continuity_strength": number (1-10)
        }
      ]
    }
  ],
  "new_figures_to_track": ["string"],
  "verified_claims": ["string"],
  "contradicted_claims": ["string"]
}
`;

const STORYLINE_CONSOLIDATION = `
Consolidate data from:
- Initial Twitter analysis: {PHASE1_JSON}
- Cross-account analysis: {PHASE2_JSON}
- YouTube context: {PHASE3_JSON}
- Additional Twitter insights: {PHASE4_JSON}
Identify the top 3-5 battle rap storylines with the highest continuity and engagement. For each:
1. Craft a fan-grabbing headline.
2. Summarize the narrative arc.
3. List key figures and their roles.
4. Describe community reactions (sentiment, engagement).
5. Include notable quotes/tweets.
6. Predict future developments.
Handle edge cases:
- If storylines lack continuity, prioritize engagement-driven stories.
- If data is contradictory, highlight uncertainty and suggest follow-up analysis.
- If engagement is low, focus on niche but culturally significant narratives.
Output in JSON:
{
  "top_storylines": [
    {
      "headline": "string",
      "summary": "string",
      "key_figures": [
        {"name": "string", "role": "string"}
      ],
      "community_reaction": {
        "sentiment": "positive/negative/mixed",
        "engagement_metrics": {"likes": number, "retweets": number, "views": number}
      },
      "quotes": ["string"],
      "predictions": ["string"],
      "continuity_score": number (1-10),
      "engagement_score": number (1-10),
      "sources": {
        "tweets": ["string"],
        "videos": ["string"]
      }
    }
  ],
  "top_engagement": {
    "tweet": {"text": "string", "account": "string", "metrics": {}},
    "video": {"title": "string", "channel": "string", "url": "string"}
  }
}
`;

export const CONTENT_GENERATION = `
Using this storyline: {TOP_STORYLINE_JSON}, create compelling battle rap content in ONE of these formats:
1. News Article (500-1000 words): Attention-grabbing headline, hook, background, perspectives, cultural significance, forward-looking conclusion.
2. Video Script (3-5 min): Conversational dialogue for a Battle Rap News Show, with segment breaks and timestamps.
3. Weekly Roundup: Bullet-point format with commentary on top stories.
4. Controversy Breakdown: Deep dive into a specific conflict, balancing multiple perspectives.
Style:
- Authentic battle rap voice (e.g., use terms like “bars,” “body bag,” “punchline”).
- Slightly provocative to spark fan engagement.
- Knowledgeable, referencing battle rap history and culture.
- Include “Battle Rap Hub Exclusive” insight (e.g., unique prediction or insider angle).
Handle edge cases:
- If data is sparse, extrapolate based on cultural trends.
- If perspectives are one-sided, note potential bias.
- If no recent battles are tied to the storyline, focus on verbal beefs or announcements.
Give Output in JSON format:
[{
  "reading_time": string,                     // Estimated reading time
  "headline": string,                         // A compelling title summarizing the event impact
  "blurb": string,                            // A short summary of the article 
  "published_at": string (ISO date),
  "event_date": string (ISO date),            // Date of the event
  "tags": string[],                           // 3 descriptive tags like "Innovation", "Community Impact"
  "main_content": string,                     // Main content of the article (500-1000 words) in html format  
                                              // please only use h2, h3 and p tags so it can have a proper heading and paragraphs, please don't use /n
}]
`;

export const newsPrompts = {
  TWITTER_ACCOUNT_ANALYSIS,
  CROSS_ACCOUNT_ANALYSIS,
  ADDITIONAL_ACCOUNT_ANALYSIS,
  YOUTUBE_CONTEXT_EXPANSION,
  STORYLINE_CONSOLIDATION,
  CONTENT_GENERATION,
};
