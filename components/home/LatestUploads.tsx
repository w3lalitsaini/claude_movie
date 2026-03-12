"use client";
import { useEffect, useState } from "react";
import MovieCard, { MovieCardSkeleton } from "@/components/movies/MovieCard";
import SectionHeader from "@/components/ui/SectionHeader";

// Demo data removed.

export default function LatestUploads() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/movies?limit=6&sort=-createdAt")
      .then((r) => r.json())
      .then((d) => setMovies(d.success ? d.movies : []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 border-t border-[#1a1a1a]">
      <SectionHeader title="Latest Uploads" subtitle="Freshly added movies & series" viewAllHref="/movies" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <MovieCardSkeleton key={i} />)
          : movies.map((m: any) => <MovieCard key={m._id} movie={m} />)
        }
      </div>
    </section>
  );
}
