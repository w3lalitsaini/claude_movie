"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiUser, FiEye, FiTag } from "react-icons/fi";
import AdUnit from "@/components/ui/AdUnit";

const DEMO_POSTS = Array.from({ length: 9 }, (_, i) => ({
  _id: String(i),
  title: [
    "Top 10 Bollywood Movies of 2024 You Must Watch",
    "Hollywood Sci-Fi Films: A Deep Dive Review",
    "Why South Indian Cinema is Taking Over",
    "Best OTT Web Series to Binge Right Now",
    "Oscar 2024 Predictions: Who Will Win?",
    "OTT vs Theatre: The Great Debate",
    "Action Movies That Changed Cinema Forever",
    "Directors to Watch in 2024",
    "The Rise of Pan-India Films",
  ][i],
  slug: `post-${i + 1}`,
  excerpt:
    "Discover the most compelling stories, stunning performances, and cinematic masterpieces that defined entertainment this year.",
  featuredImage: `https://images.unsplash.com/photo-${["1536440136628-849c177e76a1", "1574267432553-4b4628081c31", "1518676590629-3dcbd9c5a5c9", "1489599849927-2ee91cede3ba", "1485846234645-a62644f84728", "1595769816263-9b910be24d5f", "1536440136628-849c177e76a1", "1574267432553-4b4628081c31", "1518676590629-3dcbd9c5a5c9"][i]}?w=600&q=80`,
  category: [
    "Top Lists",
    "Reviews",
    "Analysis",
    "Lists",
    "Awards",
    "Opinion",
    "Reviews",
    "Industry",
    "Analysis",
  ][i],
  author: {
    name: [
      "CineVerse Team",
      "Movie Critic",
      "Film Scholar",
      "OTT Expert",
      "Awards Watch",
      "Cinema Buff",
      "Action Fan",
      "Director's Cut",
      "Bollywood Beat",
    ][i],
  },
  views: [12400, 8900, 15600, 7200, 4500, 6800, 9100, 3200, 11000][i],
  createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  tags: [
    ["bollywood", "top10"],
    ["hollywood", "scifi"],
    ["south", "analysis"],
    ["ott", "series"],
    ["awards", "oscar"],
    ["opinion"],
    ["action", "classics"],
    ["directors"],
    ["bollywood", "trends"],
  ][i],
}));

const ALL_CATEGORIES = [
  "All",
  "Reviews",
  "Top Lists",
  "Analysis",
  "News",
  "Opinion",
  "Awards",
  "Industry",
];

export default function BlogPage() {
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?limit=9")
      .then((r) => r.json())
      .then((d) =>
        setPosts(d.success && d.posts?.length ? d.posts : DEMO_POSTS),
      )
      .catch(() => setPosts(DEMO_POSTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="pt-[90px] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="mb-8">
          <AdUnit />
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl text-[#111] dark:text-white uppercase tracking-widest mb-2 flex items-center gap-3">
            <span className="w-1 h-10 bg-[#e50914] inline-block rounded-sm" />
            CineVerse Blog
          </h1>
          <p className="text-gray-600 dark:text-[#666] ml-5">
            Reviews, top lists, industry news & more
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm border transition-all ${activeCategory === cat ? "bg-[#e50914] border-[#e50914] text-white" : "bg-white dark:bg-[#111] border-gray-200 dark:border-[#222] text-gray-600 dark:text-[#888] hover:border-gray-500 dark:hover:border-[#444] hover:text-[#111] dark:hover:text-white"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block mb-8 group">
            <div className="relative h-80 md:h-[420px] rounded-sm overflow-hidden border border-[#1a1a1a] hover:border-[#333] transition-colors">
              <Image
                src={featured.featuredImage}
                alt={featured.title}
                fill
                className="object-cover card-image"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="max-w-2xl">
                  <span className="inline-block bg-[#e50914] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-3">
                    {featured.category}
                  </span>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-white uppercase tracking-wide leading-tight mb-3 group-hover:text-[#e50914] transition-colors drop-shadow-md">
                    {featured.title}
                  </h2>
                  <p className="text-[#aaa] text-sm leading-relaxed mb-4 line-clamp-2">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-[#666] text-xs">
                    <span className="flex items-center gap-1">
                      <FiUser size={10} /> {featured.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={10} />{" "}
                      {new Date(featured.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiEye size={10} /> {featured.views.toLocaleString()}{" "}
                      views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="mb-8">
          <AdUnit layout="in-article" format="fluid" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] hover:border-gray-300 dark:hover:border-[#333] rounded-sm overflow-hidden transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-transparent">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover card-image"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 dark:from-[#111] to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#e50914] text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-[#111] dark:text-white font-semibold text-sm leading-tight mb-2 group-hover:text-[#e50914] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 dark:text-[#666] text-xs leading-relaxed mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-gray-400 dark:text-[#555] text-xs">
                    <span className="flex items-center gap-1">
                      <FiUser size={10} /> {post.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={10} />{" "}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <FiEye size={10} /> {post.views.toLocaleString()}
                    </span>
                  </div>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[#444] text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <AdUnit />
        </div>
      </div>
    </div>
  );
}
