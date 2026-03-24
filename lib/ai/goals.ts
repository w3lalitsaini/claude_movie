/**
 * Business Goals Layer
 * Role: Definitive targets that drive all AI decisions.
 */

export interface BusinessGoals {
  targetTraffic: number; // monthly views
  targetRevenue: number; // monthly USD
  nicheFocus: string;
  maxCostPerTask: number;
}

export const PLATFORM_GOALS: BusinessGoals = {
  targetTraffic: 100000,
  targetRevenue: 1000,
  nicheFocus: "Bollywood + OTT + Hollywood Blocks",
  maxCostPerTask: 0.50
};

export function evaluateAgainstGoals(stats: any): number {
  const trafficProgress = (stats.traffic / PLATFORM_GOALS.targetTraffic) * 100;
  const revenueProgress = (stats.revenue / PLATFORM_GOALS.targetRevenue) * 100;
  
  // Return a "Hunger Score" (0-100)
  // Higher = System needs to work harder/more aggressively
  return Math.max(0, 100 - (trafficProgress + revenueProgress) / 2);
}
