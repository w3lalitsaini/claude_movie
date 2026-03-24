/**
 * Parallel Agent Scheduler
 * Role: Orchestrates concurrent execution of specialized agents.
 */

import { researchMovie } from "./agents/researcher";
import { generateContent } from "./agents/writer";
import { optimizeForSEO } from "./agents/optimizer";
import { optimizeForRevenue } from "./agents/monetizer";
import { publishContent } from "./agents/publisher";

export async function executeAgentTask(title: string, options: any = {}) {
  try {
    // 1. Research phase
    const metadata = await researchMovie(title);
    if (!metadata) throw new Error(`Research failed for: ${title}`);

    // 2. Parallel Generation & Optimization Phase
    const [review, blog] = await Promise.all([
      generateContent({ type: "review", topic: title, context: metadata }),
      generateContent({ type: "blog", topic: title, context: metadata })
    ]);

    // 3. SEO & Monetization Phase (Can also be parallel)
    const [seoReview, seoBlog] = await Promise.all([
      optimizeForSEO({ title, description: metadata.overview, content: review, keywords: metadata.genres }),
      optimizeForSEO({ title: `Why ${title} is trending`, description: metadata.overview, content: blog, keywords: metadata.genres })
    ]);

    const monetizedBlog = await optimizeForRevenue({ 
      content: seoBlog.content || blog, 
      category: "movies", 
      title 
    });

    // 4. Publishing Gate
    const result = await publishContent({
      type: "blog",
      data: {
        title: seoBlog.title,
        content: monetizedBlog,
        metaTitle: seoBlog.title,
        metaDescription: seoBlog.metaDescription,
        aiMetadata: {
          seoScore: seoBlog.seoScore,
          trendScore: options.trendScore || 0,
          lastAgentAction: "create"
        }
      },
      requireApproval: true // Default to Human-in-the-loop
    });

    return result;
  } catch (error) {
    console.error(`Task Execution Error [${title}]:`, error);
    throw error;
  }
}
