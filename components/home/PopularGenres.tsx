import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const GENRES = [
  { name: "Action", emoji: "💥", count: "1200+", color: "from-red-900/60 to-red-950/80" },
  { name: "Drama", emoji: "🎭", count: "900+", color: "from-blue-900/60 to-blue-950/80" },
  { name: "Thriller", emoji: "🔪", count: "650+", color: "from-gray-800/60 to-gray-900/80" },
  { name: "Sci-Fi", emoji: "🚀", count: "480+", color: "from-purple-900/60 to-purple-950/80" },
  { name: "Romance", emoji: "💕", count: "720+", color: "from-pink-900/60 to-pink-950/80" },
  { name: "Comedy", emoji: "😂", count: "540+", color: "from-yellow-900/60 to-yellow-950/80" },
  { name: "Horror", emoji: "👻", count: "390+", color: "from-zinc-800/60 to-black/80" },
  { name: "Adventure", emoji: "🌍", count: "430+", color: "from-green-900/60 to-green-950/80" },
];

export default function PopularGenres() {
  return (
    <section className="py-10 border-t border-[#1a1a1a]">
      <SectionHeader title="Popular Genres" subtitle="Browse by genre" viewAllHref="/search" />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {GENRES.map((genre) => (
          <Link
            key={genre.name}
            href={`/movies?genre=${genre.name}`}
            className={`group bg-gradient-to-br ${genre.color} border border-[#222] hover:border-[#444] rounded-sm p-4 flex flex-col items-center gap-2 transition-all hover:-translate-y-1`}
          >
            <span className="text-2xl">{genre.emoji}</span>
            <span className="font-display font-bold text-sm text-white uppercase tracking-wider group-hover:text-[#e50914] transition-colors">
              {genre.name}
            </span>
            <span className="text-[#666] text-xs">{genre.count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
