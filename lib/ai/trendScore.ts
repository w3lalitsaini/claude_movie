/**
 * Trend Scoring Engine
 * Logic: score = popularity(TMDB) + searchVolume + recency + socialBuzz
 */

export interface TrendData {
  popularity: number;
  releaseDate: string;
  voteCount: number;
  searchVolume?: number; // Optional: can be fetched from Google Trends API or similar
}

export function calculateTrendScore(data: TrendData): number {
  const popularityWeight = 0.5;
  const recencyWeight = 0.3;
  const volumeWeight = 0.2;

  // 1. Popularity Score (Normalized 0-100)
  const popScore = Math.min(data.popularity / 10, 100);

  // 2. Recency Score
  const releaseDate = new Date(data.releaseDate);
  const now = new Date();
  const diffInDays = Math.abs(now.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24);
  const recencyScore = Math.max(0, 100 - (diffInDays / 3)); // Decays over 300 days

  // 3. Volume Score
  const volumeScore = Math.min((data.voteCount || 0) / 50, 100);

  const finalScore = (popScore * popularityWeight) + (recencyScore * recencyWeight) + (volumeScore * volumeWeight);

  return Math.round(finalScore);
}

export function getPriority(trendScore: number): number {
  if (trendScore > 80) return 1; // High Priority
  if (trendScore > 50) return 3; // Medium Priority
  return 5; // Low Priority
}
