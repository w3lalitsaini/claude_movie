/**
 * Rate Limit & Cost Control System
 */

import AgentUsage from "@/models/AgentUsage";

const DAILY_TOKEN_LIMIT = 100000; // Example limit
const DAILY_COST_LIMIT = 5.0; // USD

export async function checkBudgetGuardrails(): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await AgentUsage.findOne({ date: today });
  
  if (!usage) return true;

  if (usage.tokensUsed > DAILY_TOKEN_LIMIT || usage.costEstimate > DAILY_COST_LIMIT) {
    console.error("Budget Exceeded! Agent execution halted.");
    return false;
  }

  return true;
}

export async function trackUsage(tokens: number, cost: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await AgentUsage.findOneAndUpdate(
    { date: today },
    { 
      $inc: { tokensUsed: tokens, costEstimate: cost, taskCount: 1 },
      $setOnInsert: { date: today }
    },
    { upsert: true }
  );
}
