"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiBrainLine, RiDatabase2Line, RiHistoryLine, RiCompassLine, RiInformationLine } from "react-icons/ri";

const mockMemory = [
  { id: "mem1", entityId: "project-hail-mary", type: "movie", score: 98, lastAction: "create", context: "Popular + Sci-Fi Niche" },
  { id: "mem2", entityId: "bollywood-trends-2026", type: "blog", score: 75, lastAction: "update", context: "Social Media Spike" },
  { id: "mem3", entityId: "the-bride-horror", type: "movie", score: 40, lastAction: "optimize", context: "Low clicks detected" },
];

export default function MemoryViewer() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20">
              <RiBrainLine className="text-pink-500" />
            </span>
            AI MEMORY
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Recent actions and learned data</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">512 ENTRIES</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {mockMemory.map((mem, idx) => (
          <motion.div 
            key={mem.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 bg-white/5 border border-white/5 rounded-2xl group/mem hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                  <RiDatabase2Line className="text-pink-500/50" /> Item Name/ID
                </p>
                <h3 className="text-sm font-black text-white truncate group-hover/mem:text-pink-400 transition-colors">{mem.entityId}</h3>
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                  mem.score > 80 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                }`}>
                  <RiHistoryLine size={12} /> {mem.score}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Tag text={mem.type} />
              <Tag text={mem.lastAction} color="text-pink-400" />
            </div>
            
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-start gap-3">
              <RiCompassLine className="text-gray-600 mt-0.5 shrink-0" />
              <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed">
                "{mem.context}"
              </p>
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-pink-500/5 to-transparent pointer-events-none" />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Memory is updated live 
      </div>
    </div>
  );
}

function Tag({ text, color = "text-gray-400" }: { text: string, color?: string }) {
  return (
    <span className={`text-[8px] bg-white/5 ${color} px-2 py-1 rounded border border-white/5 font-black uppercase tracking-widest`}>
      {text}
    </span>
  );
}
