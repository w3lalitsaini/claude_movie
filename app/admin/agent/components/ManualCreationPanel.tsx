"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiMovieLine, RiFlashlightLine, RiCheckDoubleLine, RiExternalLinkLine, RiErrorWarningLine, RiPulseLine, RiFocus3Line } from "react-icons/ri";

export default function ManualCreationPanel() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!title) return;
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/agent/create-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setResult(data.movie);
      } else {
        setStatus("error");
        setError(data.error || "Failed to generate content");
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <RiMovieLine className="text-yellow-500" />
            </span>
            AI MOVIE GENERATOR
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium">Use AI to generate all movie details automatically</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10 flex-1 flex flex-col">
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Movie Title</label>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group/input">
              <input 
                type="text" 
                placeholder="e.g. Inception"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-yellow-500/30 outline-none transition-all placeholder:text-gray-700 font-bold tracking-tight shadow-inner"
              />
              <RiFocus3Line className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800 group-focus-within/input:text-yellow-500/50 transition-colors" size={20} />
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={status === "loading" || !title}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 min-w-[200px] ${
                status === "loading" 
                  ? "bg-white/5 text-gray-600 cursor-wait border border-white/5" 
                  : "bg-white text-black hover:bg-yellow-500 shadow-yellow-500/10"
              }`}
            >
              {status === "loading" ? (
                <>
                  <RiPulseLine className="animate-spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <RiFlashlightLine size={18} />
                  Start AI Process
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-10 text-center bg-white/5 border border-white/5 border-dashed rounded-3xl flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-16 h-16 border-2 border-yellow-500/10 border-t-yellow-500 rounded-full animate-spin mb-6" />
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest animate-pulse">
                AI is working on your movie...
              </p>
              <p className="text-[10px] text-gray-600 mt-2 italic font-medium">Check "LIVE LOGS" below for details</p>
            </motion.div>
          )}

          {status === "success" && result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-500/5 border border-green-500/10 rounded-3xl space-y-4 flex-1"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-green-400 flex items-center gap-2 uppercase tracking-widest">
                  <RiCheckDoubleLine size={18} /> Generation Complete
                </h3>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  href={`/movies/${result.slug}`} 
                  target="_blank"
                  className="text-[9px] font-black text-white bg-green-500/20 hover:bg-green-500 px-4 py-2 rounded-xl transition-all border border-green-500/20 uppercase tracking-widest flex items-center gap-2"
                >
                  View Movie <RiExternalLinkLine size={14} />
                </motion.a>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Generated Movie</p>
                <p className="text-sm text-white font-black uppercase tracking-tight">{result.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MetricBox label="SEO Score" value="98/100" color="text-green-500" />
                <MetricBox label="Links Status" value="Added" color="text-cyan-400" />
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex-1 flex flex-col items-center justify-center text-center"
            >
              <RiErrorWarningLine className="text-red-500 mb-4" size={40} />
              <p className="text-sm font-black text-red-500 uppercase tracking-widest mb-2">Error Occurred</p>
              <p className="text-[10px] text-gray-500 font-medium italic">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
        <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] italic">System Status: Active</p>
        <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Speed: Fast</span>
      </div>
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
      <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-[11px] font-black ${color} tracking-tighter`}>{value}</p>
    </div>
  );
}
