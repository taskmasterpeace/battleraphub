import { ChatOpenAI } from "@langchain/openai";
import { AIMessageChunk, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getVideoFromYoutubeTopic, getVideoTranscript, getUserTweetsByUserName } from "./utils";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { getKey } from "@/lib/kv";

export class NewsAggregatorAgent {
  model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      apiKey: process.env.REQUESTY_API_KEY!,
      model: "openai/gpt-4o-mini",
      configuration: {
        baseURL: "https://router.requesty.ai/v1",
      },
    });
  }

  async getPrompt(key: string): Promise<string> {
    return await getKey(`news:${key}`);
  }

  async summarizeLargeText(text: string): Promise<string> {
    const chatFinalPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `You are an expert in summarizing YouTube videos.
        Your goal is to create a summary of a video.`,
      ),
      HumanMessagePromptTemplate.fromTemplate("Here's transcript of the video: {transcript}."),
    ]);

    const promptValue = await chatFinalPrompt.invoke({
      transcript: text,
    });

    const response = await this.model.invoke(promptValue);
    return response.content as string;
  }

  extractJson = (output: AIMessageChunk): unknown => {
    const text = output.content as string;
    // Define the regular expression pattern to match JSON blocks
    // const pattern = /```json\s*(.*?)\s*```/gs; // this give ES 2018 error
    const pattern = /```json\s*([\s\S]*?)\s*```/g;
    const matches = text.match(pattern);
    if (matches) {
      return matches.map((match) => JSON.parse(match.replace(/```json|```/g, "")));
    }
    return null;
  };

  async analyzeXAccount(account: string) {
    console.log(`Phase 1: Analyzing X Account "${account}"...`);
    // Get recent tweets about the topic
    const tweets = await getUserTweetsByUserName(account);

    const prompt = await this.getPrompt("TWITTER_ACCOUNT_ANALYSIS");

    // Analyze tweets using the initial topic prompt
    const response = await this.model.invoke([
      new SystemMessage("You are a battle rap analysis expert."),
      new SystemMessage(prompt.replace("{ACCOUNT_NAME}", account)),
      new HumanMessage(`Here are the latest tweets from ${account}: ${JSON.stringify(tweets)}`),
    ]);
    const json = this.extractJson(response);
    console.log(`Phase 1: ${account}`, json);
    return json;
  }

  async crossAccountAnalysis(accountsData: unknown[]): Promise<{ [key: string]: unknown }> {
    console.log("Phase 2: Cross-account analysis...");

    const prompt = await this.getPrompt("CROSS_ACCOUNT_ANALYSIS");

    const response = await this.model.invoke([
      new SystemMessage("You are a battle rap analysis expert."),
      new HumanMessage(prompt.replace("{ACCOUNT_LIST_JSON}", JSON.stringify(accountsData))),
    ]);
    const json = this.extractJson(response);
    console.log("Phase 2: ", json);

    return json as { [key: string]: unknown };
  }

  async getYoutubeContext(searchTerms: string[]): Promise<{ [key: string]: unknown }> {
    console.log("Phase 3: YouTube context analysis...", searchTerms);

    // Get videos for each search term
    const videosPromises = searchTerms.map((term) =>
      getVideoFromYoutubeTopic(term, process.env.YOUTUBE_API_KEY!),
    );
    const videos = await Promise.all(videosPromises);

    // Get transcripts for each video
    const transcriptsPromises = videos.flat().map(async (video) => ({
      ...video,
      transcript: await getVideoTranscript(video.id.videoId),
    }));
    const videosWithTranscripts = await Promise.all(transcriptsPromises);

    // Summarize each video transcript and replace it with transcript
    const summarizedVideos = await Promise.all(
      videosWithTranscripts
        .filter((video) => video.transcript)
        .map(async (video) => ({
          ...video,
          transcript: await this.summarizeLargeText(video.transcript),
        })),
    );

    console.log("Phase 3: Summarized videos: ", summarizedVideos.length);

    const prompt = await this.getPrompt("YOUTUBE_CONTEXT_EXPANSION");

    // Analyze videos using the YouTube context prompt
    const response = await this.model.invoke([
      new SystemMessage("You are a battle rap analysis expert."),
      new HumanMessage(prompt.replace("{SEARCH_TERMS}", JSON.stringify(searchTerms))),
      new HumanMessage(
        `These are the videos for search terms: ${JSON.stringify(searchTerms)}: ${JSON.stringify(summarizedVideos)}`,
      ),
    ]);
    const json = this.extractJson(response);
    console.log("Phase 3: YouTube context analysis", json);
    return json as { [key: string]: unknown };
  }

  async additionalAccountAnalysis(
    newTopics: unknown[],
    originalTopics: unknown[],
  ): Promise<{ [key: string]: unknown }> {
    console.log("Phase 4: Additional Account Analysis...");

    const prompt = await this.getPrompt("ADDITIONAL_ACCOUNT_ANALYSIS");
    const response = await this.model.invoke([
      new SystemMessage("You are a battle rap analysis expert."),
      new HumanMessage(
        prompt
          .replace("{NEW_FIGURES_LIST}", JSON.stringify(newTopics))
          .replace("{ONGOING_STORIES_JSON}", JSON.stringify(originalTopics)),
      ),
    ]);
    console.log("Phase 4: Additional Account Analysis", response.content);
    const json = this.extractJson(response);
    console.log("Phase 4: Additional Account Analysis", json);
    return json as { [key: string]: unknown };
  }

  async storylineConsolidation(
    phase1Data: unknown[],
    phase2Data: unknown,
    phase3Data: unknown,
    phase4Data: unknown,
  ): Promise<{ [key: string]: unknown }> {
    console.log("Phase 5: Storyline Consolidation...");

    const prompt = await this.getPrompt("STORYLINE_CONSOLIDATION");
    const response = await this.model.invoke([
      new SystemMessage("You are a battle rap analysis expert."),
      new HumanMessage(
        prompt
          .replace("{PHASE1_JSON}", JSON.stringify(phase1Data))
          .replace("{PHASE2_JSON}", JSON.stringify(phase2Data))
          .replace("{PHASE3_JSON}", JSON.stringify(phase3Data))
          .replace("{PHASE4_JSON}", JSON.stringify(phase4Data)),
      ),
    ]);
    const json = this.extractJson(response);
    console.log("Phase 5: Storyline Consolidation", json);
    return json as { [key: string]: unknown };
  }

  async generateContent(narrativeCluster: unknown): Promise<{ [key: string]: unknown }> {
    console.log("Phase 6: Content generation...");

    const prompt = await this.getPrompt("CONTENT_GENERATION");
    const response = await this.model.invoke([
      new SystemMessage("You are a battle rap analysis expert."),
      new HumanMessage(prompt.replace("{TOP_STORYLINE_JSON}", JSON.stringify(narrativeCluster))),
    ]);
    const json = this.extractJson(response);
    console.log("Phase 6: Content generation", json);
    return json as { [key: string]: unknown };
  }

  async analyzeTopics(xAccounts: string[]): Promise<{ [key: string]: unknown }> {
    try {
      // Phase 1: Initial Analysis
      const initialAnalyses = await Promise.all(
        xAccounts.map((account) => this.analyzeXAccount(account)),
      );

      // Phase 2: Cross-Topic Analysis
      const crossAccountAnalysis = await this.crossAccountAnalysis(initialAnalyses);

      // Phase 3: YouTube Context
      const youtubeAnalysis = await this.getYoutubeContext(
        crossAccountAnalysis.youtube_search_terms as string[],
      );

      // Phase 4: Topic Expansion
      const expandedTopics = await this.additionalAccountAnalysis(
        Array(youtubeAnalysis)
          .map((t) => t.alternative_terms)
          .flat(),
        xAccounts,
      );

      // Phase 5: Storyline Consolidation
      const storylineConsolidation = await this.storylineConsolidation(
        initialAnalyses,
        crossAccountAnalysis,
        youtubeAnalysis,
        expandedTopics,
      );

      // // Phase 6: Content Generation
      const content = await this.generateContent(storylineConsolidation?.top_storylines);
      return content;
    } catch (error) {
      console.error("Error in battle rap analysis:", error);
      throw error;
    }
  }
}
