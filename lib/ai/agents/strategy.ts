/**
 * Long-Term Strategy Agent
 * Role: Weekly roadmaps, trend prediction, and high-level content vision.
 */

import AgentLog from "@/models/AgentLog";

export async function generateRoadmap() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const prompt = `You are a cinematic content strategist for a movie platform.
  Create a 7-day roadmap for our AI agents to follow.
  Focus on:
  - Upcoming blockbuster releases (e.g. Project Hail Mary).
  - High-traffic genres (Sci-Fi, Bollywood Drama, South Indian Action).
  - Monetization opportunities.
  
  Return a structured JSON roadmap:
  {
    "week": "2026-03-24 to 2026-03-31",
    "focus": "Sci-Fi Spring Event",
    "tasks": ["Daily blog on Project Hail Mary", "Update 10 older sci-fi reviews", "Increase monetization CTAs"],
    "prediction": "Search volume for 'Ryan Gosling Sci-Fi' will spike by 40% next week."
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
    const roadmap = JSON.parse(cleanJson);

    await AgentLog.create({
      action: "strategy_roadmap",
      status: "success",
      details: `Weekly roadmap generated: ${roadmap.focus}. Prediction: ${roadmap.prediction}`
    });

    return roadmap;
  } catch (error: any) {
    console.error("Strategy generation failed:", error);
    return null;
  }
}
