/**
 * Revenue Tracking Helper
 * Role: Standardized interface for logging real income.
 */

import Revenue from "@/models/Revenue";
import mongoose from "mongoose";

export async function logRevenue(amount: number, source: "adsense" | "amazon" | "ott_affiliate" | "sponsorship", entityId?: string) {
  await Revenue.create({
    amount,
    source,
    entityId: entityId ? new mongoose.Types.ObjectId(entityId) : undefined,
    timestamp: new Date()
  });
  
  console.log(`💰 Revenue Logged: $${amount} from ${source}`);
}

export async function getTotalRevenue(days: number = 1) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const records = await Revenue.find({ timestamp: { $gte: since } });
  return records.reduce((acc, curr) => acc + curr.amount, 0);
}
