import { NextRequest, NextResponse } from "next/server";
import { decideNextActions } from "@/lib/ai/agents/manager";
import { addTask } from "@/lib/ai/queue";
import AgentLog from "@/models/AgentLog";

/**
 * Cron Endpoint: Triggered periodically (e.g. every 6 hours)
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  
  // Security check: Verify cron secret
  if (process.env.AGENT_SECRET && authHeader !== `Bearer ${process.env.AGENT_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Brain phase: Decide what needs to be done
    const tasks = await decideNextActions();
    
    // 2. Queue phase: Add tasks to priority queue
    for (const task of tasks) {
      await addTask(task.action, task, task.priority);
    }

    await AgentLog.create({
      action: "cron_trigger",
      status: tasks.length > 0 ? "success" : "pending",
      details: `Cron triggered. ${tasks.length} tasks identified by Manager Agent.`
    });

    return NextResponse.json({ success: true, tasksFound: tasks.length });
  } catch (error: any) {
    await AgentLog.create({
      action: "cron_trigger",
      status: "error",
      details: `Cron execution failed: ${error.message}`
    });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
