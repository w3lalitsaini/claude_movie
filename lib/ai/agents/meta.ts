/**
 * Meta Agent (The God Agent)
 * Role: Monitors ALL agents, improves prompts, and optimizes system efficiency.
 */

import AgentLog from "@/models/AgentLog";
import AgentUsage from "@/models/AgentUsage";
import { logAgentActivity } from "../logger";

export async function optimizeSystem() {
  await logAgentActivity({
    agent: "meta",
    level: "thinking",
    action: "system_audit",
    details: "Analyzing agent performance logs and cost usage for prompt optimization."
  });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return;

  const logs = await AgentLog.find().sort({ timestamp: -1 }).limit(10);
  const usage = await AgentUsage.find().sort({ date: -1 }).limit(7);

  const prompt = `You are a Meta-Optimization AI (The God Agent).
  Analyze the performance of the following agents:
  Logs: ${JSON.stringify(logs)}
  Usage/Cost: ${JSON.stringify(usage)}
  
  Identify:
  - Bottlenecks in the current workflow.
  - Cost-heavy agents with low output quality.
  - Failed tasks and their patterns.
  
  Suggest 3 specific prompt improvements or logic adjustments.
  Return ONLY a JSON response:
  {
    "bottlenecks": [],
    "promptImprovements": [{ "agent": "writer", "newInstruction": "..." }],
    "systemHealth": 0-100
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
    const optimization = JSON.parse(cleanJson);

    await AgentLog.create({
      action: "meta_optimization",
      status: "success",
      details: `System Health: ${optimization.systemHealth}%. Prompt improvements suggested for: ${optimization.promptImprovements.map((i: any) => i.agent).join(", ")}`
    });

    // 5. SELF-EVOLUTION: Actually update the prompt config
    for (const imp of optimization.promptImprovements) {
      await updatePromptConfig(imp.agent, imp.newInstruction);
    }

    return optimization;
  } catch (error) {
    console.error("Meta-Optimization failed:", error);
    return null;
  }
}

async function updatePromptConfig(agent: string, instruction: string) {
  console.log(`🧠 Self-Evolution: Updating instructions for ${agent} agent.`);
  // In a real DB, this would update a 'Config' or 'Prompt' collection
}
