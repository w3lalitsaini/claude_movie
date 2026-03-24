import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  entityId: mongoose.Types.ObjectId;
  type: "movie" | "blog";
  views: number;
  clicks: number;
  ctr: number;
  bounceRate: number; // 0-100
  avgTimeOnPage: number; // seconds
  lastUpdated: Date;
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    entityId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["movie", "blog"], required: true },
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    avgTimeOnPage: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

AnalyticsSchema.index({ entityId: 1, type: 1 });
AnalyticsSchema.index({ views: -1 });

export default mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
