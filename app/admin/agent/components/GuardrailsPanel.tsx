"use client";

import { motion } from "framer-motion";
import { RiShieldFlashLine, RiErrorWarningLine, RiSpamLine, RiShieldUserLine, RiCloseCircleLine, RiCheckDoubleLine, RiInformationLine } from "react-icons/ri";

const mockRejections = [
  { id: "rej1", title: "Free Movie Download Link", reason: "Spam / High Risk", agent: "safety-agent", cost: "$0.02" },
  { id: "rej2", title: "Untitled Movie Review #4", reason: "Incorrect Content Detected", agent: "safety-agent", cost: "$0.05" },
];

export default function GuardrailsPanel() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <RiShieldFlashLine className="text-red-500" />
            </span>
            CONTENT SAFETY
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Filtering out spam and incorrect AI content</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Filter Active</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {mockRejections.map((rej, idx) => (
          <motion.div 
            key={rej.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl relative overflow-hidden group/rej hover:bg-red-500/10 transition-all cursor-crosshair"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-red-400 truncate group-hover/rej:text-red-300 transition-colors uppercase tracking-tight">
                  {rej.title}
                </h3>
                <p className="text-[10px] text-gray-500 font-bold mt-1 flex items-center gap-2">
                  <RiSpamLine className="text-red-500/40" /> {rej.reason}
                </p>
              </div>
              <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                BLOCKED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 border-y border-white/5 py-3">
              <div>
                <p className="text-[8px] text-gray-600 font-black uppercase">AI Worker</p>
                <p className="text-[10px] text-gray-400 font-bold">{rej.agent}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-gray-600 font-black uppercase">AI Cost</p>
                <p className="text-[10px] text-red-500/50 font-bold">{rej.cost}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2">
                <RiCloseCircleLine size={16} /> Delete
              </button>
              <button className="flex-1 py-2.5 bg-green-500/10 hover:bg-green-500 hover:text-white text-green-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-green-500/20 flex items-center justify-center gap-2">
                <RiCheckDoubleLine size={16} /> Override
              </button>
            </div>
            
            <RiShieldUserLine className="absolute -bottom-4 -right-4 text-red-500 opacity-5 group-hover/rej:opacity-10 transition-opacity" size={100} />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Safety check is live 
      </div>
    </div>
  );
}
