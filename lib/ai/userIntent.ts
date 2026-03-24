/**
 * User Intent Engine
 * Role: Categorizes user needs and adapts content layout (e.g., Verdict-First).
 */

export type UserIntentType = "information" | "decision" | "transaction" | "entertainment";

export interface UserIntent {
  type: UserIntentType;
  query: string;
  needsVerdict: boolean;
  needsPrice: boolean;
}

export async function detectIntent(query: string): Promise<UserIntent> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const prompt = `Identify the user intent for the query: "${query}"
  Return ONLY JSON:
  {
    "type": "information|decision|transaction|entertainment",
    "needsVerdict": true|false,
    "needsPrice": true|false,
    "primaryNeed": "..."
  }`;

  try {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY missing");

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
    const res = JSON.parse(cleanJson);

    return {
      type: res.type,
      query,
      needsVerdict: res.needsVerdict,
      needsPrice: res.needsPrice
    };
  } catch (error) {
    // Fallback logic
    const decisionKeywords = ["worth", "review", "should i", "verdict", "rating"];
    const needsVerdict = decisionKeywords.some(k => query.toLowerCase().includes(k));
    
    return {
      type: needsVerdict ? "decision" : "information",
      query,
      needsVerdict,
      needsPrice: query.toLowerCase().includes("buy") || query.toLowerCase().includes("watch")
    };
  }
}
