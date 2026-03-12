"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiMessageSquare, FiStar, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserReview {
  _id: string;
  movie: { title: string; slug: string };
  rating: number;
  title: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export default function UserReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated") {
      fetch("/api/user/reviews")
        .then(r => r.json())
        .then(d => setReviews(d.success && d.reviews ? d.reviews : []))
        .catch(() => setReviews([]))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
        toast.success("Review deleted");
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="pt-[90px] min-h-screen">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-7">
          <span className="w-1 h-8 bg-[#e50914] inline-block rounded-sm"/>
          <div>
            <h1 className="font-display font-bold text-3xl text-white uppercase tracking-widest flex items-center gap-2">
              <FiMessageSquare size={24}/> My Reviews
            </h1>
            <p className="text-[#555] text-sm mt-0.5">{reviews.length} reviews written</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className={`bg-[#111] border rounded-sm p-5 ${r.isApproved ? "border-[#1a1a1a]" : "border-yellow-700/30"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/movies/${r.movie?.slug || '#'}`} className="text-white hover:text-[#e50914] font-semibold text-lg transition-colors">
                        {r.movie?.title || "Unknown Movie"}
                      </Link>
                      <div className="flex items-center gap-1 bg-[#e50914] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                        <FiStar size={10} fill="currentColor"/> {r.rating}/10
                      </div>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{r.title}</h4>
                    <p className="text-[#888] text-sm leading-relaxed">{r.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[#555] text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                      {!r.isApproved && <span className="text-yellow-500 text-xs font-semibold">⚠ Pending approval</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(r._id)} className="w-8 h-8 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors flex-shrink-0">
                    <FiTrash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111] border border-[#1a1a1a] rounded-sm">
            <FiMessageSquare size={48} className="mx-auto text-[#222] mb-4"/>
            <p className="text-[#555] mb-4">You haven't written any reviews yet</p>
            <Link href="/movies" className="btn-red inline-block text-white font-bold px-6 py-2.5 rounded-sm text-sm">Review a Movie</Link>
          </div>
        )}
      </div>
    </div>
  );
}
