import { NextRequest, NextResponse } from "next/server";
import { researchMovie } from "@/lib/ai/agents/researcher";
import { generateContent } from "@/lib/ai/agents/writer";
import { optimizeForSEO } from "@/lib/ai/agents/optimizer";
import { monetizeContent } from "@/lib/ai/agents/monetizer";
import { publishContent } from "@/lib/ai/agents/publisher";
import { logAgentActivity } from "@/lib/ai/logger";

export async function POST(req: NextRequest) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    await logAgentActivity({
      agent: "manager",
      level: "info",
      action: "start_manual_creation",
      details: `Initiating full agentic chain for manual creation of: ${title}`
    });

    // 1. Research
    const metadata = await researchMovie(title);
    if (!metadata) throw new Error("Researcher failed to find movie metadata.");

    // 2. Writing
    const rawContent = await generateContent({
      topic: title,
      type: "review",
      context: JSON.stringify(metadata)
    });

    // 3. Optimization
    const seoData = await optimizeForSEO({
      title: title,
      content: rawContent,
      description: metadata.overview || "",
      keywords: metadata.genres || []
    });

    // 4. Monetization
    const finalContent = await monetizeContent({
      content: rawContent,
      type: "movie"
    });

    // 5. Publication
    const movie = await publishContent({
      title: title,
      content: finalContent,
      metadata,
      seo: seoData,
      type: "movie"
    });

    await logAgentActivity({
      agent: "manager",
      level: "success",
      action: "manual_creation_complete",
      details: `Manual AI Creation successful for ${title}. Live at /movies/${movie.slug}`
    });

    return NextResponse.json({ success: true, movie });

  } catch (error: any) {
    await logAgentActivity({
      agent: "manager",
      level: "error",
      action: "manual_creation_failed",
      details: `Critical failure in manual creation chain: ${error.message}`
    });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
