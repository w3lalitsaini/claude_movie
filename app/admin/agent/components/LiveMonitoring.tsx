"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiTerminal, FiRotateCcw, FiSettings, FiCpu, FiInfo, FiZap } from "react-icons/fi";

interface LogEntry {
  _id: string;
  action: string;
  status: string;
  details: string;
  metadata?: {
    level: string;
    agent: string;
    timestamp: string;
    reasoning?: {
      thought: string;
      alternatives: string[];
      decision: string;
      confidence: number;
    };
  };
  createdAt: string;
}

export default function LiveMonitoring() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/admin/agent/logs");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;
        
        setLogs((prev) => {
          const newLogs = [...prev, data];
          return newLogs.slice(-100); 
        });
      } catch (e) {
        console.error("SSE JSON Parse Error", e);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE failed:", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelStyles = (level?: string) => {
    switch (level) {
      case "success": return "border-yellow-500/30 bg-yellow-500/5 text-yellow-500 shadow-yellow-500/5";
      case "warning": return "border-orange-500/30 bg-orange-500/5 text-orange-400";
      case "error": return "border-red-500/30 bg-red-500/5 text-red-400 shadow-red-500/5";
      case "thinking": return "border-blue-500/30 bg-blue-500/5 text-blue-400 shadow-blue-500/5";
      case "decisive": return "border-purple-500/30 bg-purple-500/5 text-purple-400";
      default: return "border-white/10 bg-white/5 text-gray-400";
    }
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-full shadow-2xl relative scanline border-white/5 hover:border-white/10 transition-all">
      {/* Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500 text-black rounded-2xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <FiTerminal />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-display tracking-widest uppercase">
              Live AI Logs
            </h2>
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">Live Updates</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[8px] text-green-500 font-black tracking-widest uppercase">AI Online</span>
          </div>
          <FiSettings className="text-gray-600 hover:text-white cursor-pointer transition-colors" size={20} />
        </div>
      </div>
      
      {/* Log Container */}
      <div 
        ref={scrollRef}
        className="flex-1 p-8 font-mono text-[10px] overflow-y-auto space-y-6 bg-black/20 custom-scrollbar scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-gray-600 space-y-6"
            >
              <div className="relative">
                <FiTerminal size={56} className="opacity-10 animate-pulse" />
                <FiZap className="absolute inset-0 m-auto text-yellow-500/20 animate-bounce" size={24} />
              </div>
              <p className="font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Syncing AI Data...</p>
            </motion.div>
          ) : (
            logs.map((log) => (
              <motion.div 
                key={log._id}
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className={`p-5 rounded-3xl border transition-all hover:translate-x-1 group border-l-4 ${getLevelStyles(log.metadata?.level)}`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] font-black opacity-40">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span className="px-3 py-1 bg-black/40 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/50">
                      {log.metadata?.agent || "SYSTEM"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">ID:</span>
                    <span className="text-[8px] font-mono font-bold text-gray-700">{log._id.slice(-6)}</span>
                  </div>
                </div>
                
                <p className="text-white/90 leading-relaxed font-bold text-xs mb-4 selection:bg-yellow-500/30">
                  {log.details}
                </p>

                {log.metadata?.reasoning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 pt-4 border-t border-white/5 space-y-4"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mt-4 overflow-hidden relative group/reasoning hover:bg-yellow-500/5 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20">
                          <FiZap size={14} />
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">AI Reasoning</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="text-yellow-500 mt-1 opacity-50"><FiZap size={10} /></div>
                          <p className="text-[10px] text-gray-400 font-mono leading-relaxed italic">
                            "{log.metadata.reasoning.thought}"
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <div className="flex flex-wrap gap-2">
                            {log.metadata.reasoning.alternatives.map((alt, i) => (
                              <span key={i} className="text-[8px] bg-white/5 text-gray-500 px-3 py-1 rounded-xl border border-white/5 font-black uppercase tracking-tighter hover:text-white transition-colors">
                                {alt}
                              </span>
                            ))}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[8px] text-yellow-500 font-black uppercase block leading-none mb-1.5 tracking-widest">Best Choice</span>
                            <span className="text-[11px] text-white font-black tracking-tight uppercase bg-yellow-500/20 px-2 py-0.5 rounded-lg border border-yellow-500/30">{log.metadata.reasoning.decision}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[9px] px-4 py-2 bg-white/5 text-gray-400 hover:text-white hover:bg-yellow-500 hover:text-black rounded-xl border border-white/10 hover:border-transparent font-black uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <FiRotateCcw /> VIEW DETAILS
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Info */}
      <div className="p-5 bg-black/60 border-t border-white/5 text-[9px] text-center text-gray-600 font-black tracking-[0.5em] uppercase shrink-0">
        AI System Online <span className="text-[8px] font-mono ml-4 text-gray-700">NODE: 01</span>
      </div>

    </div>
  );
}
