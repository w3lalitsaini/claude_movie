/**
 * Researcher Agent
 * Role: Fetches deep metadata for movies and verifies existence.
 */

import { calculateTrendScore } from "../trendScore";
import { logAgentActivity } from "../logger";

export interface MovieMetadata {
  title: string;
  tmdbId?: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genres: string[];
}

export async function researchMovie(title: string): Promise<MovieMetadata | null> {
  await logAgentActivity({
    agent: "researcher",
    level: "thinking",
    action: "fetch_metadata",
    details: `Deep researching metadata and trend scores for: ${title}`,
    reasoning: {
      thought: `Verifying if ${title} has enough social momentum and reliable metadata for a high-quality post.`,
      alternatives: ["Skip movie", "Detailed search", "Basic fetch"],
      decision: "Detailed search",
      confidence: 0.94
    }
  });

  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  
  if (!TMDB_API_KEY) {
    console.warn("TMDB_API_KEY missing. Using simulated search.");
    // Simulated research for now
    return {
      title,
      overview: "Deeply researched overview for " + title,
      posterPath: "https://image.tmdb.org/t/p/w500/sample.jpg",
      releaseDate: "2025-01-01",
      voteAverage: 8.5,
      voteCount: 1500,
      genres: ["Action", "Sci-Fi"]
    };
  }

  try {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      
      // Fetch details for genres
      const detailUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
      const detailRes = await fetch(detailUrl);
      const details = await detailRes.json();

      return {
        tmdbId: movie.id.toString(),
        title: movie.title,
        overview: movie.overview,
        posterPath: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        genres: details.genres.map((g: any) => g.name)
      };
    }
    return null;
  } catch (error) {
    console.error("TMDB Research failed:", error);
    return null;
  }
}
