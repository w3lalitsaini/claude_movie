"use client";
import { useEffect, useState, useRef } from "react";
import MovieCard, { MovieCardSkeleton } from "@/components/movies/MovieCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Demo data removed.

export default function TopRated() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/movies?topRated=true&limit=8")
      .then((r) => r.json())
      .then((d) => setMovies(d.success ? d.movies : []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="py-10 border-t border-[#1a1a1a]">
      <SectionHeader title="Top Rated" subtitle="Highest rated of all time" viewAllHref="/movies?topRated=true" />
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#111] hover:bg-[#e50914] border border-[#222] text-white flex items-center justify-center rounded-full transition-all shadow-lg"
        >
          <FiChevronLeft size={16} />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {loading
            ? Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex-shrink-0 w-40">
                  <MovieCardSkeleton />
                </div>
              ))
            : movies.map((m: any) => (
                <div key={m._id} className="flex-shrink-0 w-40">
                  <MovieCard movie={m} size="sm" />
                </div>
              ))
          }
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#111] hover:bg-[#e50914] border border-[#222] text-white flex items-center justify-center rounded-full transition-all shadow-lg"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
