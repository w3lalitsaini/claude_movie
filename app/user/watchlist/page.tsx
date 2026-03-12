"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MovieCard, { MovieCardSkeleton } from "@/components/movies/MovieCard";
import { FiBookmark } from "react-icons/fi";
import Link from "next/link";

export default function WatchlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated") {
        fetch("/api/watchlist")
        .then(r => r.json())
        .then(d => setMovies(d.success && d.watchlist?.length ? d.watchlist : []))
        .catch(() => setMovies([]))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  return (
    <div className="pt-[90px] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-7">
          <span className="w-1 h-8 bg-[#e50914] inline-block rounded-sm"/>
          <div>
            <h1 className="font-display font-bold text-3xl text-white uppercase tracking-widest flex items-center gap-2">
              <FiBookmark size={24}/> My Watchlist
            </h1>
            <p className="text-[#555] text-sm mt-0.5">{movies.length} movies saved</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({length:6},(_,i) => <MovieCardSkeleton key={i}/>)}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {movies.map(m => <MovieCard key={m._id} movie={m}/>)}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiBookmark size={48} className="mx-auto text-[#222] mb-4"/>
            <p className="text-[#555] mb-4">Your watchlist is empty</p>
            <Link href="/movies" className="btn-red inline-block text-white font-bold px-6 py-2.5 rounded-sm text-sm">
              Browse Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
