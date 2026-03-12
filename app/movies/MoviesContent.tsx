"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard, { MovieCardSkeleton } from "@/components/movies/MovieCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AdUnit from "@/components/ui/AdUnit";

const GENRES = [
  "Action",
  "Drama",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Comedy",
  "Horror",
  "Adventure",
  "Animation",
  "Crime",
  "Biography",
];
const YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));
const LANGUAGES = [
  "Hindi",
  "English",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
];
const QUALITIES = ["4K", "1080P", "720P", "480P"];
const PLATFORMS = ["Netflix", "Amazon Prime", "Disney+ Hotstar", "Zee5", "SonyLIV", "JioCinema", "Apple TV+", "Youtube"];
const CATEGORIES = [
  { value: "bollywood", label: "Bollywood" },
  { value: "hollywood", label: "Hollywood" },
  { value: "south-hindi", label: "South Hindi" },
  { value: "dual-audio", label: "Dual Audio" },
  { value: "web-series", label: "Web Series" },
];

// Demo data removed to ensure real data usage.

export default function MoviesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get("category") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const language = searchParams.get("language") || "";
  const quality = searchParams.get("quality") || "";
  const platform = searchParams.get("platform") || "";
  const trending = searchParams.get("trending") || "";
  const topRated = searchParams.get("topRated") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (genre) params.set("genre", genre);
    if (year) params.set("year", year);
    if (language) params.set("language", language);
    if (quality) params.set("quality", quality);
    if (platform) params.set("platform", platform);
    if (trending) params.set("trending", trending);
    if (topRated) params.set("topRated", topRated);
    params.set("page", String(page));
    params.set("limit", "18");

    fetch(`/api/movies?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setMovies(d.success ? d.movies : []);
        setTotalPages(d.pagination?.pages || 1);
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [category, genre, year, language, quality, platform, trending, topRated, page]);

  const updateFilter = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set(key, val);
    else params.delete(key);
    params.delete("page");
    router.push(`/movies?${params.toString()}`);
  };

  const getTitle = () => {
    if (trending) return "Trending Movies";
    if (topRated) return "Top Rated Movies";
    if (category)
      return CATEGORIES.find((c) => c.value === category)?.label || "Movies";
    if (genre) return `${genre} Movies`;
    return "All Movies";
  };

  return (
    <div className="pt-[90px] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="mb-8">
          <AdUnit />
        </div>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title={getTitle()} />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#111] border border-[#222] hover:border-[#444] text-[#ccc] text-sm px-4 py-2 rounded-sm transition-colors"
          >
            <FiFilter size={14} /> Filters
            {(category || genre || year || language || quality || platform) && (
              <span className="w-2 h-2 bg-[#e50914] rounded-full" />
            )}
          </button>
        </div>

        {showFilters && (
          <div className="bg-[#111] border border-[#222] rounded-sm p-5 mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              {
                label: "Category",
                value: category,
                key: "category",
                options: CATEGORIES.map((c) => ({
                  value: c.value,
                  label: c.label,
                })),
              },
              {
                label: "Genre",
                value: genre,
                key: "genre",
                options: GENRES.map((g) => ({ value: g, label: g })),
              },
              {
                label: "Year",
                value: year,
                key: "year",
                options: YEARS.map((y) => ({ value: y, label: y })),
              },
              {
                label: "Language",
                value: language,
                key: "language",
                options: LANGUAGES.map((l) => ({ value: l, label: l })),
              },
              {
                label: "Quality",
                value: quality,
                key: "quality",
                options: QUALITIES.map((q) => ({ value: q, label: q })),
              },
              {
                label: "Platform",
                value: platform,
                key: "platform",
                options: PLATFORMS.map((p) => ({ value: p, label: p })),
              },
            ].map(({ label, value, key, options }) => (
              <div key={key}>
                <label className="text-[#555] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                  {label}
                </label>
                <select
                  value={value}
                  onChange={(e) => updateFilter(key, e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-[#ccc] text-sm px-3 py-2 rounded-sm outline-none focus:border-[#e50914] transition-colors"
                >
                  <option value="">All</option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        
        {(category || genre || year || language || quality || platform) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              {
                key: "category",
                val: category,
                label: CATEGORIES.find((c) => c.value === category)?.label,
              },
              { key: "genre", val: genre, label: genre },
              { key: "year", val: year, label: year },
              { key: "language", val: language, label: language },
              { key: "quality", val: quality, label: quality },
              { key: "platform", val: platform, label: platform },
            ]
              .filter((f) => f.val)
              .map((f) => (
                <button
                  key={f.key}
                  onClick={() => updateFilter(f.key, "")}
                  className="flex items-center gap-1.5 bg-[#e50914]/20 border border-[#e50914]/40 text-[#e50914] text-xs font-semibold px-3 py-1.5 rounded-sm hover:bg-[#e50914]/30 transition-colors"
                >
                  {f.label} ×
                </button>
              ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {loading
            ? Array.from({ length: 18 }, (_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : movies.map((m: any) => <MovieCard key={m._id} movie={m} />)}
        </div>

        <div className="my-10">
          <AdUnit layout="in-article" format="fluid" />
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => updateFilter("page", String(page - 1))}
              className="w-9 h-9 bg-[#111] border border-[#222] hover:border-[#444] disabled:opacity-40 text-[#ccc] flex items-center justify-center rounded-sm transition-colors"
            >
              <FiChevronLeft size={14} />
            </button>
            {Array.from(
              { length: Math.min(7, totalPages) },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => updateFilter("page", String(p))}
                className={`w-9 h-9 border rounded-sm text-sm font-semibold transition-colors ${p === page ? "bg-[#e50914] border-[#e50914] text-white" : "bg-[#111] border-[#222] hover:border-[#444] text-[#ccc]"}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page >= totalPages}
              onClick={() => updateFilter("page", String(page + 1))}
              className="w-9 h-9 bg-[#111] border border-[#222] hover:border-[#444] disabled:opacity-40 text-[#ccc] flex items-center justify-center rounded-sm transition-colors"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
