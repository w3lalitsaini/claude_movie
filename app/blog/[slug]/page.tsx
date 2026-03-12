"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import AdUnit from "@/components/ui/AdUnit";
import {
  FiCalendar,
  FiUser,
  FiEye,
  FiTag,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";

// Demo data removed.

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPost(d.post);
          // Fetch comments
          fetch(`/api/blog/comments?blogId=${d.post._id}`)
            .then((r) => r.json())
            .then((cd) => setComments(cd.success ? cd.comments : []));
          
          // Fetch related
          fetch(`/api/blog?category=${d.post.category}&limit=4`)
            .then((r) => r.json())
            .then((rd) => setRelatedPosts(rd.success ? rd.posts.filter((p: any) => p._id !== d.post._id) : []));
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to comment");
      return;
    }
    if (!commentContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: post._id, content: commentContent }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Comment added!");
        setComments((prev) => [data.comment, ...prev]);
        setCommentContent("");
      } else {
        toast.error(data.error || "Failed to add comment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-[90px] h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return (
    <div className="pt-[150px] text-center">
      <h1 className="text-white text-2xl font-bold">Post not found</h1>
      <Link href="/blog" className="text-[#e50914] mt-4 inline-block hover:underline">Back to Blog</Link>
    </div>
  );

  return (
    <div className="pt-[90px] min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#666] hover:text-[#e50914] text-sm mb-5 transition-colors"
            >
              <FiArrowLeft size={14} /> Back to Blog
            </Link>

            {/* Category */}
            <div className="mb-4">
              <span className="bg-[#e50914] text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                {post.category}
              </span>
            </div>

            <div className="my-6">
              <AdUnit layout="in-article" format="fluid" />
            </div>

            {/* Title */}
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white uppercase tracking-wide leading-tight mb-5">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-[#666] text-sm mb-6 pb-6 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#e50914] rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                  {post.author?.name?.charAt(0)}
                </div>
                <span className="text-[#aaa]">{post.author?.name}</span>
              </div>
              <span className="flex items-center gap-1">
                <FiCalendar size={12} />{" "}
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <FiEye size={12} /> {post.views?.toLocaleString()} views
              </span>
            </div>

            {/* Content */}
            <div className="prose-content text-[#bbb] leading-relaxed space-y-4">
              {post.content.split("\n\n").map((para: string, i: number) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      className="font-display font-bold text-xl text-white uppercase tracking-wide mt-8 mb-3 flex items-center gap-2"
                    >
                      <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                return (
                  <p key={i} className="text-[#aaa] leading-relaxed">
                    {para}
                  </p>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-2 flex-wrap">
                <FiTag size={14} className="text-[#555]" />
                {post.tags?.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="bg-[#111] border border-[#222] hover:border-[#e50914]/40 hover:text-[#e50914] text-[#666] text-xs px-3 py-1 rounded-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12 pt-10 border-t border-[#1a1a1a]">
              <h2 className="font-display font-bold text-lg uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#e50914] inline-block rounded-sm" />{" "}
                Comments ({comments.length})
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-10">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={session ? "Leave a comment..." : "Login to leave a comment"}
                  disabled={!session || submitting}
                  className="w-full bg-[#111] border border-[#222] focus:border-[#e50914] text-white text-sm p-4 rounded-sm outline-none min-h-[100px] resize-none transition-colors mb-3"
                />
                {session && (
                  <button
                    type="submit"
                    disabled={submitting || !commentContent.trim()}
                    className="btn-red text-white font-bold px-8 py-2 rounded-sm text-sm disabled:opacity-50"
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                )}
              </form>

              <div className="space-y-6">
                {comments.map((comment: any) => (
                  <div key={comment._id} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#e50914] rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm uppercase">
                      {comment.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 bg-[#111] border border-[#1a1a1a] p-4 rounded-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">{comment.user.name}</span>
                        <span className="text-[#555] text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#aaa] text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-[#555] text-sm italic">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-28">
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-[#e50914] inline-block rounded-sm" />{" "}
                Related Posts
              </h3>
              <div className="space-y-4">
                {relatedPosts.map((r: any) => (
                  <Link
                    key={r._id}
                    href={`/blog/${r.slug}`}
                    className="flex gap-3 group"
                  >
                    <div className="relative w-20 h-14 flex-shrink-0 rounded-sm overflow-hidden bg-[#111]">
                      <Image
                        src={r.featuredImage}
                        alt={r.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[#e50914] text-[10px] font-bold uppercase tracking-wider">
                        {r.category}
                      </span>
                      <h4 className="text-[#aaa] group-hover:text-white text-xs leading-tight mt-0.5 transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                    </div>
                  </Link>
                ))}
                {relatedPosts.length === 0 && (
                  <p className="text-[#444] text-xs italic">No related posts found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
