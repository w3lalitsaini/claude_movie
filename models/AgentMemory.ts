import mongoose, { Schema, Document } from "mongoose";

export interface IAgentMemory extends Document {
  entityId: mongoose.Types.ObjectId; // ID of the movie or blog
  type: "movie" | "blog";
  lastAction: "create" | "update" | "delete";
  performanceScore: number;
  trendScore: number;
  context: {
    genre?: string[];
    keywords?: string[];
    lastPrompt?: string;
    trendScore?: number;
    userInterest?: number; // 0-100 derived from views/engagements
  };
  errors: string[];
  lastUpdated: Date;
}

const AgentMemorySchema = new Schema<IAgentMemory>(
  {
    entityId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["movie", "blog"], required: true },
    lastAction: { type: String, enum: ["create", "update", "delete"], required: true },
    performanceScore: { type: Number, default: 0 },
    trendScore: { type: Number, default: 0 },
    context: { type: Object, default: {} },
    errors: [{ type: String }],
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

// Index for fast lookup by entity
AgentMemorySchema.index({ entityId: 1, type: 1 });
// Index for trend-based selection
AgentMemorySchema.index({ trendScore: -1 });

export default mongoose.models.AgentMemory || mongoose.model<IAgentMemory>("AgentMemory", AgentMemorySchema);
