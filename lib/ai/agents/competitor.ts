/**
 * Competitor Intelligence Agent
 * Role: Identifies content gaps and trending topics from rivals.
 */

import AgentLog from "@/models/AgentLog";
import Knowledge from "@/models/Knowledge";

export async function analyzeCompetitors() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return;

  const competitors = ["IMDb", "Rotten Tomatoes", "Pinkvilla", "Koimoi"];
  
  const prompt = `You are a Competitor Intelligence AI.
  Analyze the top trending pages on the following entertainment sites: ${competitors.join(", ")}.
  (Simulated search: Focus on Bollywood + OTT genres for March 2026).
  
  Identify:
  - Viral topics they are currently ranking for.
  - REVERSE ENGINEER keywords that are driving their traffic.
  - 2 Content gaps we can "SNIPE" (better quality + faster update).
  
  Return ONLY a JSON response:
  {
    "trendingTopics": [],
    "snipableKeywords": ["..."],
    "opportunity": "...",
    "competitorRankings": { "movie_name": 1-10 }
  }`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const cleanJson = resultText.replace(/```json|```/g, "").trim();
    const intel = JSON.parse(cleanJson);

    // Store in long-term knowledge
    for (const keyword of intel.suggestedKeywords) {
      await Knowledge.findOneAndUpdate(
        { category: "keyword", key: keyword },
        { $inc: { performanceScore: 10 }, $set: { metadata: { source: "competitor_intel" } } },
        { upsert: true }
      );
    }

    await AgentLog.create({
      action: "competitor_analysis",
      status: "success",
      details: `Discovered opportunity: ${intel.opportunity}. Tracking ${intel.suggestedKeywords.length} new keywords.`
    });

    return intel;
  } catch (error) {
    console.error("Competitor Analysis failed:", error);
    return null;
  }
}
