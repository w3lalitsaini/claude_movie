"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlay, FiStar, FiCalendar, FiClock, FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";

// Demo featured movies for when DB is empty


export default function HeroSection() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/movies?featured=true&limit=5")
      .then(r => r.json())
      .then(d => {
        if (d.success && d.movies?.length > 0) {
          setMovies(d.movies);
        } else {
          setMovies([]);
        }
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => goNext(), 7000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, movies.length]);

  const goNext = () => {
    if (animating || movies.length === 0) return;
    setAnimating(true);
    setCurrent((prev) => (prev + 1) % movies.length);
    setTimeout(() => setAnimating(false), 600);
  };

  const goPrev = () => {
    if (animating || movies.length === 0) return;
    setAnimating(true);
    setCurrent((prev) => (prev - 1 + movies.length) % movies.length);
    setTimeout(() => setAnimating(false), 600);
  };

  if (loading) {
    return (
      <div className="w-full h-[80vh] min-h-[560px] bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (movies.length === 0) return null;

  const movie = movies[current];

  return (
    <div className="relative px-20 w-full h-[80vh] min-h-[560px] max-h-[720px] overflow-hidden bg-[#080808]">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-30" : "opacity-100"}`}
        key={movie._id}
      >
        {movie.backdrop && (
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-[#080808] via-[#080808]/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-transparent to-[#080808]/30" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-4 flex items-center">
        <div
          className={`max-w-2xl transition-all duration-500 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
        >
          {/* Category badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#e50914] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
              {movie.category?.replace("-", " ") || "Featured"}
            </span>
            {movie.quality?.[0] && (
              <span className="border border-[#444] text-[#aaa] text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                {movie.quality[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl uppercase tracking-wide text-white leading-none mb-4">
            {movie.title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5 text-[#fbbf24]">
              <FiStar size={14} fill="currentColor" />
              <span className="text-white font-bold text-sm">{movie.rating?.toFixed(1)}</span>
              <span className="text-[#666] text-xs">/10</span>
            </div>
            <span className="text-[#444]">|</span>
            <div className="flex items-center gap-1.5 text-[#888] text-sm">
              <FiCalendar size={13} />
              <span>{movie.releaseYear}</span>
            </div>
            <span className="text-[#444]">|</span>
            <div className="flex items-center gap-1.5 text-[#888] text-sm">
              <FiClock size={13} />
              <span>{movie.duration} min</span>
            </div>
            <span className="text-[#444]">|</span>
            <div className="flex items-center gap-2">
              {movie.genres?.slice(0, 2).map((g: string) => (
                <span key={g} className="text-xs text-[#888]">{g}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-[#aaa] text-sm leading-relaxed mb-8 max-w-lg line-clamp-3">
            {movie.description}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/movies/${movie.slug}`}
              className="btn-red flex items-center gap-2 text-white font-bold px-7 py-3 rounded-sm uppercase tracking-wider text-sm"
            >
              <FiPlay size={16} fill="currentColor" />
              Watch Trailer
            </Link>
            <Link
              href={`/movies/${movie.slug}`}
              className="flex items-center gap-2 bg-[#ffffff15] hover:bg-[#ffffff25] backdrop-blur-sm border border-[#ffffff20] text-white font-bold px-7 py-3 rounded-sm uppercase tracking-wider text-sm transition-all"
            >
              <FiInfo size={16} />
              More Info
            </Link>
          </div>
        </div>

        {/* Side poster – desktop only */}
        <div className="hidden xl:block absolute right-12 bottom-0 w-52">
          <div className="relative w-52 h-72 rounded-sm overflow-hidden shadow-2xl border border-white/10 dark:border-[#333]/90">
            {movie.poster && (
              <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 dark:from-[#080808]/80 to-transparent" />
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#111]/80 hover:bg-[#e50914] border border-[#333] text-white flex items-center justify-center transition-all rounded-sm group"
      >
        <FiChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#111]/80 hover:bg-[#e50914] border border-[#333] text-white flex items-center justify-center transition-all rounded-sm group"
      >
        <FiChevronRight size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => { setAnimating(true); setCurrent(i); setTimeout(() => setAnimating(false), 600); }}
            className={`transition-all rounded-full ${
              i === current ? "w-8 h-2 bg-[#e50914]" : "w-2 h-2 bg-[#444] hover:bg-[#666]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
