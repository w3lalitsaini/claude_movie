"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiSave, FiUpload, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Reviews",
  "Top Lists",
  "News",
  "Analysis",
  "Opinion",
  "Awards",
  "Industry",
  "Interviews",
];
const SAMPLE_TAGS = [
  "bollywood",
  "hollywood",
  "south-hindi",
  "web-series",
  "ott",
  "action",
  "drama",
  "thriller",
];

export default function EditBlogPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "Reviews",
    tags: [] as string[],
    status: "draft",
    metaTitle: "",
    metaDescription: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setForm({
            title: d.post.title || "",
            slug: d.post.slug || "",
            excerpt: d.post.excerpt || "",
            content: d.post.content || "",
            featuredImage: d.post.featuredImage || "",
            category: d.post.category || "Reviews",
            tags: d.post.tags || [],
            status: d.post.status || "draft",
            metaTitle: d.post.metaTitle || "",
            metaDescription: d.post.metaDescription || "",
          });
        } else {
          toast.error("Post not found");
          router.push("/admin/blog");
        }
      })
      .catch(() => toast.error("Failed to fetch post"))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const toggleTag = (tag: string) => {
    setForm((p) => ({
      ...p,
      tags: p.tags.includes(tag)
        ? p.tags.filter((t) => t !== tag)
        : [...p.tags, tag],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((p) => ({ ...p, featuredImage: data.media.url }));
        toast.success("Image uploaded successfully");
      } else toast.error(data.error || "Upload failed");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent, submitStatus?: string) => {
    if (e) e.preventDefault();
    setSaving(true);
    const finalForm = { ...form };
    if (submitStatus) finalForm.status = submitStatus;

    try {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Post updated!");
        router.push("/admin/blog");
      } else toast.error(data.error || "Failed to update");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-0 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-0 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-[#1a1a1a] border border-[#222] text-[#888] rounded-sm flex items-center justify-center hover:text-white transition-colors"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
              Edit Blog Post
            </h1>
            <p className="text-[#555] text-sm">Update existing post content</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e)}
            disabled={saving}
            className="btn-red flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-sm text-sm"
          >
            <FiSave size={14} /> Save Changes
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
            Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({ ...p, status: e.target.value }))
              }
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
            Featured Image
          </label>
          <div className="flex gap-3">
            {form.featuredImage && (
              <img
                src={form.featuredImage}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-sm border border-[#2a2a2a]"
              />
            )}
            <input
              value={form.featuredImage}
              onChange={(e) =>
                setForm((p) => ({ ...p, featuredImage: e.target.value }))
              }
              placeholder="Image URL"
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            />
            <label className="cursor-pointer bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-[#ccc] px-5 rounded-sm flex items-center justify-center transition-colors">
              {uploadingImage ? "..." : <FiUpload size={16} />}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
            Excerpt
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) =>
              setForm((p) => ({ ...p, excerpt: e.target.value }))
            }
            rows={2}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none resize-none transition-colors"
          />
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
            Content (Markdown)
          </label>
          <textarea
            value={form.content}
            onChange={(e) =>
              setForm((p) => ({ ...p, content: e.target.value }))
            }
            required
            rows={15}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none resize-y transition-colors font-mono"
          />
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-xs font-semibold rounded-sm border transition-all ${form.tags.includes(tag) ? "bg-[#e50914] border-[#e50914] text-white" : "bg-[#111] border-[#2a2a2a] text-[#888] hover:border-[#444]"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-6">
          <p className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-3">
            SEO Meta
          </p>
          <div className="space-y-3">
            <input
              value={form.metaTitle}
              onChange={(e) =>
                setForm((p) => ({ ...p, metaTitle: e.target.value }))
              }
              placeholder="Meta Title"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            />
            <textarea
              value={form.metaDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, metaDescription: e.target.value }))
              }
              rows={2}
              placeholder="Meta Description"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none resize-none transition-colors"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
