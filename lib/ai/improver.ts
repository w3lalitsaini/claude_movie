/**
 * Self-Improvement Engine
 * Role: Analyzes past actions and results to refine the prompt strategy.
 */

import AgentMemory from "@/models/AgentMemory";
import AgentLog from "@/models/AgentLog";

export async function analyzePerformance() {
  // 1. Fetch recent successes and failures
  const recentHistory = await AgentMemory.find().sort({ lastUpdated: -1 }).limit(20);
  const recentErrors = await AgentLog.find({ status: "error" }).sort({ timestamp: -1 }).limit(10);

  // 2. Logic to determine "What worked?"
  const highPerformers = recentHistory.filter(m => m.performanceScore > 80);
  const lowPerformers = recentHistory.filter(m => m.performanceScore < 30);

  // 3. Generate Improvement Insights
  let insights = "Current Strategy Analysis:\n";
  
  if (highPerformers.length > 0) {
    insights += `- Success patterns found in: ${highPerformers.map(m => m.context.genre).join(", ")}\n`;
  }

  if (recentErrors.length > 0) {
    insights += `- Recurring errors: ${recentErrors.map(e => e.details).join("; ")}\n`;
  }

  // 4. Update Agent Strategy (could be stored in a config collection)
  console.log("Self-Improvement Insights Generated:", insights);
  
  return insights;
}
