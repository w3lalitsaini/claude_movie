/**
 * Ultra-Agentic Manager Agent (The Sovereign Brain)
 * Role: Sovereign AI decision-making using LLM logic.
 * Decides: Create, Update, Delete based on Trends + Memory + Analytics.
 */

import AgentMemory from "@/models/AgentMemory";
import Analytics from "@/models/Analytics";
import AgentConfig from "@/models/AgentConfig";
import Revenue from "@/models/Revenue";
import { calculateTrendScore } from "../trendScore";
import { generateRoadmap } from "./strategy";
import { logAgentActivity } from "../logger";

export interface AgentTask {
  action: "create" | "update" | "delete" | "optimize";
  type: "movie" | "blog";
  payload: any;
  priority: number;
  reason: string;
}

export async function decideNextActions(): Promise<AgentTask[]> {
  // 🛡️ Global Kill-Switch Check
  const config = await AgentConfig.findOne() || await AgentConfig.create({});
  if (!config.isActive) {
    await logAgentActivity({
      agent: "manager",
      level: "warning",
      action: "system_halt",
      details: "Sovereign AI System is currently INACTIVE. Aborting all autonomous decisions.",
      reasoning: {
        thought: "System isActive flag is FALSE. Obeying human override.",
        alternatives: ["Continue anyway", "Abort", "Report error"],
        decision: "Abort",
        confidence: 1.0
      }
    });
    return [];
  }

  await logAgentActivity({
    agent: "manager",
    level: "thinking",
    action: "analyze_trends",
    details: "Analyzing TMDB trends, strategic roadmap, and user analytics for next actions.",
    reasoning: {
      thought: "Checking for high-ROI content gaps vs current trending movies.",
      alternatives: ["Priority-based creation", "Trend-based update", "Social-buzz sniping"],
      decision: "Multi-strategy cross-reference",
      confidence: 0.92
    }
  });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  // 1. Gather all inputs for the brain
  const trending = [
    { title: "Project Hail Mary", popularity: 950, releaseDate: "2026-03-20" },
    { title: "The Bride!", popularity: 820, releaseDate: "2025-10-03" }
  ];
  const roadmap = await generateRoadmap();
  const memory = await AgentMemory.find().limit(50);
  const feedback = await Analytics.find().sort({ views: -1 }).limit(20);

  // 1.1 Decisional Context: Check ROI & Goals
  const config = await AgentConfig.findOne() || await AgentConfig.create({});
  const recentRevenue = await Revenue.find().sort({ createdAt: -1 }).limit(7);
  const totalRevenue = recentRevenue.reduce((acc, r: any) => acc + r.amount, 0);
  const totalCost = 50; // Simulated cost for now
  const roi = ((totalRevenue - totalCost) / totalCost) * 100;

  let contentHunger = 5; 
  if (roi < 0) {
    contentHunger = 2; // Throttle down
    await logAgentActivity({
      agent: "manager",
      level: "warning",
      action: "roi_throttling",
      details: `ROI is negative (${roi.toFixed(2)}%). Throttling content generation to conserve budget.`,
      reasoning: {
        thought: "Profitability is low. Reducing operational burn rate.",
        alternatives: ["Continue normal", "Emergency stop", "Throttled generation"],
        decision: "Throttled generation",
        confidence: 0.95
      }
    });
  }

  // 1.2 Strategic Alignment: Check Traffic Goals
  const currentTraffic = feedback.reduce((acc, f: any) => acc + (f.views || 0), 0);
  const targetTraffic = config.goals?.trafficTarget || 100000;
  if (currentTraffic < (targetTraffic / 4)) {
    await logAgentActivity({
      agent: "manager",
      level: "info",
      action: "goal_alignment",
      details: "Traffic is behind target. Manager will prioritize high-volume discovery.",
      reasoning: {
        thought: "Traffic targets not met. Pivoting to viral/trending topics.",
        alternatives: ["Niche focus", "Quality focus", "Volume/Trend focus"],
        decision: "Volume/Trend focus",
        confidence: 0.88
      }
    });
  }

  if (!GEMINI_API_KEY) {
    console.warn("Using rule-based fallback (No GEMINI_API_KEY)");
    return [{ action: "create", type: "movie", payload: trending[0], priority: 1, reason: "Fallback rule" }];
  }

  // 2. Sovereign AI Decision Prompt
  const prompt = `You are a sovereign AI Content Manager for a movie platform.
  Decide the next ${contentHunger} most valuable actions for the platform.
  
  Weekly Strategy Roadmap: ${JSON.stringify(roadmap)}
  Trending Movies: ${JSON.stringify(trending)}
  Recent Memory: ${JSON.stringify(memory)}
  User Feedback (Analytics): ${JSON.stringify(feedback)}
  
  Guidelines:
  - Create content for high-trend movies.
  - Update content with low CTR or high bounce rate.
  - Delete or archive content with zero engagement over 30 days.
  - Optimize for monetization and user interest.
  
  Return ONLY a JSON array of tasks:
  [{ "action": "create|update|delete|optimize", "type": "movie|blog", "payload": {}, "priority": 1-5, "reason": "Detailed reasoning" }]`;

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
    console.error("AI Decision failed:", error);
    return [];
  }
}
