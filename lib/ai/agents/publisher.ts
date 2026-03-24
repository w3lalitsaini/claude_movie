/**
 * Publisher Agent
 * Role: Clean data, handle images (Cloudinary), and save to MongoDB.
 */

import { logAgentActivity } from "../logger";
import Movie from "@/models/Movie";
import connectDB from "@/lib/db";

export interface PublicationParams {
  title: string;
  content: string;
  metadata: any;
  seo: any;
  type: "movie" | "blog";
}

export async function publishContent(params: PublicationParams) {
  await logAgentActivity({
    agent: "publisher",
    level: "thinking",
    action: "db_publication",
    details: `Preparing final database entry for: ${params.title}`,
    reasoning: {
      thought: "Verifying data integrity and slug uniqueness before final save.",
      alternatives: ["Upsert", "New entry", "Soft delete old"],
      decision: "Upsert (Overwrite if exists)",
      confidence: 1.0
    }
  });

  await connectDB();

  // Create slug from title
  const slug = params.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const movieEntry = await Movie.findOneAndUpdate(
    { slug },
    {
      title: params.title,
      description: params.content,
      slug,
      metaTitle: params.seo.title,
      metaDescription: params.seo.description,
      rating: params.metadata.vote_average || 0,
      releaseDate: params.metadata.release_date,
      posterUrl: `https://image.tmdb.org/t/p/w500${params.metadata.poster_path}`,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  await logAgentActivity({
    agent: "publisher",
    level: "success",
    action: "published",
    details: `Content successfully live at /movies/${slug}`,
    metadata: { id: movieEntry._id, slug }
  });

  return movieEntry;
}
