import mongoose, { Schema, Document } from "mongoose";

export interface IAgentLog extends Document {
  action: string;
  status: "success" | "fail" | "pending";
  details: string;
  metadata?: {
    agent: string;
    level: string;
    timestamp: Date;
    // New Reasoning Tree Fields
    reasoning?: {
      thought: string;
      alternatives: string[];
      decision: string;
      confidence: number;
    };
    cost?: number;
    latency?: number;
  };
  createdAt: Date;
}

const AgentLogSchema = new Schema<IAgentLog>(
  {
    action: { type: String, required: true },
    status: { type: String, enum: ["success", "fail", "pending"], default: "success" },
    details: { type: String, required: true },
    metadata: {
      agent: String,
      level: String,
      timestamp: { type: Date, default: Date.now },
      reasoning: {
        thought: String,
        alternatives: [String],
        decision: String,
        confidence: Number
      },
      cost: Number,
      latency: Number
    }
  },
  { timestamps: true }
);

export default mongoose.models.AgentLog || mongoose.model<IAgentLog>("AgentLog", AgentLogSchema);
