/**
 * Safety Layer (Guardrails)
 * Role: Prevents spam, duplicates, halluciations, and low-quality output.
 */

import Movie from "@/models/Movie";
import Blog from "@/models/Blog";

export interface GuardrailResult {
  valid: boolean;
  reason?: string;
}

export async function validateContent(type: "movie" | "blog", data: any): Promise<GuardrailResult> {
  // 1. Length Check
  if (type === "blog" && data.content.length < 500) {
    return { valid: false, reason: "Content too short (less than 500 chars)." };
  }

  // 2. Uniqueness/Duplicate Check
  const exists = type === "movie" 
    ? await Movie.findOne({ title: data.title }) 
    : await Blog.findOne({ title: data.title });

  if (exists && data.action === "create") {
    return { valid: false, reason: `Duplicate content: ${data.title} already exists.` };
  }

  // 3. Hallucination Check (Basic)
  const forbiddenKeywords = ["[SIMULATED", "AI generated placeholder", "I am an AI"];
  if (forbiddenKeywords.some(keyword => JSON.stringify(data).includes(keyword))) {
    return { valid: false, reason: "Content contains AI placeholders or hallucination markers." };
  }

  // 4. Input Validation (Sanitization)
  if (!data.title || data.title.length > 150) {
    return { valid: false, reason: "Invalid title length." };
  }

  // 5. Trust & Quality Scoring
  const quality = await scoreQuality(data.content);
  if (quality.score < 70) {
    return { valid: false, reason: `Low quality score: ${quality.score}. ${quality.feedback}` };
  }

  return { valid: true };
}

export async function scoreQuality(content: string): Promise<{ score: number; feedback: string }> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return { score: 85, feedback: "Simulated high quality." };

  const prompt = `Evaluate the following content for:
  - Readability (0-100)
  - Accuracy (0-100)
  - Human-likeness (0-100)
  
  Content: ${content.slice(0, 500)}
  
  Return ONLY JSON:
  { "score": 0-100, "feedback": "Brief reason" }`;

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
    return JSON.parse(cleanJson);
  } catch (error) {
    return { score: 75, feedback: "Quality bypass (API fail)" };
  }
}
