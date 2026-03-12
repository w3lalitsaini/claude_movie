"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave, FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";

const CATEGORIES = ["Reviews","Top Lists","News","Analysis","Opinion","Awards","Industry","Interviews"];
const SAMPLE_TAGS = ["bollywood","hollywood","south-hindi","web-series","ott","action","drama","thriller"];

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", featuredImage: "",
    category: "Reviews", tags: [] as string[], status: "draft",
    metaTitle: "", metaDescription: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const toggleTag = (tag: string) => {
    setForm(p => ({ ...p, tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag] }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setForm((p) => ({ ...p, featuredImage: data.media.url }));
        toast.success("Image uploaded successfully");
      } else toast.error(data.error || "Upload failed");
    } catch {
      toast.error("Upload failed due to network error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setForm(p => ({ ...p, content: text }));
        toast.success("File content imported!");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e?: React.FormEvent, submitStatus?: "draft" | "published") => {
    if (e) e.preventDefault();
    if (!form.title || !form.content) { toast.error("Title and content are required"); return; }
    setLoading(true);
    const finalForm = { ...form };
    if (submitStatus) finalForm.status = submitStatus;
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm),
      });
      const data = await res.json();
      if (data.success) { toast.success("Post created!"); router.push("/admin/blog"); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="pt-28 p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">New Blog Post</h1>
          <p className="text-[#555] text-sm mt-0.5">Create a new post</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="bg-[#1a1a1a] border border-[#333] text-[#ccc] font-bold px-4 py-2.5 rounded-sm text-sm hover:border-[#444] transition-colors">Cancel</button>
          <button type="button" onClick={(e) => handleSubmit(e, "draft")} disabled={loading} className="bg-[#222] border border-[#333] hover:border-[#555] text-white font-bold px-5 py-2.5 rounded-sm text-sm transition-colors flex items-center gap-2">
            <FiSave size={14}/> Draft
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, "published")} disabled={loading} className="btn-red flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-sm text-sm shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] transition-shadow">
            🚀 Upload & Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Title *</label>
          <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} required placeholder="Post title"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors" />
        </div>

        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Featured Image URL / Upload</label>
          <div className="flex gap-2">
            {form.featuredImage && (
              <img 
                src={form.featuredImage} 
                alt="Featured image preview" 
                className="shrink-0 w-[46px] h-[46px] object-cover rounded-sm border border-[#2a2a2a]" 
              />
            )}
            <input value={form.featuredImage} onChange={e => setForm(p => ({...p, featuredImage: e.target.value}))} placeholder="https://... or upload local image"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors" />
            <label className="shrink-0 cursor-pointer bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-[#ccc] px-5 rounded-sm flex items-center justify-center transition-colors">
              {uploadingImage ? "..." : <FiUpload size={16} />}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => setForm(p => ({...p, excerpt: e.target.value}))} rows={2} placeholder="Short description..."
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none resize-none transition-colors" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[#666] text-xs uppercase tracking-wider font-semibold">Content *</label>
            <label className="cursor-pointer text-[#e50914] text-xs font-bold hover:underline py-1">
              Import .md/.txt File
              <input type="file" accept=".md,.txt,text/*" className="hidden" onChange={handleFileImport} />
            </label>
          </div>
          <textarea value={form.content} onChange={e => setForm(p => ({...p, content: e.target.value}))} required rows={12} placeholder="Write your post content here... (Markdown supported)"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none resize-y transition-colors font-mono" />
        </div>

        <div>
          <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TAGS.map(tag => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${form.tags.includes(tag) ? "bg-[#e50914] border-[#e50914] text-white" : "bg-[#111] border-[#2a2a2a] text-[#888] hover:border-[#444]"}`}>
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-5">
          <p className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-3">SEO Settings</p>
          <div className="space-y-3">
            <input value={form.metaTitle} onChange={e => setForm(p => ({...p, metaTitle: e.target.value}))} placeholder="Meta title (optional)"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none transition-colors" />
            <textarea value={form.metaDescription} onChange={e => setForm(p => ({...p, metaDescription: e.target.value}))} rows={2} placeholder="Meta description (optional)"
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#e50914] text-white text-sm px-4 py-3 rounded-sm outline-none resize-none transition-colors" />
          </div>
        </div>
      </form>
    </div>
  );
}
