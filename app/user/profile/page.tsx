"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiEdit2,
  FiSave,
  FiBookmark,
  FiHeart,
  FiMessageSquare,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ watchlist: 0, favorites: 0, reviews: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (session?.user) {
      setForm({ name: session.user.name || "", bio: "" });
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/users/profile")
        .then(r => r.json())
        .then(d => {
          if (d.success) setStats(d.stats);
        })
        .catch(console.error);
    }
  }, [session]);

  if (status === "loading")
    return (
      <div className="pt-[90px] min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!session?.user) return null;

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Name is required");

    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        await update({ name: data.user.name });
        toast.success("Profile updated!");
        setEditing(false);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Account deleted successfully");
        await signOut({ redirect: false });
        router.push("/");
      } else {
        toast.error(data.error || "Failed to delete account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const STATS = [
    { icon: FiBookmark, label: "Watchlist", val: stats.watchlist, href: "/user/watchlist" },
    { icon: FiHeart, label: "Favorites", val: stats.favorites, href: "/user/favorites" },
    { icon: FiMessageSquare, label: "Reviews", val: stats.reviews, href: "/user/reviews" },
  ];

  return (
    <div className="pt-[90px] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-[#111] border border-[#1a1a1a] rounded-sm overflow-hidden mb-6">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#e50914]/20 via-[#1a1a1a] to-[#e50914]/10 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=30')] bg-cover bg-center opacity-10" />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-5">
              <div className="w-20 h-20 bg-[#e50914] rounded-full flex items-center justify-center text-white font-display font-bold text-3xl border-4 border-[#111]">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-[#ccc] text-sm font-semibold px-4 py-2 rounded-sm transition-colors"
                >
                  <FiEdit2 size={13} /> Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
                    Display Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-2.5 rounded-sm outline-none transition-colors max-w-md"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-red flex items-center gap-2 text-white font-bold px-5 py-2 rounded-sm text-sm disabled:opacity-50"
                  >
                    <FiSave size={13} />{" "}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    disabled={loading}
                    className="bg-[#1a1a1a] border border-[#333] text-[#ccc] font-bold px-5 py-2 rounded-sm text-sm hover:border-[#444] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h1 className="text-white font-display font-bold text-2xl uppercase tracking-wide">
                  {session.user.name}
                </h1>
                <div className="flex items-center gap-1.5 text-[#555] text-sm mt-1">
                  <FiMail size={12} /> {session.user.email}
                </div>
                <div className="mt-4 inline-block">
                  <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">
                    {session.user.role || "User"}
                  </span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {STATS.map(({ icon: Icon, label, val, href }) => (
                <a
                  key={label}
                  href={href}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] rounded-sm p-4 flex flex-col items-center gap-1.5 transition-all group"
                >
                  <Icon
                    size={20}
                    className="text-[#555] group-hover:text-[#e50914] transition-colors"
                  />
                  <span className="font-display font-bold text-2xl text-white">
                    {val}
                  </span>
                  <span className="text-[#555] text-xs uppercase tracking-wider">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-sm p-6">
          <h2 className="text-white font-display font-bold text-lg uppercase tracking-wide mb-2 text-[#e50914]">
            Danger Zone
          </h2>
          <p className="text-[#666] text-sm mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className="flex items-center gap-2 border border-[#e50914] text-[#e50914] hover:bg-[#e50914] hover:text-white font-bold px-5 py-2 rounded-sm text-sm transition-colors disabled:opacity-50"
          >
            <FiTrash2 size={13} />{" "}
            {loading ? "Processing..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
