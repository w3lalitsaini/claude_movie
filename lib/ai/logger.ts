/**
 * Upgraded AI Logger
 * Role: Supports Reasoning Trees and Real-time Broadcasting (Redis PubSub).
 */

import AgentLog from "@/models/AgentLog";
import connectDB from "@/lib/db";
import redis from "@/lib/redis";

export type LogLevel = "info" | "success" | "warning" | "error" | "thinking" | "decisive";

export interface Reasoning {
  thought: string;
  alternatives: string[];
  decision: string;
  confidence: number;
}

export async function logAgentActivity(params: {
  agent: string;
  level: LogLevel;
  action: string;
  details: string;
  reasoning?: Reasoning;
  metadata?: any;
}) {
  await connectDB();
  
  const logEntry = await AgentLog.create({
    action: params.action,
    status: params.level === "error" ? "fail" : "success",
    details: `${params.agent.toUpperCase()}: ${params.details}`,
    metadata: {
      ...params.metadata,
      level: params.level,
      agent: params.agent,
      reasoning: params.reasoning,
      timestamp: new Date()
    }
  });

  // Broadcast to SSE via Redis PubSub
  await redis.publish("agent-logs", JSON.stringify(logEntry));

  console.log(`[${params.level.toUpperCase()}] ${params.agent}: ${params.details}`);
  
  return logEntry;
}
