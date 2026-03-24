/**
 * Analytics Integration
 * Role: Capture real user feedback to drive AI decisions.
 */

import Analytics from "@/models/Analytics";
import mongoose from "mongoose";

export async function trackEngagement(entityId: string, type: "movie" | "blog", metrics: { views?: number; clicks?: number; bounceRate?: number }) {
  const id = new mongoose.Types.ObjectId(entityId);
  
  const update: any = { $inc: {} };
  if (metrics.views) update.$inc.views = metrics.views;
  if (metrics.clicks) update.$inc.clicks = metrics.clicks;
  if (metrics.bounceRate) update.bounceRate = metrics.bounceRate;

  await Analytics.findOneAndUpdate(
    { entityId: id, type },
    update,
    { upsert: true, new: true }
  );

  // Recalculate CTR
  const record = await Analytics.findOne({ entityId: id });
  if (record && record.views > 0) {
    record.ctr = (record.clicks / record.views) * 100;
    await record.save();
  }
}

export async function getFeedbackData(entityId: string) {
  return await Analytics.findOne({ entityId: new mongoose.Types.ObjectId(entityId) });
}
