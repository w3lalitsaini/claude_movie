"use client";
import { useEffect, useState } from "react";
import MovieCard, { MovieCardSkeleton } from "@/components/movies/MovieCard";
import SectionHeader from "@/components/ui/SectionHeader";

// Demo data removed to ensure real data usage.

export default function TrendingMovies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movies?trending=true&limit=8")
      .then((r) => r.json())
      .then((d) => {
        setMovies(d.success ? d.movies : []);
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10">
      <SectionHeader title="Trending Movies" subtitle="Most watched this week" viewAllHref="/movies?trending=true" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
        {loading
          ? Array.from({ length: 8 }, (_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((m) => <MovieCard key={m._id} movie={m} size="sm" />)
        }
      </div>
    </section>
  );
}
