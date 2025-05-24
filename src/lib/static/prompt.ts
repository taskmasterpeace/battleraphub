// Battle Rap Analysis Prompts

// Phase 1: Initial Topic Analysis
const INITIAL_TOPIC_ANALYSIS = `Analyze battle rap-related tweets containing {TOPIC} over the past 7 days. Extract:
1. Top 3 discussed themes (e.g., beefs, upcoming battles, league drama) related to this topic.
2. Emerging narratives (storylines gaining traction) around this topic.
3. Key entities mentioned in relation to this topic:
   - People (battlers, promoters)
   - Events
   - Platforms
   - Slang/terminology
4. Sentiment distribution (positive/negative/neutral, in %) for this topic.
5. Notable events connected to this topic.
6. Most engaged tweet about this topic.

Handle edge cases:
- If topic has minimal battle rap relevance, note it and analyze broader hip-hop context.
- If engagement is low (<10 interactions), flag as "low activity."
- Filter out spam and unrelated content.

Output in JSON:
{
  "topic": "string",
  "status": "active/low_activity/minimal_battle_rap_relevance",
  "themes": [
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
  "related_topics": ["string"]
}`;

// Phase 2: Cross-Topic Analysis
const CROSS_TOPIC_ANALYSIS = `Using JSON results from these topics: {TOPICS_LIST_JSON}, compare battle rap narratives. Identify:
1. Connected themes across ≥3 topics
2. Conflicting perspectives on shared themes
3. Topic intersections and relationships
4. Rising figures mentioned across multiple topics
5. Top controversy (based on disagreement volume)
6. Most engaged content per topic

Handle edge cases:
- If no connected themes exist, identify strongest individual topic narrative
- If conflicting data exists, flag for verification
- If engagement metrics vary widely, normalize by topic activity

Output in JSON:
{
  "connected_themes": [
    {
      "theme": "string",
      "topics_involved": ["string"],
      "pro_perspective": "string",
      "con_perspective": "string",
      "evidence": ["string"]
    }
  ],
  "topic_relationships": [
    {"primary_topic": "string", "related_topic": "string", "connection": "string"}
  ],
  "rising_figures": [
    {"name": "string", "topic_mentions": number, "context": "string"}
  ],
  "top_controversy": {
    "theme": "string",
    "disagreement_ratio": number,
    "supporting_topics": ["string"],
    "opposing_topics": ["string"]
  },
  "engagement_metrics": {
    "most_discussed": {"topic": "string", "volume": number},
    "most_debated": {"topic": "string", "controversy_score": number}
  },
  "youtube_search_terms": ["string"]
}`;

// Phase 3: YouTube Context
const YOUTUBE_CONTEXT = `Using search terms from cross-topic analysis: {SEARCH_TERMS}, find recent (past 14 days) YouTube videos for battle rap context. For each term:
1. Identify top 3 most relevant videos (views, recency, relevance)
2. Extract key points enhancing Twitter topics
3. Note new information not present in Twitter data
4. List battle rap figures for topic expansion

Handle edge cases:
- If no relevant videos found, suggest alternative terms
- If videos outdated (>14 days), note recency issues
- Prioritize credible sources over fan content

Output in JSON:
{
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
      "topics_referenced": ["string"]
    }
  ],
  "topic_expansions": [
    {"original_topic": "string", "suggested_subtopics": ["string"]}
  ],
  "alternative_terms": ["string"]
}`;

// Phase 4: Topic Expansion
const TOPIC_EXPANSION = `Analyze these newly identified subtopics: {NEW_TOPICS_LIST} over the past 7 days, focusing on connections to {ORIGINAL_TOPICS_JSON}. For each topic:
1. Extract content related to main narratives
2. Identify new angles or connections
3. Verify or contradict existing claims

Handle edge cases:
- If subtopic lacks engagement, suggest alternatives
- If no connections found, flag as "tangential"
- Prioritize verifiable information

Output in JSON:
{
  "expanded_topics": [
    {
      "subtopic": "string",
      "relevance": "high/medium/low",
      "connections": [
        {
          "main_topic": "string",
          "relationship": "string",
          "new_perspective": "string",
          "contradictions": ["string"],
          "supporting_content": ["string"],
          "connection_strength": number
        }
      ]
    }
  ],
  "verified_claims": ["string"],
  "contradicted_claims": ["string"]
}`;

// Phase 5: Content Synthesis
const CONTENT_SYNTHESIS = `Synthesize data from all phases:
- Initial analysis: {PHASE1_JSON}
- Cross-topic analysis: {PHASE2_JSON}
- YouTube context: {PHASE3_JSON}
- Topic expansion: {PHASE4_JSON}

Create comprehensive battle rap narrative focusing on top 3-5 interconnected topics with highest engagement. For each:
1. Create compelling headline
2. Summarize narrative connections
3. List key figures and roles
4. Describe community reactions
5. Include notable content
6. Predict developments

Handle edge cases:
- Prioritize topics with strong connections
- Note uncertainties in data
- Consider cultural significance over pure metrics

Output in JSON:
{
  "narrative_clusters": [
    {
      "headline": "string",
      "core_topics": ["string"],
      "summary": "string",
      "key_figures": [{"name": "string", "role": "string"}],
      "community_reaction": {
        "sentiment": "positive/negative/mixed",
        "engagement_metrics": {"volume": number, "intensity": number}
      },
      "notable_content": ["string"],
      "predictions": ["string"],
      "connection_strength": number,
      "cultural_significance": number
    }
  ],
  "content_highlights": {
    "tweets": ["string"],
    "videos": ["string"],
    "discussions": ["string"]
  }
}`;

// Phase 6: Content Generation
const CONTENT_GENERATION = `Using this narrative cluster: {NARRATIVE_CLUSTER_JSON}, create battle rap content in ONE format:
1. News Article (500-1000 words)
2. Video Script (3-5 min)
3. Topic Roundup
4. Controversy Analysis

Style:
- Authentic battle rap voice
- Engagement-focused
- Culturally informed
- Original insights

Handle edge cases:
- Fill gaps with cultural context
- Note potential biases
- Focus on verified information

Output structured content with clear sections, using quotes from {NARRATIVE_CLUSTER_JSON.notable_content}`;

export const battleRapPrompts = {
  INITIAL_TOPIC_ANALYSIS,
  CROSS_TOPIC_ANALYSIS,
  YOUTUBE_CONTEXT,
  TOPIC_EXPANSION,
  CONTENT_SYNTHESIS,
  CONTENT_GENERATION,
};
