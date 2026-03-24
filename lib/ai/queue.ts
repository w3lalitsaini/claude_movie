/**
 * BullMQ Priority Queue Setup
 * Handles asynchronous execution of agent tasks with priority support.
 */

import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";

// Reuse Redis connection
const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

connection.on("error", (err: any) => {
  if (err.code === "ECONNREFUSED") {
    // console.warn("Redis connection failed. Queueing disabled.");
  }
});

export const agentQueue = new Queue("agent-tasks", { 
  connection: connection as any,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
  }
});

/**
 * Add a task to the queue with priority
 */
export async function addTask(name: string, data: any, priority: number = 3) {
  return await agentQueue.add(name, data, { priority });
}

// Note: Worker should ideally run in a separate persistent process (e.g. Vercel Background Job or dedicated server)
// For local dev, we can initialize it here but it may restart with Next.js HMR.
