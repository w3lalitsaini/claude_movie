import { NextRequest } from "next/server";
import { Redis } from "ioredis";

export const dynamic = "force-dynamic";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sub = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`));

        sub.subscribe("agent-logs");
        sub.on("message", (channel, message) => {
          if (channel === "agent-logs") {
            try { controller.enqueue(encoder.encode(`data: ${message}\n\n`)); } catch (e) {}
          }
        });

        req.signal.addEventListener("abort", () => {
          sub.quit();
          try { controller.close(); } catch (e) {}
        });
      } catch (err) {
        console.error("SSE Error:", err);
        sub.quit();
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
