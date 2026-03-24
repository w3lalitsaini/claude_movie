import mongoose, { Schema, Document } from "mongoose";

export interface IAgentUsage extends Document {
  date: Date;
  tokensUsed: number;
  costEstimate: number;
  taskCount: number;
}

const AgentUsageSchema = new Schema<IAgentUsage>(
  {
    date: { type: Date, required: true, unique: true },
    tokensUsed: { type: Number, default: 0 },
    costEstimate: { type: Number, default: 0 },
    taskCount: { type: Number, default: 0 },
  }
);

export default mongoose.models.AgentUsage || mongoose.model<IAgentUsage>("AgentUsage", AgentUsageSchema);
