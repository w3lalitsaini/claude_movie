/**
 * Failure Simulation Test
 * Purpose: Break the system intentionally and verify recovery/logging.
 */

import { handleAgentFailure } from "../errorHandler";

export async function simulateFailure() {
  console.log("🚀 Starting Failure Simulation...");

  // 1. Simulate DB Connection Error
  const mockError = new Error("ECONNREFUSED: Database is down");
  const context = {
    task: "movie_creation",
    agent: "publisher",
    retryCount: 0,
    payload: { title: "Test Movie" }
  };

  console.log("⚠️ Simulating DB Outage...");
  const willRetry = await handleAgentFailure(mockError, context);

  if (willRetry) {
    console.log("✅ Recovery System: Retry triggered successfully.");
  } else {
    console.log("❌ Recovery System: Failed to trigger retry.");
  }

  // 2. Simulate API Timeout
  const apiError = new Error("TIMEOUT: Gemini API did not respond");
  context.task = "content_generation";
  context.agent = "writer";
  context.retryCount = 3; // Max hits

  console.log("⚠️ Simulating API Max Retries...");
  const terminal = await handleAgentFailure(apiError, context);

  if (!terminal) {
    console.log("✅ Alert System: Max retries handled correctly.");
  }

  console.log("🏁 Failure Simulation Complete.");
}
