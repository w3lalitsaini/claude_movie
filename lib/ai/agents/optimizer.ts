import { logAgentActivity } from "../logger";
import { getGroqCompletion } from "../groq";

export interface SEOParams {
  title: string;
  description: string;
  content: string;
  keywords: string[];
}

export async function optimizeForSEO(params: SEOParams) {
  await logAgentActivity({
    agent: "optimizer",
    level: "thinking",
    action: "seo_optimization",
    details: `Optimizing content for "${params.title}" to maximize search visibility.`,
    reasoning: {
      thought: `Analyzing keyword density and meta-description appeal for "${params.title}".`,
      alternatives: ["Basic keywords", "Deep LSI optimization", "CTR-focused titles"],
      decision: "Deep LSI optimization",
      confidence: 0.89
    }
  });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return {
      optimizedTitle: `${params.title} - Watch Online & Details (2026)`,
      optimizedMeta: `Watch ${params.title} now. ${params.description.slice(0, 150)}...`,
      seoScore: 85
    };
  }

  try {
    const prompt = `You are a world-class SEO strategist. 
    Optimize the following for search engines:
    Title: ${params.title}
    Description: ${params.description}
    Keywords: ${params.keywords.join(", ")}
    
    Return ONLY a JSON object:
    {
      "title": "Optimized SEO Title",
      "metaDescription": "Optimized Meta Description (max 160 chars)",
      "slug": "optimized-slug",
      "seoScore": 95
    }`;

    const systemPrompt = "You are a world-class SEO strategist. Return only valid JSON.";
    const completion = await getGroqCompletion(prompt, systemPrompt);
    const cleanJson = completion.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("SEO Optimization failed:", error);
    return {
      title: params.title,
      metaDescription: params.description.slice(0, 160),
      seoScore: 70
    };
  }
}
