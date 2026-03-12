"use client";
import Link from "next/link";
import Image from "next/image";
import { FiStar, FiBookmark, FiHeart } from "react-icons/fi";

interface Movie {
  _id: string;
  title: string;
  slug: string;
  poster: string;
  rating: number;
  genres: string[];
  releaseYear: number;
  quality: string[];
  category: string;
  language?: string;
}

interface MovieCardProps {
  movie: Movie;
  size?: "sm" | "md" | "lg";
}

const qualityColors: Record<string, string> = {
  "4k": "bg-purple-700",
  "1080p": "bg-blue-700",
  "720p": "bg-orange-700",
  hd: "bg-green-700",
};

export default function MovieCard({ movie, size = "md" }: MovieCardProps) {
  const posterHeight = size === "sm" ? "h-52" : size === "lg" ? "h-80" : "h-64";

  return (
    <Link href={`/movies/${movie.slug}`} className="block group movie-card">
      <div className="bg-[#111] rounded-sm overflow-hidden border border-[#1a1a1a] hover:border-[#333]">
        {/* Poster */}
        <div className={`relative ${posterHeight} overflow-hidden bg-[#1a1a1a]`}>
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover card-image"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
              <span className="text-[#333] font-display font-bold text-4xl">CV</span>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quality badge */}
          {movie.quality?.[0] && (
            <div className={`absolute top-2 left-2 ${qualityColors[movie.quality[0].toLowerCase()] || "bg-[#333]"} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase`}>
              {movie.quality[0]}
            </div>
          )}

          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#e50914] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
            <FiStar size={9} fill="currentColor" />
            <span>{movie.rating?.toFixed(1) || "N/A"}</span>
          </div>

          {/* Hover actions */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 bg-[#111]/90 border border-[#333] rounded-full flex items-center justify-center text-[#ccc] hover:text-[#e50914] hover:border-[#e50914] transition-colors"
              title="Add to Watchlist"
            >
              <FiBookmark size={13} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="w-8 h-8 bg-[#111]/90 border border-[#333] rounded-full flex items-center justify-center text-[#ccc] hover:text-[#e50914] hover:border-[#e50914] transition-colors"
              title="Add to Favorites"
            >
              <FiHeart size={13} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-[#e50914] transition-colors mb-1.5 font-display uppercase tracking-wide">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[#666] text-xs">{movie.releaseYear}</span>
            {movie.genres?.[0] && (
              <span className="text-[#555] text-xs">{movie.genres[0]}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton loader
export function MovieCardSkeleton() {
  return (
    <div className="bg-[#111] rounded-sm overflow-hidden border border-[#1a1a1a]">
      <div className="h-64 skeleton" />
      <div className="p-3">
        <div className="h-4 skeleton rounded mb-2" />
        <div className="h-3 skeleton rounded w-2/3" />
      </div>
    </div>
  );
}
