import mongoose, { Schema, Document } from "mongoose";

export interface IKnowledge extends Document {
  category: "keyword" | "genre" | "style";
  key: string; // e.g. "Bollywood Horror"
  performanceScore: number; // 0-100
  conversionRate: number;
  lastSuccessfulUse: Date;
  metadata: any;
}

const KnowledgeSchema = new Schema<IKnowledge>(
  {
    category: { type: String, enum: ["keyword", "genre", "style"], required: true },
    key: { type: String, required: true },
    performanceScore: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    lastSuccessfulUse: { type: Date, default: Date.now },
    metadata: { type: Object, default: {} },
  }
);

KnowledgeSchema.index({ category: 1, key: 1 });
KnowledgeSchema.index({ performanceScore: -1 });

export default mongoose.models.Knowledge || mongoose.model<IKnowledge>("Knowledge", KnowledgeSchema);
