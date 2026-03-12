"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { FiCalendar, FiUser } from "react-icons/fi";

const DEMO_POSTS = [
  {
    _id: "b1",
    title: "Top 10 Bollywood Movies of 2024 You Must Watch",
    slug: "top-10-bollywood-2024",
    excerpt: "From action-packed blockbusters to emotional dramas, 2024 was an incredible year for Bollywood cinema.",
    featuredImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
    category: "Top Lists",
    author: { name: "CineVerse Team" },
    createdAt: new Date("2024-12-15").toISOString(),
    tags: ["bollywood", "top10"],
  },
  {
    _id: "b2",
    title: "Hollywood's Best Sci-Fi Films: A Deep Dive Review",
    slug: "hollywood-best-scifi",
    excerpt: "Science fiction cinema has evolved dramatically. Here are the must-watch films that redefined the genre.",
    featuredImage: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&q=80",
    category: "Reviews",
    author: { name: "Movie Critic" },
    createdAt: new Date("2024-12-10").toISOString(),
    tags: ["hollywood", "scifi"],
  },
  {
    _id: "b3",
    title: "Why South Indian Cinema is Taking Over: The Phenomenon",
    slug: "south-indian-cinema-rise",
    excerpt: "KGF, RRR, Pushpa — South Indian films have captured the hearts of pan-India audiences.",
    featuredImage: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
    category: "Analysis",
    author: { name: "Film Scholar" },
    createdAt: new Date("2024-12-05").toISOString(),
    tags: ["south-hindi", "trending"],
  },
];

export default function BlogSection() {
  const [posts, setPosts] = useState<typeof DEMO_POSTS>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?limit=3")
      .then((r) => r.json())
      .then((d) => setPosts(d.success && d.posts?.length ? d.posts : DEMO_POSTS))
      .catch(() => setPosts(DEMO_POSTS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section className="py-10 border-t border-[#1a1a1a]">
      <SectionHeader title="Latest Blog Posts" subtitle="Reviews, news & top lists" viewAllHref="/blog" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post, idx) => (
          <Link key={post._id} href={`/blog/${post.slug}`} className="group block">
            <div className="bg-[#111] border border-[#1a1a1a] hover:border-[#333] rounded-sm overflow-hidden transition-all hover:-translate-y-1">
              <div className={`relative overflow-hidden ${idx === 0 ? "h-52" : "h-40"}`}>
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover card-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />
                <span className="absolute top-3 left-3 bg-[#e50914] text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm leading-tight mb-2 group-hover:text-[#e50914] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[#666] text-xs leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-[#555] text-xs">
                  <span className="flex items-center gap-1">
                    <FiUser size={10} />
                    {post.author?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={10} />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
