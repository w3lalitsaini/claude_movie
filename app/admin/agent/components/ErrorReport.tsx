"use client";

import { motion } from "framer-motion";
import { RiErrorWarningLine, RiAlarmWarningLine, RiSpamLine, RiRefreshLine, RiDeleteBin7Line, RiInformationLine, RiBugLine } from "react-icons/ri";

const mockErrors = [
  { id: "err1", task: "Twitter Sharing", error: "Too many requests to Twitter", time: "2h ago", severity: "High" },
  { id: "err2", task: "Movie Data Fetch", error: "Connection Timeout", time: "5h ago", severity: "Medium" },
  { id: "err3", task: "YouTube Upload", error: "Login Session Expired", time: "1d ago", severity: "Critical" },
];

export default function ErrorReport() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
              <RiBugLine className="text-red-500" />
            </span>
            ERROR LOGS
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Tracking errors and system failures</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">3 ERRORS</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {mockErrors.map((err, idx) => (
          <motion.div 
            key={err.id} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 border rounded-2xl relative overflow-hidden group/err hover:bg-white/5 transition-all cursor-help ${
              err.severity === "Critical" ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/5"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-white uppercase tracking-tight truncate group-hover/err:text-red-400 transition-colors">
                  {err.task}
                </h3>
                <p className="text-[10px] text-gray-500 font-black mt-1 uppercase tracking-widest">{err.time}</p>
              </div>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-widest ${
                err.severity === "Critical" ? "bg-red-500 text-white border-red-500" : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}>
                {err.severity}
              </span>
            </div>
            
            <p className="text-xs text-red-400/80 font-bold mb-6 italic">
              "{err.error}"
            </p>

            <div className="flex gap-3">
              <button className="flex-1 py-2.5 bg-white text-black hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-red-500/20">
                <RiRefreshLine size={16} /> Try Again
              </button>
              <button className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all">
                <RiDeleteBin7Line size={16} />
              </button>
            </div>
            
            {err.severity === "Critical" && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-red-500/15 to-transparent pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Errors are listed live 
      </div>
    </div>
  );
}
