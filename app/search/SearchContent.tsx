"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard, { MovieCardSkeleton } from "@/components/movies/MovieCard";
import { FiSearch, FiX } from "react-icons/fi";
import AdUnit from "@/components/ui/AdUnit";


const GENRES = ["Action","Drama","Thriller","Sci-Fi","Romance","Comedy","Horror","Adventure"];
const YEARS = Array.from({length:10},(_,i) => String(2025-i));
const LANGUAGES = ["Hindi","English","Telugu","Tamil"];
const RATINGS = [{label:"9+",val:"9"},{label:"8+",val:"8"},{label:"7+",val:"7"},{label:"6+",val:"6"}];

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Parameters<typeof MovieCard>[0]["movie"][]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const language = searchParams.get("language") || "";
  const rating = searchParams.get("rating") || "";
  const q = searchParams.get("q") || "";

  useEffect(() => {
    if (!q && !genre && !year && !language && !rating) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (genre) params.set("genre", genre);
    if (year) params.set("year", year);
    if (language) params.set("language", language);
    if (rating) params.set("rating", rating);
    params.set("limit", "18");

    fetch(`/api/search?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setResults(d.success ? d.movies : []); setTotal(d.total || 0); })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q, genre, year, language, rating]);

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams.toString());
    if (val) p.set(key, val); else p.delete(key);
    router.push(`/search?${p.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("q", query);
  };

  const hasFilters = q || genre || year || language || rating;

  return (
    <div className="pt-[90px] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="mb-8">
          <AdUnit />
        </div>
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white uppercase tracking-widest mb-5 flex items-center gap-3">
            <span className="w-1 h-8 bg-[#e50914] inline-block rounded-sm"/> Search Movies
          </h1>
          <form onSubmit={handleSearch} className="flex gap-0 max-w-2xl">
            <div className="relative flex-1">
              <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"/>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies, actors, directors..."
                className="w-full bg-[#111] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm pl-11 pr-4 py-4 outline-none transition-colors"/>
              {query && (
                <button type="button" onClick={() => { setQuery(""); setParam("q",""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors">
                  <FiX size={14}/>
                </button>
              )}
            </div>
            <button type="submit" className="btn-red text-white font-bold px-8 py-4 uppercase tracking-wider text-sm">Search</button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-5 sticky top-28">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm"/> Filters
              </h3>
              <div className="mb-5">
                <p className="text-[#555] text-xs uppercase tracking-wider font-semibold mb-2">Genre</p>
                <div className="flex flex-col gap-1">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setParam("genre", genre === g ? "" : g)}
                      className={`text-left px-3 py-1.5 text-xs rounded-sm transition-all ${genre === g ? "bg-[#e50914]/20 text-[#e50914] border border-[#e50914]/30" : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <p className="text-[#555] text-xs uppercase tracking-wider font-semibold mb-2">Year</p>
                <select value={year} onChange={e => setParam("year", e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-[#aaa] text-xs px-3 py-2 rounded-sm outline-none transition-colors">
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="mb-5">
                <p className="text-[#555] text-xs uppercase tracking-wider font-semibold mb-2">Language</p>
                <select value={language} onChange={e => setParam("language", e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-[#aaa] text-xs px-3 py-2 rounded-sm outline-none transition-colors">
                  <option value="">All Languages</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="mb-4">
                <p className="text-[#555] text-xs uppercase tracking-wider font-semibold mb-2">Min Rating</p>
                <div className="flex gap-1.5 flex-wrap">
                  {RATINGS.map(r => (
                    <button key={r.val} onClick={() => setParam("rating", rating === r.val ? "" : r.val)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${rating === r.val ? "bg-[#e50914] border-[#e50914] text-white" : "bg-[#0a0a0a] border-[#2a2a2a] text-[#888] hover:border-[#444]"}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              {(genre||year||language||rating) && (
                <button onClick={() => router.push(`/search${q ? `?q=${q}` : ""}`)}
                  className="w-full mt-2 text-xs text-[#e50914] hover:text-[#ff1e2d] font-semibold transition-colors py-1.5">
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {hasFilters ? (
              <>
                <p className="text-[#666] text-sm mb-5">
                  {loading ? "Searching..." : `Found ${total} results${q ? ` for "${q}"` : ""}`}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {loading ? Array.from({length:8},(_,i) => <MovieCardSkeleton key={i}/>)
                    : results.length > 0 ? results.map(m => <MovieCard key={m._id} movie={m}/>)
                    : <div className="col-span-full text-center py-16 text-[#444]">No results found.</div>}
                </div>
                <div className="mt-10">
                  <AdUnit layout="in-article" format="fluid" />
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <FiSearch size={48} className="mx-auto text-[#222] mb-4"/>
                <p className="text-[#555] text-sm">Enter a search term or apply filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
