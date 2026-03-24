import mongoose, { Schema, Document } from "mongoose";

export interface IAgentConfig extends Document {
  systemEnabled: boolean;
  activeAgents: string[];
  featureToggles: {
    autoGen: boolean;
    autoUpdate: boolean;
    autoDelete: boolean;
    seoOptimization: boolean;
    monetization: boolean;
    metaImprovement: boolean;
    abTesting: boolean;
    socialDistribution: boolean;
  };
  goals: {
    trafficTarget: number;
    revenueTarget: number;
    nicheFocus: string;
  };
  schedule: string;
  lastManualRun?: Date;
}

const AgentConfigSchema = new Schema<IAgentConfig>(
  {
    systemEnabled: { type: Boolean, default: true },
    activeAgents: { type: [String], default: ["manager", "researcher", "writer", "optimizer", "monetizer", "meta", "strategy", "competitor"] },
    featureToggles: {
      autoGen: { type: Boolean, default: true },
      autoUpdate: { type: Boolean, default: true },
      autoDelete: { type: Boolean, default: false },
      seoOptimization: { type: Boolean, default: true },
      monetization: { type: Boolean, default: true },
      metaImprovement: { type: Boolean, default: true },
      abTesting: { type: Boolean, default: true },
      socialDistribution: { type: Boolean, default: true },
    },
    goals: {
      trafficTarget: { type: Number, default: 100000 },
      revenueTarget: { type: Number, default: 1000 },
      nicheFocus: { type: String, default: "Bollywood + OTT" },
    },
    schedule: { type: String, default: "0 0 * * *" },
    lastManualRun: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.AgentConfig || mongoose.model<IAgentConfig>("AgentConfig", AgentConfigSchema);
