"use client";

import { motion } from "framer-motion";
import { RiTestTubeLine, RiTrophyLine, RiFlaskLine, RiTimerFlashLine, RiArrowRightUpLine, RiInformationLine } from "react-icons/ri";

const mockExperiments = [
  { 
    id: "exp1", 
    title: "Project Hail Mary Review", 
    varA: "Is Project Hail Mary the Best Sci-Fi of 2026?", 
    varB: "Project Hail Mary Review: Andy Weir's Masterpiece",
    ctrA: 4.8, 
    ctrB: 3.2, 
    winner: "A",
    status: "Completed"
  },
  { 
    id: "exp2", 
    title: "The Bride! Teaser Analysis", 
    varA: "The Bride! (2025): Everything We Know", 
    varB: "Is The Bride! the Next Horror Classic?",
    ctrA: 2.1, 
    ctrB: 2.4, 
    winner: null,
    status: "Running"
  },
];

export default function ExperimentPanel() {
  return (
    <div className="glass-panel rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group">
      <div className="mb-8 flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 font-display tracking-wider">
            <span className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <RiTestTubeLine className="text-blue-500" />
            </span>
            A/B TESTING LAB
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-medium italic">Testing different titles and content</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {mockExperiments.map((exp) => (
          <motion.div 
            key={exp.id} 
            whileHover={{ y: -2 }}
            className="p-6 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group/exp hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{exp.title}</h3>
              {exp.status === "Completed" && (
                <span className="p-1 px-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-[8px] font-black flex items-center gap-1 uppercase">
                  <RiTrophyLine /> Completed
                </span>
              )}
            </div>
            
            <div className="space-y-6">
              <VariantSlot 
                label="Option A" 
                text={exp.varA} 
                ctr={exp.ctrA} 
                total={exp.ctrA + exp.ctrB} 
                isWinner={exp.winner === "A"} 
                color="blue"
              />
              <VariantSlot 
                label="Option B" 
                text={exp.varB} 
                ctr={exp.ctrB} 
                total={exp.ctrA + exp.ctrB} 
                isWinner={exp.winner === "B"} 
                color="purple"
              />
            </div>

            {exp.status === "Running" && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl hover:bg-blue-600 hover:text-white"
              >
                Finish & Use Winner
              </motion.button>
            )}
            
            <RiFlaskLine className="absolute -bottom-4 -right-4 text-white opacity-0 group-hover/exp:opacity-5 transition-opacity" size={100} />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] relative z-10">
        <RiInformationLine /> Result is 98% accurate 
      </div>
    </div>
  );
}

function VariantSlot({ label, text, ctr, total, isWinner, color }: any) {
  const percentage = (ctr / total) * 100;
  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-2">
        <div className="flex-1 max-w-[80%]">
          <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
            {label} {isWinner && <span className="text-green-500 text-[10px] animate-pulse">● WINNER</span>}
          </p>
          <p className={`text-xs font-bold ${isWinner ? "text-white" : "text-gray-400"} leading-tight tracking-tight`}>
            {text}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-white font-mono tracking-tighter">{ctr}%</p>
          <p className="text-[8px] text-gray-600 font-black uppercase">Click Rate</p>
        </div>
      </div>
      <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'} ${isWinner ? 'shadow-[0_0_8px_rgba(34,197,94,0.4)]' : ''}`}
        />
      </div>
    </div>
  );
}
