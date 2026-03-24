/**
 * Writer Agent
 * Role: Generates engaging, high-quality reviews and blogs using Gemini LLM.
 */

import { logAgentActivity } from "../logger";
import { getGroqCompletion } from "../groq";

export interface WritingParams {
  type: "review" | "blog";
  topic: string;
  context: any;
}

export async function generateContent(params: WritingParams): Promise<string> {
  await logAgentActivity({
    agent: "writer",
    level: "thinking",
    action: "generate_text",
    details: `Crafting high-engagement SEO ${params.type} for ${params.topic}.`,
    reasoning: {
      thought: `Parsing context for ${params.topic} to generate a unique, high-CTR narrative.`,
      alternatives: ["Standard summary", "Opinionated review", "Fact-based blog"],
      decision: params.type === "review" ? "Opinionated review" : "Fact-based blog",
      confidence: 0.91
    }
  });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return `[SIMULATED ${params.type.toUpperCase()}] This is a high-quality ${params.type} for ${params.topic}. 
    In the vast landscape of cinema, ${params.topic} stands out as a remarkable achievement. 
    The storytelling is nuanced, and the visual direction is impeccable. 
    (Add GEMINI_API_KEY to see real AI generation)`;
  }

  try {
    const prompt = `You are a senior professional movie critic and blogger. 
    Write a ${params.type} for the movie: ${params.topic}.
    Context: ${JSON.stringify(params.context)}
    
    Guidelines:
    - Use HTML tags for structure (h2, p, strong).
    - Be engaging, opinionated, and insightful.
    - Optimize for reader retention.
    - Length: 500-800 words.`;

    const systemPrompt = "You are a senior professional movie critic and blogger. Return content with HTML tags.";
    const content = await getGroqCompletion(prompt, systemPrompt);
    return content;
  } catch (error) {
    console.error("Groq Generation failed:", error);
    return "Fallback content: Failed to generate via AI.";
  }
}
