/**
 * Profit Optimizer
 * Role: Calculates ROI and throttles high-cost/low-ROI tasks.
 */

import AgentUsage from "@/models/AgentUsage";
import Movie from "@/models/Movie";
import Blog from "@/models/Blog";
import { getTotalRevenue } from "./revenue";

export async function calculateROI() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usage = await AgentUsage.findOne({ date: today });
  if (!usage) return { roi: 0, status: "stable" };

  // Use REAL revenue from the tracking system
  const revenue = await getTotalRevenue(1);

  const profit = revenue - usage.costEstimate;
  const roi = (profit / usage.costEstimate) * 100;

  let status: "aggressive" | "stable" | "throttle" = "stable";
  if (roi > 200) status = "aggressive"; // High profit: spend more on AI
  if (roi < 20) status = "throttle"; // Low profit: reduce AI complexity

  return { profit, roi, status };
}

export function getRecommendedModel(roiStatus: string): string {
  if (roiStatus === "aggressive") return "gemini-2.0-pro-exp"; // Best quality
  if (roiStatus === "throttle") return "gemini-2.0-flash-lite"; // Cheapest
  return "gemini-2.0-flash"; // Balanced
}
