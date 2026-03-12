"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiUpload,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiImage,
  FiLink,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface MediaItem {
  _id: string;
  url: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success) {
        setMedia(data.media);
      }
    } catch {
      toast.error("Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      toast.success("URL copied!");
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setMedia((prev) => prev.filter((m) => m._id !== id));
        toast.success("Media deleted");
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("File uploaded successfully!");
        fetchMedia(); // refresh list
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // reset input
    }
  };

  const handleUrlUpload = async () => {
    const url = window.prompt("Enter image URL to upload to Cloudinary:");
    if (!url) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("url", url);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("URL uploaded successfully!");
        fetchMedia();
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading media...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white uppercase tracking-widest">
            Media Library
          </h1>
          <p className="text-[#555] text-sm mt-0.5">{media.length} files</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleUrlUpload}
            disabled={uploading}
            className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] flex items-center gap-2 text-[#ccc] font-bold px-4 py-2.5 rounded-sm text-sm"
          >
            <FiLink size={14} /> Upload URL
          </button>
          <label className="btn-red flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-sm text-sm cursor-pointer">
            <FiUpload size={14} /> {uploading ? "Uploading..." : "Upload File"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Upload zone */}
      <label className="block mb-6 border-2 border-dashed border-[#2a2a2a] hover:border-[#e50914]/40 rounded-sm p-10 text-center cursor-pointer transition-colors group">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <FiImage
          size={40}
          className="mx-auto text-[#333] group-hover:text-[#e50914]/50 transition-colors mb-3"
        />
        <p className="text-[#666] text-sm">
          Drag & drop images here or{" "}
          <span className="text-[#e50914]">browse files</span>
        </p>
        <p className="text-[#444] text-xs mt-1">
          Supports JPG, PNG, WebP. Connected to Cloudinary.
        </p>
        {uploading && (
          <p className="text-[#e50914] text-xs mt-2 font-bold animate-pulse">
            Uploading to Cloudinary...
          </p>
        )}
      </label>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {media.map((m) => (
          <div
            key={m._id}
            className="group relative bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-hidden hover:border-[#333] transition-colors"
          >
            <div className="relative h-28">
              <Image src={m.url} alt={m.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopy(m.url, m._id)}
                  className="w-8 h-8 bg-[#111] rounded-full flex items-center justify-center text-white hover:bg-[#222] transition-colors"
                  title="Copy URL"
                >
                  {copied === m._id ? (
                    <FiCheck size={13} className="text-green-400" />
                  ) : (
                    <FiCopy size={13} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="w-8 h-8 bg-[#e50914]/80 rounded-full flex items-center justify-center text-white hover:bg-[#e50914] transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
            <div className="p-2 truncate break-all">
              <p className="text-[#888] text-xs truncate" title={m.name}>
                {m.name}
              </p>
              <p className="text-[#555] text-xs">{m.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
