"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiPlus, FiX, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";

const GENRES = [
  "Action",
  "Drama",
  "Thriller",
  "Sci-Fi",
  "Romance",
  "Comedy",
  "Horror",
  "Adventure",
  "Animation",
  "Crime",
  "Biography",
  "Fantasy",
  "War",
  "History",
];
const LANGUAGES = [
  "Hindi",
  "English",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Bengali",
];
const QUALITIES = ["4K", "1080P", "720P", "480P", "HDRip", "BluRay", "WEB-DL"];
const CATEGORIES = [
  { value: "bollywood", label: "Bollywood" },
  { value: "hollywood", label: "Hollywood" },
  { value: "south-hindi", label: "South Hindi Dubbed" },
  { value: "dual-audio", label: "Dual Audio" },
  { value: "web-series", label: "Web Series" },
];
const PLATFORMS = ["None", "Netflix", "Amazon Prime", "Disney+ Hotstar", "Zee5", "SonyLIV", "JioCinema", "Apple TV+", "Youtube"];

interface MovieForm {
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  releaseYear: number;
  duration: number;
  imdbRating: number;
  language: string;
  category: string;
  platform: string;
  director: string;
  genres: string[];
  quality: string[];
  isTrending: boolean;
  isFeatured: boolean;
  isTopRated: boolean;
  status: string;
  metaTitle: string;
  metaDescription: string;
}

export default function NewMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MovieForm>({
    title: "",
    description: "",
    poster: "",
    backdrop: "",
    trailerUrl: "",
    releaseYear: new Date().getFullYear(),
    duration: 120,
    imdbRating: 0,
    language: "Hindi",
    category: "bollywood",
    platform: "None",
    director: "",
    genres: [],
    quality: [],
    isTrending: false,
    isFeatured: false,
    isTopRated: false,
    status: "active",
    metaTitle: "",
    metaDescription: "",
  });
  const [cast, setCast] = useState<
    { name: string; character: string; photo: string }[]
  >([]);
  const [downloadLinks, setDownloadLinks] = useState<
    { quality: string; size: string; url: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "poster" | "backdrop",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((p) => ({ ...p, [field]: data.media.url }));
        toast.success(`${field} uploaded successfully`);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed due to network error");
    } finally {
      setUploadingField(null);
    }
  };

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const handleSubmit = async (e?: React.FormEvent, submitStatus?: "active" | "inactive") => {
    if (e) e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    const finalForm = { ...form, cast, downloadLinks };
    if (submitStatus) finalForm.status = submitStatus;
    
    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Movie added successfully!");
        router.push("/admin/movies");
      } else {
        toast.error(data.error || "Failed to add movie");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["basic", "media", "cast", "downloads", "seo"];

  return (
    <div className="pt-30 p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
            Add New Movie
          </h1>
          <p className="text-[#555] text-sm mt-0.5">
            Fill in the details below
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="bg-[#1a1a1a] border border-[#333] text-[#ccc] font-bold px-4 py-2.5 rounded-sm text-sm hover:border-[#444] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "inactive")}
            disabled={loading}
            className="bg-[#222] border border-[#333] hover:border-[#555] text-white font-bold px-5 py-2.5 rounded-sm text-sm transition-colors flex items-center gap-2"
          >
            <FiSave size={14} /> Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "active")}
            disabled={loading}
            className="btn-red flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-sm text-sm shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] transition-shadow"
          >
            🚀 Upload & Publish
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1a1a1a] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? "text-[#e50914] border-b-2 border-[#e50914]"
                : "text-[#555] hover:text-[#aaa]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Tab */}
        {activeTab === "basic" && (
          <div className="space-y-5">
            <FormRow>
              <Field label="Movie Title *" required>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                  placeholder="Enter movie title"
                  className="admin-input"
                />
              </Field>
              <Field label="Category *" required>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="admin-input"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </FormRow>

            <Field label="Description *" required>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                required
                rows={5}
                placeholder="Movie description / synopsis..."
                className="admin-input resize-none"
              />
            </Field>

            <FormRow>
              <Field label="Director">
                <input
                  value={form.director}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, director: e.target.value }))
                  }
                  placeholder="Director name"
                  className="admin-input"
                />
              </Field>
              <Field label="Language">
                <select
                  value={form.language}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, language: e.target.value }))
                  }
                  className="admin-input"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <Field label="Streaming Platform">
                <select
                  value={form.platform}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, platform: e.target.value }))
                  }
                  className="admin-input"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
            </FormRow>

            <FormRow>
              <Field label="Release Year">
                <input
                  type="number"
                  value={form.releaseYear}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      releaseYear: Number(e.target.value),
                    }))
                  }
                  min={1900}
                  max={2030}
                  className="admin-input"
                />
              </Field>
              <Field label="Duration (min)">
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, duration: Number(e.target.value) }))
                  }
                  min={1}
                  className="admin-input"
                />
              </Field>
              <Field label="IMDb Rating">
                <input
                  type="number"
                  value={form.imdbRating}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      imdbRating: Number(e.target.value),
                    }))
                  }
                  min={0}
                  max={10}
                  step={0.1}
                  className="admin-input"
                />
              </Field>
            </FormRow>

            <Field label="Genres">
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        genres: toggleArray(p.genres, g),
                      }))
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      form.genres.includes(g)
                        ? "bg-[#e50914] border-[#e50914] text-white"
                        : "bg-[#111] border-[#2a2a2a] text-[#888] hover:border-[#444]"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Quality">
              <div className="flex flex-wrap gap-2">
                {QUALITIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        quality: toggleArray(p.quality, q),
                      }))
                    }
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      form.quality.includes(q)
                        ? "bg-[#1a4a8a] border-[#1a4a8a] text-white"
                        : "bg-[#111] border-[#2a2a2a] text-[#888] hover:border-[#444]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex flex-wrap gap-5">
              {[
                { key: "isTrending", label: "Trending" },
                { key: "isFeatured", label: "Featured (Hero)" },
                { key: "isTopRated", label: "Top Rated" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form[key as keyof MovieForm] as boolean}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.checked }))
                    }
                    className="w-4 h-4 accent-[#e50914]"
                  />
                  <span className="text-[#aaa] text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === "media" && (
          <div className="space-y-5">
            <Field label="Poster URL / Upload">
              <div className="flex gap-2 h-[38px]">
                {form.poster && (
                  <img 
                    src={form.poster} 
                    alt="Poster preview" 
                    className="shrink-0 w-10 h-full object-cover rounded-sm border border-[#2a2a2a]" 
                  />
                )}
                <input
                  value={form.poster}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, poster: e.target.value }))
                  }
                  placeholder="https://... or upload file"
                  className="admin-input"
                />
                <label className="flex-shrink-0 cursor-pointer bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-[#ccc] px-4 rounded-sm flex items-center justify-center transition-colors">
                  {uploadingField === "poster" ? "..." : <FiUpload size={14} />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "poster")}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>
            </Field>
            <Field label="Backdrop URL / Upload">
              <div className="flex gap-2 h-[38px]">
                {form.backdrop && (
                  <img 
                    src={form.backdrop} 
                    alt="Backdrop preview" 
                    className="shrink-0 w-16 h-full object-cover rounded-sm border border-[#2a2a2a]" 
                  />
                )}
                <input
                  value={form.backdrop}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, backdrop: e.target.value }))
                  }
                  placeholder="Wide backdrop image URL"
                  className="admin-input"
                />
                <label className="flex-shrink-0 cursor-pointer bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] text-[#ccc] px-4 rounded-sm flex items-center justify-center transition-colors">
                  {uploadingField === "backdrop" ? (
                    "..."
                  ) : (
                    <FiUpload size={14} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "backdrop")}
                    disabled={uploadingField !== null}
                  />
                </label>
              </div>
            </Field>
            <Field label="YouTube Trailer URL">
              <input
                value={form.trailerUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, trailerUrl: e.target.value }))
                }
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="admin-input"
              />
            </Field>
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === "cast" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {cast.map((actor, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-[#111] border border-[#1a1a1a] rounded-sm p-4"
                >
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <input
                      value={actor.name}
                      onChange={(e) => {
                        const n = [...cast];
                        n[idx].name = e.target.value;
                        setCast(n);
                      }}
                      placeholder="Actor name"
                      className="admin-input"
                    />
                    <input
                      value={actor.character}
                      onChange={(e) => {
                        const n = [...cast];
                        n[idx].character = e.target.value;
                        setCast(n);
                      }}
                      placeholder="Character name"
                      className="admin-input"
                    />
                    <input
                      value={actor.photo}
                      onChange={(e) => {
                        const n = [...cast];
                        n[idx].photo = e.target.value;
                        setCast(n);
                      }}
                      placeholder="Photo URL"
                      className="admin-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCast(cast.filter((_, i) => i !== idx))}
                    className="w-8 h-8 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors shrink-0 mt-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setCast([...cast, { name: "", character: "", photo: "" }])
              }
              className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] hover:border-[#e50914]/40 text-[#888] hover:text-white px-4 py-2.5 rounded-sm text-sm transition-all"
            >
              <FiPlus size={14} /> Add Cast Member
            </button>
          </div>
        )}

        {/* Downloads Tab */}
        {activeTab === "downloads" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {downloadLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start bg-[#111] border border-[#1a1a1a] rounded-sm p-4"
                >
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    <select
                      value={link.quality}
                      onChange={(e) => {
                        const n = [...downloadLinks];
                        n[idx].quality = e.target.value;
                        setDownloadLinks(n);
                      }}
                      className="admin-input"
                    >
                      {QUALITIES.map((q) => (
                        <option key={q}>{q}</option>
                      ))}
                    </select>
                    <input
                      value={link.size}
                      onChange={(e) => {
                        const n = [...downloadLinks];
                        n[idx].size = e.target.value;
                        setDownloadLinks(n);
                      }}
                      placeholder="File size (e.g., 1.5 GB)"
                      className="admin-input"
                    />
                    <input
                      value={link.url}
                      onChange={(e) => {
                        const n = [...downloadLinks];
                        n[idx].url = e.target.value;
                        setDownloadLinks(n);
                      }}
                      placeholder="Download URL"
                      className="admin-input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDownloadLinks(
                        downloadLinks.filter((_, i) => i !== idx),
                      )
                    }
                    className="w-8 h-8 bg-[#e50914]/20 hover:bg-[#e50914]/40 text-[#e50914] rounded-sm flex items-center justify-center transition-colors shrink-0 mt-1"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setDownloadLinks([
                  ...downloadLinks,
                  { quality: "1080P", size: "", url: "" },
                ])
              }
              className="flex items-center gap-2 bg-[#111] border border-[#2a2a2a] hover:border-[#e50914]/40 text-[#888] hover:text-white px-4 py-2.5 rounded-sm text-sm transition-all"
            >
              <FiPlus size={14} /> Add Download Link
            </button>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === "seo" && (
          <div className="space-y-5">
            <Field label="Meta Title">
              <input
                value={form.metaTitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metaTitle: e.target.value }))
                }
                placeholder="SEO title (defaults to movie title)"
                className="admin-input"
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                value={form.metaDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, metaDescription: e.target.value }))
                }
                rows={3}
                placeholder="SEO description (150-160 chars)"
                className="admin-input resize-none"
              />
            </Field>

          </div>
        )}
      </form>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          color: white;
          font-size: 0.875rem;
          padding: 0.625rem 0.875rem;
          border-radius: 0.125rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .admin-input:focus {
          border-color: #e50914;
        }
        .admin-input option {
          background: #111;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[#666] text-xs uppercase tracking-wider font-semibold mb-1.5 block">
        {label} {required && <span className="text-[#e50914]">*</span>}
      </label>
      {children}
    </div>
  );
}

function FormRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {children}
    </div>
  );
}
