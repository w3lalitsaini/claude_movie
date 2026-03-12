"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FiStar,
  FiPlay,
  FiBookmark,
  FiHeart,
  FiDownload,
  FiShare2,
  FiCalendar,
  FiClock,
  FiGlobe,
} from "react-icons/fi";
import StarRating from "@/components/ui/StarRating";
import toast from "react-hot-toast";
import AdUnit from "@/components/ui/AdUnit";
import DelayedDownload from "@/components/movies/DelayedDownload";

// Demo data removed.

export default function MovieDetailsPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [movie, setMovie] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    content: "",
  });
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (session?.user?.email && movie?._id) {
      fetch("/api/users/me")
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setIsWatchlisted(d.user.watchlist.includes(movie._id));
            setIsFavorited(d.user.favorites.includes(movie._id));
          }
        });
    }
  }, [session, movie?._id]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/movies/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setMovie(d.movie);
          // Fetch reviews using real ID
          fetch(`/api/reviews?movieId=${d.movie._id}`)
            .then((r) => r.json())
            .then((rd) => setReviews(rd.success ? rd.reviews : []));
          
          // Fetch related movies
          fetch(`/api/movies?category=${d.movie.category}&limit=6`)
            .then((r) => r.json())
            .then((rel) => setRelatedMovies(rel.success ? rel.movies.filter((m: any) => m._id !== d.movie._id) : []));
        } else {
          setMovie(null);
        }
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to submit a review");
      return;
    }
    if (!reviewData.rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reviewData, movieId: movie?._id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted!");
        setReviews((prev) => [data.review, ...prev]);
        setReviews((prev) => [data.review, ...prev]);
        setReviewData({ rating: 0, title: "", content: "" });
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleWatchlist = async () => {
    if (!session) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await fetch("/api/users/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie?._id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsWatchlisted(data.added);
        toast.success(
          data.added ? "Added to watchlist" : "Removed from watchlist",
        );
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleFavorite = async () => {
    if (!session) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await fetch("/api/users/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie?._id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFavorited(data.added);
        toast.success(
          data.added ? "Added to favorites" : "Removed from favorites",
        );
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: movie?.title,
          text: `Check out ${movie?.title} on AtoZ Movies!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      // User aborted or another error
    }
  };

  if (loading)
    return (
      <div className="pt-[90px] h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!movie) return null;

  const qualityColors: Record<string, string> = {
    "4K": "bg-purple-700",
    "1080P": "bg-blue-700",
    "720P": "bg-orange-700",
  };

  return (
    <div className="pt-[90px]">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[480px] overflow-hidden">
        {movie.backdrop && (
          <Image
            src={movie.backdrop}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] to-transparent" />

        <div className="relative h-full max-w-[1400px] mx-auto px-4 flex items-end pb-10">
          <div className="flex gap-8 items-end">
            {/* Poster */}
            <div className="hidden md:block relative w-44 h-64 shrink-0 rounded-sm overflow-hidden shadow-2xl border border-[#333]/50">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.quality?.map((q: string) => (
                  <span
                    key={q}
                    className={`${qualityColors[q] || "bg-[#333]"} text-white text-xs font-bold px-2 py-0.5 rounded-sm uppercase`}
                  >
                    {q}
                  </span>
                ))}
                <span className="bg-[#1a1a1a] border border-[#333] text-[#aaa] text-xs px-2 py-0.5 rounded-sm">
                  {movie.language}
                </span>
              </div>

              <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-3">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <FiStar size={14} className="text-[#fbbf24]" fill="#fbbf24" />
                  <span className="text-white font-bold">
                    {movie.rating?.toFixed(1)}
                  </span>
                  <span className="text-[#666] text-sm">/ 10</span>
                </div>
                <span className="text-[#444]">|</span>
                <div className="flex items-center gap-1.5 text-[#888] text-sm">
                  <FiCalendar size={13} /> {movie.releaseYear}
                </div>
                <span className="text-[#444]">|</span>
                <div className="flex items-center gap-1.5 text-[#888] text-sm">
                  <FiClock size={13} /> {movie.duration} min
                </div>
                <span className="text-[#444]">|</span>
                <div className="flex items-center gap-1.5 text-[#888] text-sm">
                  <FiGlobe size={13} /> {movie.language}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {movie.genres?.map((g: string) => (
                  <Link
                    key={g}
                    href={`/movies?genre=${g}`}
                    className="border border-[#333] hover:border-[#e50914] text-[#aaa] hover:text-[#e50914] text-xs px-2.5 py-1 rounded-sm transition-colors"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {movie.trailerUrl && (
                  <button
                    onClick={() => {
                      const el = document.getElementById("trailer-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="btn-red flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-sm text-sm"
                  >
                    <FiPlay size={14} fill="currentColor" /> Watch Trailer
                  </button>
                )}
                <button
                  onClick={() => {
                    const el = document.getElementById("review-form");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex items-center gap-2 bg-[#ffffff10] hover:bg-[#ffffff20] border border-[#333] text-white font-bold px-5 py-2.5 rounded-sm text-sm transition-all"
                >
                  <FiStar size={14} /> Write Review
                </button>
                <button
                  onClick={handleWatchlist}
                  className={`flex items-center gap-2 border px-3.5 py-2.5 rounded-sm transition-all ${
                    isWatchlisted
                      ? "bg-[#e50914] border-[#e50914] text-white"
                      : "bg-[#ffffff10] hover:bg-[#ffffff20] border-[#333] text-[#ccc]"
                  }`}
                >
                  <FiBookmark
                    size={14}
                    className={isWatchlisted ? "fill-current" : ""}
                  />
                </button>
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 border px-3.5 py-2.5 rounded-sm transition-all ${
                    isFavorited
                      ? "bg-[#e50914] border-[#e50914] text-white"
                      : "bg-[#ffffff10] hover:bg-[#ffffff20] border-[#333] text-[#ccc]"
                  }`}
                >
                  <FiHeart
                    size={14}
                    className={isFavorited ? "fill-current" : ""}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-[#ffffff10] hover:bg-[#ffffff20] border border-[#333] text-[#ccc] px-3.5 py-2.5 rounded-sm transition-all"
                >
                  <FiShare2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <div>
              <h2 className="font-display font-bold text-lg uppercase tracking-widest text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                Synopsis
              </h2>
              <p className="text-[#aaa] leading-relaxed mb-8">
                {movie.description}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Director", val: movie.director },
                  { label: "Release Year", val: movie.releaseYear },
                  { label: "Duration", val: `${movie.duration} minutes` },
                  { label: "Language", val: movie.language },
                  { label: "IMDb Rating", val: `${movie.imdbRating}/10` },
                  { label: "Category", val: movie.category },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#111] border border-[#1a1a1a] rounded-sm p-3"
                  >
                    <span className="text-[#555] text-xs uppercase tracking-wider font-semibold">
                      {item.label}
                    </span>
                    <p className="text-white font-semibold mt-0.5">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <AdUnit layout="in-article" format="fluid" />

            {/* Cast */}
            <div>
              <h2 className="font-display font-bold text-lg uppercase tracking-widest text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                Cast & Crew
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {movie.cast?.map((actor: any) => (
                  <div
                    key={actor.name}
                    className="bg-[#111] border border-[#1a1a1a] rounded-sm p-3 flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-[#1a1a1a]">
                      {actor.photo && (
                        <Image
                          src={actor.photo}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {actor.name}
                      </p>
                      <p className="text-[#666] text-xs">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <AdUnit layout="in-article" format="fluid" />

            {/* Trailer */}
            <div id="trailer-section">
              <h2 className="font-display font-bold text-lg uppercase tracking-widest text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                Official Trailer
              </h2>
              <div className="aspect-video bg-[#111] rounded-sm overflow-hidden border border-[#222]">
                {movie.trailerUrl ? (
                  <iframe
                    src={movie.trailerUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-[#444]">
                    <FiPlay size={48} />
                  </div>
                )}
              </div>
            </div>

            <AdUnit format="rectangle" />

            {/* Download */}
            <div id="download-section">
              <h2 className="font-display font-bold text-lg uppercase tracking-widest text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                Download Links
              </h2>
              <DelayedDownload links={movie.downloadLinks || []} />
            </div>

            <AdUnit />

            {/* Reviews */}
            <div id="reviews-section">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg uppercase tracking-widest text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                  User Reviews ({reviews.length})
                </h2>
                <button
                  onClick={() => {
                    const el = document.getElementById("review-form");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn-red text-white text-xs font-bold px-4 py-2 rounded-sm"
                >
                  Write Review
                </button>
              </div>

              <form
                id="review-form"
                onSubmit={handleSubmitReview}
                className="bg-[#111] border border-[#222] rounded-sm p-5 mb-6"
              >
                <h3 className="text-white font-semibold mb-4">Your Review</h3>
                <div className="mb-4">
                  <label className="text-[#666] text-xs uppercase tracking-wider mb-2 block">
                    Rating
                  </label>
                  <StarRating
                    value={reviewData.rating}
                    onChange={(v) =>
                      setReviewData((p) => ({ ...p, rating: v }))
                    }
                    max={10}
                    size={24}
                  />
                  <span className="text-[#aaa] text-sm mt-1 block">
                    {reviewData.rating}/10
                  </span>
                </div>
                <input
                  value={reviewData.title}
                  onChange={(e) =>
                    setReviewData((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Review title"
                  required
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-2.5 rounded-sm outline-none mb-3 transition-colors"
                />
                <textarea
                  value={reviewData.content}
                  onChange={(e) =>
                    setReviewData((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Share your thoughts about this movie..."
                  required
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-2.5 rounded-sm outline-none resize-none mb-4 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn-red text-white font-bold px-6 py-2 rounded-sm text-sm"
                  >
                    Submit
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="bg-[#111] border border-[#1a1a1a] rounded-sm p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#e50914] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {r.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {r.user.name}
                          </p>
                          <p className="text-[#555] text-xs">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#e50914] text-white text-xs font-bold px-2 py-1 rounded-sm">
                        <FiStar size={9} fill="currentColor" /> {r.rating}/10
                      </div>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">
                      {r.title}
                    </h4>
                    <p className="text-[#888] text-sm leading-relaxed">
                      {r.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-5 mb-5">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm" />{" "}
                Movie Info
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Status", val: "Available" },
                  { label: "Release", val: movie.releaseYear },
                  { label: "Runtime", val: `${movie.duration} min` },
                  { label: "Rating", val: `${movie.rating}/10` },
                  { label: "Views", val: movie.views?.toLocaleString() },
                  { label: "Reviews", val: reviews.length },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-[#1a1a1a]"
                  >
                    <span className="text-[#666] text-xs uppercase tracking-wider">
                      {label}
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related */}
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm" />{" "}
                Related Movies
              </h3>
              <div className="space-y-3">
                {relatedMovies.slice(0, 5).map((m) => (
                  <Link
                    key={m._id}
                    href={`/movies/${m.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-14 h-20 shrink-0 rounded-sm overflow-hidden bg-[#1a1a1a]">
                      <Image
                        src={m.poster}
                        alt={m.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold group-hover:text-[#e50914] transition-colors line-clamp-2 leading-tight mb-1">
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[#fbbf24] text-xs">
                        <FiStar size={10} fill="currentColor" />
                        <span className="text-[#aaa]">{m.rating}</span>
                      </div>
                      <p className="text-[#555] text-xs">{m.releaseYear}</p>
                    </div>
                  </Link>
                ))}
                {relatedMovies.length === 0 && (
                  <p className="text-[#444] text-xs italic">No related movies found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
